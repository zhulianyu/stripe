/** 金额档位与货币常量(USD) */

export type PriceTier = {
  /** 唯一标识 */
  id: string;
  /** 展示标签,如 "$100" */
  label: string;
  /** 金额,单位:美分(USD cents) */
  amount: number;
  /** 副标题 */
  description: string;
};

/** 预设收款档位 */
export const priceTiers: readonly PriceTier[] = [
  { id: "starter", label: "$20", amount: 2000, description: "入门" },
  { id: "standard", label: "$100", amount: 10000, description: "标准" },
  { id: "premium", label: "$200", amount: 20000, description: "高级" },
] as const;

/** Stripe 最低收款金额:$0.50 */
export const MIN_AMOUNT_CENTS = 50;

/** 单笔收款上限:$10,000 */
export const MAX_AMOUNT_CENTS = 1_000_000;

/** 收款货币 */
export const CURRENCY = "usd" as const;

/** 将美分金额格式化为美元展示字符串,如 10000 -> "$100.00" */
export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
