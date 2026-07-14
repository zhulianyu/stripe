import Link from "next/link";

export default function CanceledPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-600">
        !
      </div>
      <h1 className="text-2xl font-bold text-slate-900">支付已取消</h1>
      <p className="mt-2 text-sm text-slate-500">
        您已取消本次支付,未被扣款。
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
      >
        重新支付
      </Link>
    </main>
  );
}
