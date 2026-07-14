"use client";

import { useState, type ReactNode } from "react";
import type { PaymentMethod } from "@/lib/payment";

type Props = {
  method: PaymentMethod;
  label: string;
  description: string;
  accent: string;
  /** 支付方式图标 */
  icon: ReactNode;
  /** 收款金额,单位:美分 */
  amount: number;
  disabled?: boolean;
};

type CreateSessionResponse = {
  url?: string;
  error?: string;
};

export function CheckoutButton({
  method,
  label,
  description,
  accent,
  icon,
  amount,
  disabled,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (disabled || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method }),
      });

      const data: CreateSessionResponse = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "创建支付会话失败");
      }
      if (!data.url) {
        throw new Error("未返回支付链接");
      }

      // 跳转到 Stripe Checkout 托管页
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "支付发起失败,请重试");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${accent}`}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <span className="h-5 w-5 shrink-0">{icon}</span>
        )}
        <span>{loading ? "正在跳转..." : label}</span>
      </button>
      <p className="mt-1 text-center text-xs text-slate-400">{description}</p>
      {error && <p className="mt-1 text-center text-xs text-red-500">{error}</p>}
    </div>
  );
}
