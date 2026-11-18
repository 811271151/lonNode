# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `pnpm exec ultracite fix`
- **Check for issues**: `pnpm exec ultracite check`
- **Diagnose setup**: `pnpm exec ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**

- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**

- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome will catch most mechanical issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm exec ultracite fix` before committing to ensure compliance.

---

## 项目目录与技术架构（按当前仓库实现）

IonNode 是由 pnpm workspace 和 Turborepo 管理的 TypeScript monorepo。以下目录图省略了依赖、缓存和构建产物；修改目录或技术边界时，请同步更新本节。

```text
IonNode/
├── apps/
│   ├── web/                 # Next.js App Router Web 应用
│   ├── native/              # Expo + React Native 移动应用（Expo Router）
│   ├── server/              # Hono HTTP 服务与 tRPC 挂载入口
│   └── fumadocs/            # Fumadocs/MDX 文档站
├── packages/
│   ├── api/                 # tRPC router、procedure、中间件和共享上下文
│   ├── auth/                # Better Auth 服务端配置
│   ├── db/                  # Prisma/PostgreSQL 客户端、schema 和迁移
│   ├── ui/                  # Web 端共享 UI primitives 与样式
│   └── config/              # 共享 TypeScript 配置
├── .agents/skills/          # 仓库内的 Agent skills
├── .claude/skills/          # Claude 工具使用的 skills
├── .codex/                 # 仓库级 Codex 配置
├── package.json             # 根脚本和 workspace 入口
├── pnpm-workspace.yaml      # workspace 与依赖 catalog
├── turbo.json               # build/dev/typecheck/db 任务编排
├── biome.json               # 根目录 Biome/Ultracite 规则
└── AGENTS.md                # 仓库级编码与架构约定
```

### 应用与包的职责

- `apps/web/src/app` 使用 Next.js App Router 管理页面和布局；`src/components` 放 Web 应用级组件，`src/utils/trpc.ts` 创建与服务器共享类型的 tRPC/React Query 客户端，`src/lib/auth-client.ts` 配置 Better Auth 浏览器客户端。Next 配置启用了 typed routes、React Compiler 和 Varlock 集成。
- `apps/native/app` 使用 Expo Router 的文件路由，`app/_layout.tsx` 组合导航、主题、React Query 和原生 UI provider。`lib/auth-client.ts` 使用 Better Auth Expo 插件及 SecureStore；`utils/trpc.ts` 连接共享 tRPC API，并为原生平台转发认证 cookie。
- `apps/server/src/index.ts` 通过 `@hono/node-server` 在 Node.js 上启动 Hono 服务（端口 3000），配置 CORS 和日志，挂载 Better Auth 的 `/api/auth/*` 及 tRPC 的 `/trpc/*`，并提供 `/` 健康响应。`src/services.ts` 根据服务端环境配置创建数据库与认证实例；`src/context.ts` 为每次 tRPC 请求读取会话并注入 `db`、`session`。
- `apps/fumadocs` 是独立的 Next.js 文档应用；MDX 内容位于 `content/docs`，Fumadocs source adapter 位于 `src/lib/source.ts`，另有文档页面、搜索和 LLM 文本路由。其开发端口配置为 4000。
- `apps/worker/` is the Cloudflare Worker entry point responsible for sending SigV4-signed requests to AWS API Gateway.
- `packages/api` 定义共享的 tRPC 上下文、公开/受保护 procedure 和 `appRouter`。当前 router 实际包含 `healthCheck` 与需登录的 `privateData`；Web 和 Native 从 `AppRouter` 推导客户端类型。新增 API procedure 时放在此包，并通过 Hono server 暴露。
- `packages/auth` 导出 `createAuth(env, database)`，使用 Better Auth 的 Prisma adapter、邮箱密码登录与 Expo 插件；不要在此包中硬编码环境值。
- `packages/db` 通过 Prisma 7 的 PostgreSQL adapter 创建客户端。Prisma schema 在 `prisma/schema/`，当前 schema 主要包含 Better Auth 的 User、Session、Account、Verification 模型；数据库配置和迁移目录也由此包管理。
- `packages/ui` 导出按路径导入的 Web React 组件、全局样式和工具函数，主要供 Web 端复用。不要假设 Native 已使用此 Web UI 包；Native 当前使用 HeroUI Native、Uniwind 和自己的组件目录。
- `packages/config/tsconfig.base.json` 是各 workspace TypeScript 配置的共享基线。根目录使用 Biome/Ultracite；`apps/fumadocs` 另有自己的 Biome 配置。

### 请求与数据流

```text
apps/web ─────┐                         ┌─ /api/auth/* ─ Better Auth ─┐
              ├─ tRPC + AppRouter ──────┤                              ├─ Prisma ─ PostgreSQL
apps/native ──┘                         └─ /trpc/* ─ Hono ─ packages/api┘
                                                     └─ context: session + db
```

Hono server 是当前 API 和认证 HTTP 入口；tRPC router、上下文和 procedure 保持在共享 `packages/api` 中。认证和数据库实例由 `apps/server` 初始化并注入，不要让前端或共享 API 包自行读取服务端密钥或创建环境耦合的连接。

### 环境变量、生成文件与常用命令

- 环境变量 schema 分别位于各应用或包的 `.env.schema`，由 Varlock 生成 `src/env.ts` 类型访问器。修改 schema 后运行 `pnpm run env:generate`；不要手工编辑生成的 env 类型，也不要把 `.env` 中的值复制到文档或提交中。
- Prisma schema 变更后先运行 `pnpm run db:generate` 更新客户端；本地数据库同步使用 `pnpm run db:push`，迁移使用 `pnpm run db:migrate`。这些操作涉及数据库时，应按用户指定的目标环境执行。
- 根目录使用 `pnpm` 管理依赖，Turbo 编排 workspace 任务。主要命令为 `pnpm run dev`、`pnpm run dev:web`、`pnpm run dev:server`、`pnpm run dev:native`、`pnpm run build`、`pnpm run check-types` 和 `pnpm run check`。Web 开发端口为 3001，API 服务端口为 3000，文档站端口为 4000；Native 由 Expo 管理开发服务器。
- Better Auth 配置或插件改变后，使用 `pnpm run auth:generate` 更新 `packages/db/prisma/schema/auth.prisma`，检查生成的 schema，再走相应的数据库更新流程。
