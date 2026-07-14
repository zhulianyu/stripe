import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "在线收款 | 支付宝 / 微信 / 信用卡",
  description: "基于 Stripe 的收款页面,支持支付宝、微信支付、信用卡",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
