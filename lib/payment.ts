/** 支持的支付方式定义,前后端共用(纯类型与常量,不含密钥) */

export type PaymentMethod = "alipay" | "wechat_pay" | "card";

export type PaymentMethodOption = {
  id: PaymentMethod;
  /** 按钮主文字 */
  label: string;
  /** 按钮下方说明 */
  description: string;
  /** tailwind 背景色 class */
  accent: string;
};

export const paymentMethods: readonly PaymentMethodOption[] = [
  {
    id: "alipay",
    label: "支付宝支付",
    description: "跳转支付宝完成付款",
    accent: "bg-[#1677FF] hover:bg-[#0E6AE6]",
  },
  {
    id: "wechat_pay",
    label: "微信支付",
    description: "打开微信扫码付款",
    accent: "bg-[#07C160] hover:bg-[#06AD55]",
  },
  {
    id: "card",
    label: "信用卡支付",
    description: "Visa / Mastercard / 银联",
    accent: "bg-slate-800 hover:bg-slate-700",
  },
] as const;
