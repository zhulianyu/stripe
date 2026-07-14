"use client";

import { paymentMethods, type PaymentMethod } from "@/lib/payment";
import { CheckoutButton } from "./CheckoutButton";
import { AlipayIcon, WeChatIcon, CardIcon } from "./icons";

function IconFor({ method }: { method: PaymentMethod }) {
  switch (method) {
    case "alipay":
      return <AlipayIcon className="h-5 w-5" />;
    case "wechat_pay":
      return <WeChatIcon className="h-5 w-5" />;
    case "card":
      return <CardIcon className="h-5 w-5" />;
  }
}

type Props = {
  /** 收款金额,单位:美分 */
  amount: number;
  disabled?: boolean;
};

export function PaymentButtons({ amount, disabled }: Props) {
  return (
    <div className="grid gap-3">
      {paymentMethods.map((m) => (
        <CheckoutButton
          key={m.id}
          method={m.id}
          label={m.label}
          description={m.description}
          accent={m.accent}
          icon={<IconFor method={m.id} />}
          amount={amount}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
