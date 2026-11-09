# API Layer - 任务清单

## Task 2.1: 实现 nodesRouter

- [x] 创建 `packages/api/src/routers/nodes.ts`
- [x] 实现 list procedure (搜索+筛选)
- [x] 实现 get procedure
- [x] 实现 create procedure (唯一性检查)
- [x] 实现 update procedure
- [x] 实现 delete procedure
- [x] 实现 calculateNodeStatus 函数

**状态**: ✅ 已完成

---

## Task 2.2: 实现 nodeDataRouter

- [x] 创建 `packages/api/src/routers/node-data.ts`
- [x] 实现 report procedure (上报+更新状态)
- [x] 实现 list procedure (时间范围查询)
- [x] 实现 latest procedure

**状态**: ✅ 已完成

---

## Task 2.3: 集成到 appRouter

- [x] 在 `packages/api/src/routers/index.ts` 中导入
- [x] 挂载 nodes 和 nodeData 路由

**状态**: ✅ 已完成

---

## Task 2.4: 类型检查

- [ ] 运行 `pnpm run check-types --filter=@IonNode/api`
- [ ] 修复类型错误（如有）

**状态**: ⏸️ 待执行

---

## Task 2.5: 测试 API

- [ ] 启动 server
- [ ] 使用 tRPC client 测试 CRUD
- [ ] 测试数据上报
- [ ] 测试状态计算

**状态**: ⏸️ 待执行

**Depends on**: 数据库配置完成
