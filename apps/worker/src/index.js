import { AwsClient } from "aws4fetch";

const publicRoutes = new Set([
    "GET /api/auth/get-session",
    "POST /api/auth/sign-up/email",
    "POST /api/auth/sign-in/email",
    "POST /api/auth/sign-out",
]);

const protectedRoutes = new Set([
    "GET /trpc/privateData",
    "GET /trpc/nodes.list",
    "GET /trpc/github.lookup",
    "POST /trpc/github.save",
    "GET /trpc/github.list",
    "POST /trpc/github.updateNote",
    "POST /trpc/github.delete",
]);

function unauthorized() {
    return Response.json(
        { error: "UNAUTHORIZED", message: "请先登录" },
        {
            status: 401,
            headers: { "Cache-Control": "no-store" },
        }
    );
}

async function serveFrontend(request, env, incomingUrl) {
    if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method Not Allowed", {
            status: 405,
            headers: { Allow: "GET, HEAD" },
        });
    }

    if (!env.PAGES_ORIGIN) {
        return new Response("Frontend is not configured", { status: 503 });
    }

    try {
        const target = new URL(env.PAGES_ORIGIN);

        if (
            target.protocol !== "https:" ||
            !target.hostname.endsWith(".pages.dev")
        ) {
            return new Response("Invalid frontend configuration", {
                status: 503,
            });
        }

        target.pathname = incomingUrl.pathname;
        target.search = incomingUrl.search;

        // 静态站点不需要接收登录 Cookie 或认证信息。
        const headers = new Headers();

        for (const name of [
            "accept",
            "if-none-match",
            "if-modified-since",
            "range",
        ]) {
            const value = request.headers.get(name);

            if (value !== null) {
                headers.set(name, value);
            }
        }

        const upstream = await fetch(target.toString(), {
            method: request.method,
            headers,
            redirect: "manual",
        });

        // Pages 的路径重定向也要保留 Worker 域名。
        const location = upstream.headers.get("location");

        if (
            upstream.status >= 300 &&
            upstream.status < 400 &&
            location
        ) {
            const redirectTarget = new URL(location, target);

            if (redirectTarget.origin !== target.origin) {
                return new Response("Unexpected frontend redirect", {
                    status: 502,
                });
            }

            const browserTarget = new URL(incomingUrl.origin);
            browserTarget.pathname = redirectTarget.pathname;
            browserTarget.search = redirectTarget.search;
            browserTarget.hash = redirectTarget.hash;

            return new Response(null, {
                status: upstream.status,
                headers: {
                    Location: browserTarget.toString(),
                    "Cache-Control": "no-store",
                },
            });
        }

        const response = new Response(upstream.body, upstream);
        response.headers.delete("Set-Cookie");

        if (!incomingUrl.pathname.startsWith("/_next/static/")) {
            response.headers.set("Cache-Control", "no-cache");
        }

        return response;
    } catch {
        return new Response("Frontend request failed", {
            status: 502,
            headers: { "Cache-Control": "no-store" },
        });
    }
}

export default {
    async fetch(request, env) {
        const incomingUrl = new URL(request.url);
        const route = `${request.method} ${incomingUrl.pathname}`;
        const requiresLogin = protectedRoutes.has(route);

        if (!publicRoutes.has(route) && !requiresLogin) {
            const isApiPath =
                incomingUrl.pathname === "/api" ||
                incomingUrl.pathname.startsWith("/api/") ||
                incomingUrl.pathname === "/trpc" ||
                incomingUrl.pathname.startsWith("/trpc/");

            if (isApiPath) {
                return new Response("Not Found", { status: 404 });
            }

            return serveFrontend(request, env, incomingUrl);
        }

        if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
            return new Response("AWS credentials are not configured", {
                status: 503,
            });
        }

        const headers = new Headers();

        for (const name of [
            "accept",
            "content-type",
            "cookie",
            "origin",
            "user-agent",
        ]) {
            const value = request.headers.get(name);
            if (value !== null) {
                headers.set(name, value);
            }
        }

        const aws = new AwsClient({
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            service: "execute-api",
            region: env.AWS_REGION,
            retries: 0,
        });

        try {
            let sessionCookies = [];

            if (requiresLogin) {
                if (!headers.get("cookie")) {
                    return unauthorized();
                }

                // 通过认证服务验证 Cookie，不能只判断 Cookie 是否存在。
                const sessionUrl = new URL(
                    "/api/auth/get-session",
                    env.API_GATEWAY_ORIGIN
                );

                const sessionResponse = await aws.fetch(sessionUrl.toString(), {
                    method: "GET",
                    headers: new Headers({
                        accept: "application/json",
                        cookie: headers.get("cookie"),
                    }),
                    redirect: "manual",
                });

                if (sessionResponse.status !== 200) {
                    return new Response("Authentication service unavailable", {
                        status: 503,
                        headers: { "Cache-Control": "no-store" },
                    });
                }

                const session = await sessionResponse.json();

                if (!session?.user?.id || !session?.session?.id) {
                    return unauthorized();
                }

                // 会话续期时，把更新后的 Cookie 一并交还客户端。
                sessionCookies = sessionResponse.headers.getSetCookie();
            }

            const target = new URL(env.API_GATEWAY_ORIGIN);
            target.pathname = incomingUrl.pathname;
            target.search = incomingUrl.search;

            const body =
                request.method === "POST"
                    ? await request.arrayBuffer()
                    : undefined;

            const upstream = await aws.fetch(target.toString(), {
                method: request.method,
                headers,
                body,
                redirect: "manual",
            });

            const response = new Response(upstream.body, upstream);
            response.headers.set("Cache-Control", "no-store");

            for (const cookie of sessionCookies) {
                response.headers.append("Set-Cookie", cookie);
            }

            return response;
        } catch {
            return new Response("Upstream request failed", {
                status: 502,
                headers: { "Cache-Control": "no-store" },
            });
        }
    },
};