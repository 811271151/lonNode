# IonNode 部署与运维手册

[返回项目交付说明](../README.md) · [在线演示](https://ionnode-api-proxy.homeworkdev.workers.dev/) · [首次部署记录](https://github.com/811271151/lonNode/actions/runs/44250772180)

## 生产资源

| 组件 | 本次部署 |
| --- | --- |
| Cloudflare Pages | `ionnode-web`，生产分支 `main`，静态产物 `apps/web/out` |
| Cloudflare Worker | `ionnode-api-proxy`，浏览器入口，配置见 [wrangler.jsonc](../apps/worker/wrangler.jsonc) |
| API Gateway | 悉尼区域 HTTP API，`$default` 自动部署阶段；`ANY /` 和 `ANY /{proxy+}` 使用 `AWS_IAM` |
| Lambda | `ionnode-api`，Node.js 24.x / arm64，处理器 `lambda.handler`，挂载两个私有应用子网 |
| Aurora | `ionnode-aurora`，Aurora PostgreSQL Serverless v2，I/O 优化，0.5–2 ACU，一个私有 writer，数据库 `ionnode` |
| EC2 堡垒机 | `ionnode-bastion`，公有子网内运行 SSH；入口 22 按操作者当前公网 IP 的 `/32` 授权 |

| 子网组 | CIDR | 路由 |
| --- | --- | --- |
| 公有 A / B | `10.0.1.0/24`、`10.0.2.0/24` | `0.0.0.0/0` → IGW |
| 应用私有 A / B | `10.0.11.0/24`、`10.0.12.0/24` | `0.0.0.0/0` → 各自 AZ 的公有 NAT Gateway |
| 数据库私有 A / B | `10.0.21.0/24`、`10.0.22.0/24` | VPC local |

## 配置放在哪里

| 位置 | 配置名称 | 用途 |
| --- | --- | --- |
| Web 构建 | `NEXT_PUBLIC_SERVER_URL` | 公开 Worker 地址，构建时写入浏览器产物 |
| Worker 普通变量 | `AWS_REGION`、`API_GATEWAY_ORIGIN`、`PAGES_ORIGIN` | AWS 签名区域、网关地址、Pages 静态站上游 |
| Worker Secrets | `AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY` | 仅用于 Worker 签名，IAM 权限限定到本 API 的 `execute-api:Invoke` |
| Lambda 环境 | `NODE_ENV`、`BETTER_AUTH_URL`、`CORS_ORIGIN` | 生产模式及认证来源，后两项指向 Worker 入口 |
| Lambda 环境 | `BETTER_AUTH_SECRET`、`DATABASE_URL`、`NODE_EXTRA_CA_CERTS` | 会话密钥、应用账号数据库连接、RDS CA 路径 |
| GitHub Actions | 变量 `CLOUDFLARE_ACCOUNT_ID`、Secret `CLOUDFLARE_API_TOKEN` | 上传 Pages 与发布 Worker |
| 本机迁移进程 | `IONNODE_MIGRATION_URL` | 使用管理员账号通过隧道执行迁移 |

Lambda 使用 `ionnode_app` 连接 Aurora writer。连接串启用 `sslmode=verify-full`，`sslrootcert` 和 `NODE_EXTRA_CA_CERTS` 指向 `/var/task/certs/aws-rds-global-bundle.pem`。应用账号有业务表所需读写权限，迁移使用 `postgres` 管理账号。凭据值保存在各自的秘密配置中。

## 生产数据库迁移

1. 在 AWS 核对堡垒机的当前公网地址、入站来源和 Aurora writer 端点。在 PowerShell 中替换三个占位符，启动隧道并保持窗口开启。

   ```powershell
   $writer = '<Aurora writer 端点>'
   $bastion = '<堡垒机当前公网地址>'
   $keyFile = '<SSH 私钥绝对路径>'
   ssh -N -o ExitOnForwardFailure=yes -o ServerAliveInterval=60 -i $keyFile -L "127.0.0.1:15432:${writer}:5432" "ec2-user@$bastion"
   ```

2. 使用 Navicat 连接 `127.0.0.1:15432` 上的 `ionnode`，实际执行 SQL 确认链路可用。建议核对 `current_database()`、当前账号和 TLS 状态。此时 Navicat 直接连接本机端口，外层 SSH 由上一条命令负责。
3. 核对待应用的 [迁移 SQL](../packages/db/prisma/migrations)。在另一个 PowerShell 的仓库根目录设置进程级 `IONNODE_MIGRATION_URL`，目标为 `postgres@127.0.0.1:15432/ionnode`，对密码进行 URL 编码。设置连接超时时间以覆盖隧道和数据库启动时间。使用 TLS，采用能验证数据库证书的客户端配置时优先进行验证。由于转发目标是本机地址，需要区分数据库证书验证与 SSH 主机指纹验证。
4. 执行迁移，并用实际数据库记录确认完成。迁移后清理当前终端中的临时连接变量。

   ```powershell
   pnpm --filter '@IonNode/db' exec prisma migrate deploy --config prisma.tunnel.config.ts
   ```

首次上线已应用 `20261116000100_init` 和 `20261117000200_add_github_profiles`。通过 Navicat 验证了新表和 `ionnode_app` 的 SELECT、INSERT、UPDATE、DELETE 权限。生产 schema 变更先审阅 SQL 和兼容性，按顺序执行数据库迁移与依赖该变更的代码发布。

## 自动发布与验收

[Deploy IonNode](../.github/workflows/deploy.yml) 在推送 `main` 后自动运行，也支持在 Actions 页从 `main` 手动运行。生产发布串行执行。

1. 使用 Node.js 24 安装冻结的依赖，生成 Prisma Client，检查服务端类型并构建 Lambda、Next.js 与 Worker。Prisma 生成使用占位连接地址，托管 Runner 无需访问 Aurora。
2. 将 Lambda 入口、模块分块和 AWS RDS CA 打进 ZIP，校验归档。
3. GitHub OIDC 通过只信任本仓库 `main` 分支的 AWS 角色 `ionnode-github-deploy` 获取临时凭据。角色可更新、读取 `ionnode-api`。更新后等待 Lambda 报告成功。
4. 用 Cloudflare Token 将 `out` 上传到 Pages，再发布 Worker。
5. 验证 Worker 首页包含 `IonNode GitHub`，且匿名请求 `/api/auth/get-session` 得到 JSON `null`。

[首次成功运行 #1](https://github.com/811271151/lonNode/actions/runs/44250772180) 由提交 [`11151d1`](https://github.com/811271151/lonNode/commit/11151d1) 推送触发，历时 1 分 32 秒。OIDC、Lambda、Pages、Worker 和公开检查均有独立成功记录。生产更新后可按 README 的演示步骤完成带会话的业务复验。

## 手工发布

已有生产资源和部署权限时，可以在项目根目录运行：

```powershell
pnpm --filter server check-types
pnpm --filter server exec tsdown --config tsdown.lambda.config.ts
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\deploy\package-lambda.ps1
```

[打包脚本](../scripts/deploy/package-lambda.ps1) 默认从当前用户 `.ssh/aws-rds-global-bundle.pem` 读取 AWS RDS CA，也可传入 `-CertificatePath`。将输出中的 `UPLOAD_ZIP` 上传到目标 Lambda，等待更新完成。ZIP 根目录应有 `lambda.mjs`，CA 路径为 `certs/aws-rds-global-bundle.pem`。

Web 构建前将 `NEXT_PUBLIC_SERVER_URL` 指向生产 Worker，然后运行：

```powershell
pnpm --filter web build
pnpm --filter '@IonNode/worker' exec wrangler pages deploy ../web/out --project-name ionnode-web --branch main
pnpm --filter '@IonNode/worker' build
pnpm --filter '@IonNode/worker' run deploy
```

Pages 命令中的 `../web/out` 相对于 `apps/worker`。该命令可能提示发现 Worker 的 Wrangler 配置并忽略它，以实际上传和部署结果为准。

## 常见故障怎么定位

| 现象 | 先确认 |
| --- | --- |
| API Gateway 直连返回 `403` | 本项目直连需要 IAM 签名。若经 Worker 也失败，核对 Worker 的 IAM 权限、网关地址和签名区域 |
| Worker API 返回 `401`，或浏览器登录后回到登录页 | 从 Worker 域名打开页面；核对请求的会话、认证基址和浏览器请求地址 |
| 跨账号更新或删除返回 `404 NOT_FOUND` | 先确认两边有有效会话，再用原账号确认测试记录存在且内容未变 |
| Lambda 调 GitHub 超时 | 检查应用子网默认路由、对应 NAT、公有子网到 IGW 的路由，再看 Lambda 日志与 GitHub 状态 |
| Prisma `P1000` / `P1001` | `P1000` 先检查密码和 URL 编码；`P1001` 先确认隧道、堡垒机 IP、安全组、writer 和连接超时 |
| Next.js 生成类型还引用已迁移路由 | 停止开发进程后清理旧的 `apps/web/.next` 和 `apps/web/tsconfig.tsbuildinfo`，重新构建 |
| PowerShell 5.1 中文备注比对失败 | 从 `RawContentStream` 读取响应字节，按 UTF-8 解码后再解析 JSON |
| Lambda 启动时找不到模块或 CA | 检查 ZIP 根目录、模块分块、CA 路径及 `lambda.handler` |

## 停用实操环境

需要停用时，先安排数据与证据留存，并暂停自动部署。确认资源只属于本项目后再按依赖顺序清理：

1. 移除公开入口与触发器，再清理 Worker、Pages、API Gateway 和 Lambda。
2. 按保留要求备份 Aurora 数据并核对恢复方式；检查删除保护，再决定是否移除集群与实例。
3. 终止专用堡垒机，检查其存储卷。删除专用 NAT Gateway 后释放未使用的 EIP，再处理自定义路由、安全组、子网、IGW 和 VPC。
4. 撤销项目专用的 Worker IAM 访问密钥、部署角色和 Cloudflare Token，清理 GitHub Actions 里的部署配置。共享的 OIDC 身份提供商按实际使用情况保留。
5. 核对剩余的快照、日志、EIP、存储卷、NAT 和数据库资源的保留状态与费用。
