"use client";

import {
  priceTiers,
  MIN_AMOUNT_CENTS,
  MAX_AMOUNT_CENTS,
  formatUsd,
} from "@/lib/pricing";

type Props = {
  /** 当前选中的档位 id,null 表示自定义金额模式 */
  selectedTierId: string | null;
  /** 自定义金额输入值(美元数字字符串) */
  customValue: string;
  onSelectTier: (tierId: string) => void;
  onCustomChange: (value: string) => void;
};

export function AmountSelector({
  selectedTierId,
  customValue,
  onSelectTier,
  onCustomChange,
}: Props) {
  const isCustom = selectedTierId === null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {priceTiers.map((tier) => {
          const active = selectedTierId === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelectTier(tier.id)}
              className={`rounded-2xl border-2 p-4 text-center transition ${
                active
                  ? "border-brand bg-brand-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div
                className={`text-2xl font-bold ${
                  active ? "text-brand" : "text-slate-900"
                }`}
              >
                {tier.label}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {tier.description}
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <label
          htmlFor="custom-amount"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          自定义金额(美元)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            $
          </span>
          <input
            id="custom-amount"
            type="number"
            min={MIN_AMOUNT_CENTS / 100}
            max={MAX_AMOUNT_CENTS / 100}
            step="0.01"
            inputMode="decimal"
            placeholder="如 59.99"
            value={isCustom ? customValue : ""}
            onChange={(e) => onCustomChange(e.target.value)}
            className={`w-full rounded-xl border-2 py-2.5 pl-7 pr-3 outline-none transition ${
              isCustom
                ? "border-brand bg-brand-50"
                : "border-slate-200 bg-white focus:border-slate-400"
            }`}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          最低 {formatUsd(MIN_AMOUNT_CENTS)},最高 {formatUsd(MAX_AMOUNT_CENTS)}
        </p>
      </div>
    </div>
  );
}
