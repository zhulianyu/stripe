import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { serverConfig } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 必须读取原始 body 用于签名验证,不能用 request.json()
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "缺少 stripe-signature 请求头" },
      { status: 400 }
    );
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      serverConfig.stripeWebhookSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "未知错误";
    return NextResponse.json(
      { error: `Webhook 签名验证失败:${message}` },
      { status: 400 }
    );
  }

  // 纯收款模式:订单在 Stripe Dashboard 查看
  // 如需本地记录订单,可在此处扩展(写入数据库 / 发送通知等)
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // 可用字段:session.id / session.amount_total / session.payment_status
      // 示例扩展点:
      // await saveOrder({ id: session.id, amount: session.amount_total, status: session.payment_status })
      void session;
      break;
    }
    default:
      // 忽略其他事件类型
      break;
  }

  return NextResponse.json({ received: true });
}
