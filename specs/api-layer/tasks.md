# API Layer - 任务清单

- [x] T-01: [后端] 实现 nodesRouter (~3h)
  - 依赖: 无
  - 文件: packages/api/src/routers/nodes.ts
  - AC: 所有 Node CRUD API 实现完成

- [x] T-02: [后端] 实现 nodeDataRouter (~2h)
  - 依赖: 无
  - 文件: packages/api/src/routers/node-data.ts
  - AC: 数据上报和查询 API 实现完成

- [x] T-03: [后端] 集成到 appRouter (~20min)
  - 依赖: T-01, T-02
  - 文件: packages/api/src/routers/index.ts
  - AC: 无

- [ ] T-04: [测试] 类型检查 (~15min)
  - 依赖: T-01, T-02, T-03
  - 文件: packages/api/src (全部文件)
  - AC: 类型检查通过

- [ ] T-05: [测试] 测试 API (~1h)
  - 依赖: T-01, T-02, T-03
  - 文件: (手动测试，无文件改动)
  - AC: 可通过 tRPC 客户端调用
