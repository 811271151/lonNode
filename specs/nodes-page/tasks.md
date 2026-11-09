# Nodes List Page - 任务清单

## Task 4.1: 创建页面路由

- [ ] 创建 `apps/web/src/app/dashboard/nodes/page.tsx`
- [ ] 配置页面布局和 metadata

**状态**: ⏸️ 待开始

---

## Task 4.2: 实现搜索与筛选

- [ ] 创建 `<SearchInput>` 组件
- [ ] 创建 `<StatusFilter>` 组件
- [ ] 创建 `<TypeFilter>` 组件
- [ ] 集成筛选逻辑到 tRPC 查询

**位置**: `apps/web/src/components/nodes/filters.tsx`

---

## Task 4.3: 实现 Nodes Table

- [ ] 创建 `<NodesTable>` 组件
- [ ] 显示所有字段（Name, ID, Type, Location, Status, Last Seen, Created At）
- [ ] 点击行跳转到详情页
- [ ] 集成 `<StatusBadge>` 组件

**位置**: `apps/web/src/components/nodes/nodes-table.tsx`

---

## Task 4.4: 实现 Add Node 功能

- [ ] 创建 `<NodeFormDialog>` 组件
- [ ] 使用 react-hook-form + zod 验证
- [ ] 集成 `trpc.nodes.create` mutation
- [ ] 成功后刷新列表并关闭对话框

**位置**: `apps/web/src/components/nodes/node-form-dialog.tsx`

---

## Task 4.5: 实现 Edit Node 功能

- [ ] 复用 `<NodeFormDialog>` 组件
- [ ] 传入初始值用于编辑
- [ ] 集成 `trpc.nodes.update` mutation

---

## Task 4.6: 实现 Delete Node 功能

- [ ] 创建 `<DeleteNodeDialog>` 组件
- [ ] 使用 `<AlertDialog>` 确认删除
- [ ] 集成 `trpc.nodes.delete` mutation
- [ ] 成功后刷新列表

**位置**: `apps/web/src/components/nodes/delete-node-dialog.tsx`

---

## Task 4.7: 错误处理与 Toast 通知

- [ ] 添加 toast 通知（成功/失败）
- [ ] 处理 API 错误
- [ ] 显示 Loading 状态
