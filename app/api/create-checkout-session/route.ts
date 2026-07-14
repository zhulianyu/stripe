import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { serverConfig } from "@/lib/config";
import { CURRENCY, MIN_AMOUNT_CENTS, MAX_AMOUNT_CENTS } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  amount: z
    .number()
    .int("金额必须为整数")
    .min(MIN_AMOUNT_CENTS, `金额不能低于 ${MIN_AMOUNT_CENTS} 美分`)
    .max(MAX_AMOUNT_CENTS, `金额不能超过 ${MAX_AMOUNT_CENTS} 美分`),
  method: z.enum(["alipay", "wechat_pay", "card"]),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "请求体不是合法 JSON" },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "参数校验失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { amount, method } = parsed.data;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: [method],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            unit_amount: amount,
            product_data: {
              name: "在线收款",
            },
          },
        },
      ],
      // 微信支付需指定客户端类型(网页扫码)
      ...(method === "wechat_pay" && {
        payment_method_options: {
          wechat_pay: { client: "web" },
        },
      }),
      success_url: `${serverConfig.baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${serverConfig.baseUrl}/canceled`,
      submit_type: "pay",
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "未能创建支付链接" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "创建支付会话失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
