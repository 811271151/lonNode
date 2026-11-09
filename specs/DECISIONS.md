# 设计决策

## 已采用的假设

| 编号 | 来源 | 问题 | 采用的做法 | 影响范围 | 状态 |
|------|------|------|-----------|----------|------|
| A-01 | D-001 | 数据库连接和可达性 | 使用本地 PostgreSQL（非 Docker），DATABASE_URL 已配置为 postgresql://postgres:123456@localhost:5432/ionnode，数据库表已通过 db:push 创建，Navicat 和 Prisma 均成功连接 | 所有 features | 有效（已确认） |
| A-02 | D-002 | 测试框架配置策略 | MVP 阶段跳过自动化测试配置，使用手动验证功能，baseline.test_cmd 保持为「无」 | W6 测试节点 | 有效（已确认） |
| A-03 | W2 补齐 | tasks.md 文件与 AC 字段推断 | 根据 requirement.md 验收标准和 design.md 推断任务文件和 AC 映射关系 | 所有 features 的 tasks.md | 有效 |
| A-04 | W2 补齐 | 任务依赖推断 | 根据设计文档和组件依赖关系推断任务依赖；无明确依赖的标为「无」 | 所有 features 的 tasks.md | 有效 |
| A-05 | W3 设计审查 | Dashboard 空状态实现 | 无设备时在表格位置显示空状态提示，统计卡片仍显示全 0 值 | dashboard-page | 有效 |
| A-06 | W3 设计审查 | 相对时间显示实现 | 不引入 date-fns，自行实现简单的相对时间转换（s/m/h/d ago），lastSeenAt 为 null 显示 "Never" | dashboard-page | 有效 |
| A-07 | W3 设计审查 | UI 组件选择 | Card 使用现有 @IonNode/ui 组件；Table 使用原生 table + Tailwind；Badge 自行实现（Tailwind rounded-full + 背景色） | dashboard-page | 有效 |
| A-08 | W3 设计审查 | 详情页路由格式 | 点击行使用 useRouter 跳转至 `/dashboard/nodes/[id]`，id 为节点的数据库 id 字段 | dashboard-page, node-detail-page | 有效 |
| A-09 | W3 设计审查 | 数据轮询策略 | 使用 refetchInterval: 10000 实现 10 秒轮询，依赖 React Query 的默认失焦暂停行为 | dashboard-page | 有效 |

---

## 待用户决策

| 编号 | 来源 | 问题 | 可选方案 | 挂起的任务 | 停放分支 | 答复 |
|------|------|------|----------|-----------|----------|------|

## 架构决策 (AD)

### AD-001: 单体 Web 应用

**决策**: MVP 只开发 apps/web，不使用 apps/native

**理由**: 需求未提及移动端，Web 端可快速验证

---

### AD-002: 数据库选型

**决策**: PostgreSQL + Prisma

**理由**: 项目已配置，时序数据量不大

---

### AD-003: API 设计

**决策**: tRPC procedures，不使用 RESTful

**理由**: 类型安全，项目已使用 tRPC

---

### AD-004: 状态计算

**决策**: 状态存储在数据库，每次上报时更新

**理由**: 简化查询筛选逻辑

**替代方案**: 动态计算（被否决，筛选不便）

---

### AD-005: MVP 不做权限

**决策**: 所有 API 使用 publicProcedure

**理由**: 需求文档明确"暂不做复杂权限"

**未来**: v0.2 扩展权限系统

---

### AD-006: UI 组件库

**决策**: shadcn/ui + Tailwind + Recharts

**理由**: 需求文档推荐，项目已配置

---

### AD-007: Simulator 独立工具

**决策**: CLI 工具，不集成到主应用

**理由**: 开发调试工具，独立运行更灵活

---

### AD-008: 时间范围预定义

**决策**: 枚举类型 `1h | 6h | 24h | 7d`

**理由**: 符合需求，简化 UI

**未来**: v0.2 支持自定义范围

