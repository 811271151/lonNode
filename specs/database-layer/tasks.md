# Database Layer - 任务清单

- [x] T-01: [配置] 创建 Prisma Schema (~30min)
  - 依赖: 无
  - 文件: packages/db/prisma/schema/ionnode.prisma
  - AC: 无

- [x] T-02: [配置] 生成 Prisma Client (~15min)
  - 依赖: T-01
  - 文件: packages/db/.prisma/client (generated)
  - AC: 无

- [ ] T-03: [配置] 配置数据库连接 (~20min)
  - 依赖: 无
  - 文件: .env, packages/db/prisma/schema.prisma
  - AC: 无

- [ ] T-04: [数据] 推送 Schema 到数据库 (~15min)
  - 依赖: T-01, T-03
  - 文件: (数据库表创建)
  - AC: 无
