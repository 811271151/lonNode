import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto max-w-3xl space-y-6 px-4 py-16">
      <h1 className="text-4xl font-bold">IonNode GitHub 资料管理</h1>
      <p className="text-lg text-muted-foreground">
        查询 GitHub 用户，保存感兴趣的资料，并添加个人备注。
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          className="rounded border px-5 py-3"
          href="/dashboard"
        >
          进入个人工作台
        </Link>
        <Link
          className="rounded border px-5 py-3"
          href="/login"
        >
          登录 / 注册
        </Link>
      </div>
    </main>
  );
}