"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  useEffect(() => {
    if (!isPending && !error && !session) {
      router.replace("/login");
    }
  }, [isPending, error, session, router]);

  if (isPending) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p role="status">正在检查登录状态……</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto space-y-4 px-4 py-8">
        <h1 className="text-2xl font-bold">暂时无法获取登录状态</h1>
        <p role="alert">请检查网络连接后重试。</p>
        <button
          className="rounded border px-4 py-2"
          onClick={() => {
            void refetch();
          }}
          type="button"
        >
          重试
        </button>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p role="status">正在前往登录页面……</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto space-y-4 px-4 py-8">
      <h1 className="text-3xl font-bold">个人工作台</h1>
      <p>欢迎，{session.user.name}</p>
      <Dashboard session={session} />
    </main>
  );
}