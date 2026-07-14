import Link from "next/link";

type SearchParams = Promise<{ session_id?: string | string[] }>;

function readSessionId(
  value: string | string[] | undefined
): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const sessionId = readSessionId(params.session_id);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand">
        ✓
      </div>
      <h1 className="text-2xl font-bold text-slate-900">支付成功</h1>
      <p className="mt-2 text-sm text-slate-500">
        感谢您的付款!我们已收到您的订单,如有问题会通过邮件与您联系。
      </p>
      {sessionId && (
        <p className="mt-3 break-all text-xs text-slate-400">
          订单号:{sessionId}
        </p>
      )}
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
      >
        返回首页
      </Link>
    </main>
  );
}
