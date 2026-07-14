"use client";

import { useMemo, useState } from "react";
import { AmountSelector } from "@/components/AmountSelector";
import { PaymentButtons } from "@/components/PaymentButtons";
import {
  priceTiers,
  MIN_AMOUNT_CENTS,
  MAX_AMOUNT_CENTS,
  formatUsd,
} from "@/lib/pricing";

export default function HomePage() {
  const [selectedTierId, setSelectedTierId] = useState<string | null>(
    "standard"
  );
  const [customValue, setCustomValue] = useState("");

  const isCustom = selectedTierId === null;

  const amount = useMemo(() => {
    if (isCustom) {
      const dollars = parseFloat(customValue);
      if (!Number.isFinite(dollars) || dollars <= 0) return 0;
      return Math.round(dollars * 100);
    }
    const tier = priceTiers.find((t) => t.id === selectedTierId);
    return tier?.amount ?? 0;
  }, [isCustom, customValue, selectedTierId]);

  const isValid = amount >= MIN_AMOUNT_CENTS && amount <= MAX_AMOUNT_CENTS;

  function handleSelectTier(tierId: string) {
    setSelectedTierId(tierId);
    setCustomValue("");
  }

  function handleCustomChange(value: string) {
    // 仅允许数字与最多两位小数
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomValue(value);
      setSelectedTierId(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">在线收款</h1>
        <p className="mt-1 text-sm text-slate-500">
          支付宝 / 微信 / 信用卡 · 安全便捷
        </p>
      </header>

      <section className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">选择金额</h2>
        <AmountSelector
          selectedTierId={selectedTierId}
          customValue={customValue}
          onSelectTier={handleSelectTier}
          onCustomChange={handleCustomChange}
        />

        <div className="my-5 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
          <span className="text-sm text-slate-500">应付金额</span>
          <span
            className={`text-xl font-bold ${
              isValid ? "text-brand" : "text-red-400"
            }`}
          >
            {formatUsd(amount)}
          </span>
        </div>

        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          选择支付方式
        </h2>
        <PaymentButtons amount={amount} disabled={!isValid} />

        {!isValid && isCustom && customValue !== "" && (
          <p className="mt-3 text-center text-xs text-red-500">
            金额需在 {formatUsd(MIN_AMOUNT_CENTS)} ~{" "}
            {formatUsd(MAX_AMOUNT_CENTS)} 之间
          </p>
        )}
      </section>

      <footer className="mt-6 text-center text-xs text-slate-400">
        由 Stripe 安全加密处理 · 资金结算至 Mercury 账户
      </footer>
    </main>
  );
}
