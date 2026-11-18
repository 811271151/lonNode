import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../index";

const usernamePattern = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;

const usernameInput = z.object({
  username: z
    .string()
    .trim()
    .min(1)
    .max(39)
    .regex(usernamePattern, "GitHub 用户名格式不正确"),
});

const githubUserSchema = z.object({
  id: z.number().int().positive(),
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.url(),
  html_url: z.url(),
  bio: z.string().nullable(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  public_repos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
});

// 查询和保存共同使用，资料由服务端从 GitHub 获取。
async function fetchGithubUser(username: string) {
  let response: Response;

  try {
    response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "IonNode",
          "X-GitHub-Api-Version": "2026-03-10",
        },
        signal: AbortSignal.timeout(10_000),
      }
    );
  } catch {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "暂时无法连接 GitHub，请稍后重试",
    });
  }

  if (response.status === 404) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "没有找到这个 GitHub 用户",
    });
  }

  if (
    response.status === 429 ||
    (response.status === 403 &&
      response.headers.get("x-ratelimit-remaining") === "0")
  ) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "GitHub 查询额度已用完，请稍后重试",
    });
  }

  if (!response.ok) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "GitHub 服务暂时无法完成查询",
    });
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "GitHub 返回了无效的响应",
    });
  }

  const result = githubUserSchema.safeParse(payload);

  if (!result.success) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "GitHub 返回的资料格式不符合预期",
    });
  }

  return result.data;
}

export const githubRouter = router({
  lookup: protectedProcedure
    .input(usernameInput)
    .query(({ input }) => fetchGithubUser(input.username)),

  save: protectedProcedure
    .input(usernameInput)
    .mutation(async ({ ctx, input }) => {
      const profile = await fetchGithubUser(input.username);
      const ownerId = ctx.session.user.id;
      const githubId = String(profile.id);

      const data = {
        login: profile.login,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        htmlUrl: profile.html_url,
        bio: profile.bio,
        company: profile.company,
        location: profile.location,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        fetchedAt: new Date(),
      };

      // 已保存则刷新公开资料，保留用户自己的备注。
      return ctx.db.githubProfile.upsert({
        where: {
          ownerId_githubId: { ownerId, githubId },
        },
        create: {
          ownerId,
          githubId,
          ...data,
        },
        update: data,
      });
    }),

  list: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).default(20),
          offset: z.number().int().min(0).max(100_000).default(0),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      return ctx.db.githubProfile.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" },
        ],
        take: input?.limit ?? 20,
        skip: input?.offset ?? 0,
      });
    }),

  updateNote: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1).max(128),
        note: z.string().trim().max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.githubProfile.updateMany({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
        data: {
          note: input.note,
        },
      });

      if (result.count !== 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "找不到这条已保存的资料",
        });
      }

      return { success: true };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1).max(128),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.githubProfile.deleteMany({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
      });

      if (result.count !== 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "找不到这条已保存的资料",
        });
      }

      return { success: true };
    }),
});