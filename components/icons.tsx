/** 支付方式真实品牌图标(SVG,内联以避免外部依赖) */

type IconProps = {
  className?: string;
};

/** 支付宝:品牌蓝底 + 白色「支」字 */
export function AlipayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="支付宝">
      <rect width="24" height="24" rx="5" fill="#1677FF" />
      <text
        x="12"
        y="16.6"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#FFFFFF"
        fontFamily='"PingFang SC","Microsoft YaHei",sans-serif'
      >
        支
      </text>
    </svg>
  );
}

/** 微信支付:品牌绿底 + 白色双对话气泡 */
export function WeChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="微信">
      <rect width="24" height="24" rx="5" fill="#07C160" />
      {/* 大气泡 */}
      <path
        d="M8.8 6.4c-2.9 0-5.3 1.9-5.3 4.3 0 1.3.7 2.5 1.9 3.3l-.5 1.6 1.9-1c.6.2 1.3.3 2 .3.2 0 .5 0 .7-.1-.1-.4-.2-.9-.2-1.3 0-2.6 2.4-4.7 5.4-4.7h.4C14 7.8 11.7 6.4 8.8 6.4z"
        fill="#FFFFFF"
      />
      <circle cx="6.5" cy="9.9" r="0.8" fill="#07C160" />
      <circle cx="11" cy="9.9" r="0.8" fill="#07C160" />
      {/* 小气泡 */}
      <path
        d="M16.5 10.9c-2.3 0-4.2 1.7-4.2 3.7 0 2.1 1.9 3.7 4.2 3.7.6 0 1.1-.1 1.6-.3l1.4.8-.4-1.3c1-.7 1.6-1.7 1.6-2.9 0-2-1.9-3.7-4.2-3.7z"
        fill="#FFFFFF"
      />
      <circle cx="15" cy="14.3" r="0.6" fill="#07C160" />
      <circle cx="18" cy="14.3" r="0.6" fill="#07C160" />
    </svg>
  );
}

/** 信用卡:深色卡面 + 品牌绿磁条 + 芯片 */
export function CardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="信用卡">
      <rect x="2" y="5" width="20" height="14" rx="2.5" fill="#1F2937" />
      <rect x="2" y="8.2" width="20" height="2.6" fill="#07C160" />
      <rect x="5" y="14" width="5.5" height="2" rx="0.4" fill="#FFFFFF" />
      <circle cx="18.5" cy="15" r="1.1" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
}
