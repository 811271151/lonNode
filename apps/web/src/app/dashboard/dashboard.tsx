"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import type { authClient } from "@/lib/auth-client";
import { useTRPCClient } from "@/utils/trpc";

type Session = typeof authClient.$Infer.Session;

const pageSize = 20;
const buttonClass =
  "rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50";

export default function Dashboard({ session }: { session: Session }) {
  return <GithubWorkspace key={session.user.id} ownerId={session.user.id} />;
}

function GithubWorkspace({ ownerId }: { ownerId: string }) {
  const client = useTRPCClient();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [offset, setOffset] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const profiles = useQuery({
    queryKey: ["github-profiles", ownerId, offset],
    queryFn: () => client.github.list.query({ limit: pageSize, offset }),
    retry: false,
  });

  async function refreshProfiles() {
    await queryClient.invalidateQueries({
      queryKey: ["github-profiles", ownerId],
    });
  }

  const lookup = useMutation({
    mutationFn: (value: string) =>
      client.github.lookup.query({ username: value }),
    onError: (error) => toast.error(error.message),
  });

  const save = useMutation({
    mutationFn: (value: string) =>
      client.github.save.mutate({ username: value }),
    onSuccess: async () => {
      setOffset(0);
      await refreshProfiles();
      toast.success("资料已保存");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateNote = useMutation({
    mutationFn: (input: { id: string; note: string }) =>
      client.github.updateNote.mutate(input),
    onSuccess: async () => {
      setEditingId(null);
      await refreshProfiles();
      toast.success("备注已更新");
    },
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => client.github.delete.mutate({ id }),
    onSuccess: async () => {
      setDeletingId(null);
      setEditingId(null);

      if (profiles.data?.length === 1 && offset > 0) {
        setOffset((value) => Math.max(0, value - pageSize));
      }

      await refreshProfiles();
      toast.success("资料已删除");
    },
    onError: (error) => toast.error(error.message),
  });

  const isWriting =
    save.isPending || updateNote.isPending || remove.isPending;

  function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = username.trim();

    if (value) {
      lookup.mutate(value);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-lg border p-5">
        <h2 className="text-xl font-semibold">查询 GitHub 用户</h2>

        <form className="flex flex-wrap gap-3" onSubmit={handleLookup}>
          <div className="flex-1 space-y-2">
            <label className="block text-sm" htmlFor="github-username">
              GitHub 用户名
            </label>
            <input
              autoCapitalize="none"
              autoComplete="off"
              className="w-full rounded border bg-background px-3 py-2"
              id="github-username"
              maxLength={39}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="例如 octocat"
              required
              spellCheck={false}
              value={username}
            />
          </div>
          <button
            className={`${buttonClass} self-end`}
            disabled={lookup.isPending || !username.trim()}
            type="submit"
          >
            {lookup.isPending ? "查询中……" : "查询"}
          </button>
        </form>

        {lookup.isError && (
          <p className="text-destructive" role="alert">
            {lookup.error.message}
          </p>
        )}

        {lookup.data && (
          <div className="space-y-3 rounded border p-4">
            <h3 className="font-semibold">
              {lookup.data.name || lookup.data.login}
              <span className="ml-2 text-sm text-muted-foreground">
                @{lookup.data.login}
              </span>
            </h3>
            <p>{lookup.data.bio || "暂无简介"}</p>
            <p className="text-sm text-muted-foreground">
              公开仓库：{lookup.data.public_repos} · 关注者：
              {lookup.data.followers} · 正在关注：{lookup.data.following}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                className="underline"
                href={lookup.data.html_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                查看 GitHub 主页
              </a>
              <button
                className={buttonClass}
                disabled={isWriting}
                onClick={() => {
                  if (lookup.data) {
                    save.mutate(lookup.data.login);
                  }
                }}
                type="button"
              >
                {save.isPending ? "保存中……" : "保存到我的资料"}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              重复保存会刷新用户资料，并保留已有备注。
            </p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">我的 GitHub 资料</h2>
          <button
            className={buttonClass}
            disabled={profiles.isFetching}
            onClick={() => {
              void profiles.refetch();
            }}
            type="button"
          >
            {profiles.isFetching ? "刷新中……" : "刷新"}
          </button>
        </div>

        {profiles.isPending && <p role="status">正在加载资料……</p>}

        {profiles.isError && (
          <p className="text-destructive" role="alert">
            列表加载失败：{profiles.error.message}
          </p>
        )}

        {profiles.isSuccess && profiles.data.length === 0 && (
          <p className="rounded-lg border p-5 text-muted-foreground">
            当前页没有资料。可以先查询一个 GitHub 用户并保存。
          </p>
        )}

        {profiles.data?.map((profile) => (
          <article className="space-y-4 rounded-lg border p-5" key={profile.id}>
            <div>
              <h3 className="font-semibold">
                {profile.name || profile.login} · @{profile.login}
              </h3>
              <a
                className="text-sm underline"
                href={profile.htmlUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub 主页
              </a>
            </div>

            <p>{profile.bio || "暂无简介"}</p>
            <p className="text-sm text-muted-foreground">
              公开仓库：{profile.publicRepos} · 关注者：{profile.followers}
            </p>

            {editingId === profile.id ? (
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  updateNote.mutate({ id: profile.id, note });
                }}
              >
                <label className="block" htmlFor={`note-${profile.id}`}>
                  备注（最多 1000 字）
                </label>
                <textarea
                  className="min-h-24 w-full rounded border bg-background p-3"
                  id={`note-${profile.id}`}
                  maxLength={1000}
                  onChange={(event) => setNote(event.target.value)}
                  value={note}
                />
                <div className="flex gap-3">
                  <button
                    className={buttonClass}
                    disabled={isWriting}
                    type="submit"
                  >
                    {updateNote.isPending ? "提交中……" : "提交备注"}
                  </button>
                  <button
                    className={buttonClass}
                    disabled={isWriting}
                    onClick={() => setEditingId(null)}
                    type="button"
                  >
                    取消
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="whitespace-pre-wrap break-words">
                  备注：{profile.note || "暂无备注"}
                </p>
                <button
                  className={buttonClass}
                  disabled={isWriting}
                  onClick={() => {
                    setEditingId(profile.id);
                    setNote(profile.note);
                    setDeletingId(null);
                  }}
                  type="button"
                >
                  修改备注
                </button>
              </div>
            )}

            {deletingId === profile.id ? (
              <div className="space-y-3 rounded border p-3">
                <p>确认从你的收藏中删除 @{profile.login}？</p>
                <div className="flex gap-3">
                  <button
                    className={buttonClass}
                    disabled={isWriting}
                    onClick={() => remove.mutate(profile.id)}
                    type="button"
                  >
                    {remove.isPending ? "删除中……" : "确认删除"}
                  </button>
                  <button
                    className={buttonClass}
                    disabled={isWriting}
                    onClick={() => setDeletingId(null)}
                    type="button"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={buttonClass}
                disabled={isWriting}
                onClick={() => setDeletingId(profile.id)}
                type="button"
              >
                删除资料
              </button>
            )}
          </article>
        ))}

        <div className="flex items-center gap-4">
          <button
            className={buttonClass}
            disabled={offset === 0 || profiles.isFetching || isWriting}
            onClick={() => {
              setOffset((value) => Math.max(0, value - pageSize));
              setEditingId(null);
              setDeletingId(null);
            }}
            type="button"
          >
            上一页
          </button>
          <span>第 {offset / pageSize + 1} 页</span>
          <button
            className={buttonClass}
            disabled={
              !profiles.isSuccess ||
              profiles.data.length < pageSize ||
              profiles.isFetching ||
              isWriting
            }
            onClick={() => {
              setOffset((value) => value + pageSize);
              setEditingId(null);
              setDeletingId(null);
            }}
            type="button"
          >
            下一页
          </button>
        </div>
      </section>
    </div>
  );
}