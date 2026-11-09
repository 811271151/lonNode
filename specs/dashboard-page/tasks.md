# Dashboard Page - 任务清单

## Task 3.1: 统计卡片组件

- [ ] 创建 `<StatCard>` 组件
- [ ] 实现统计数据计算逻辑
- [ ] 布局 4 个卡片

**位置**: `apps/web/src/components/dashboard/stat-card.tsx`

---

## Task 3.2: 设备状态表格

- [ ] 创建 `<NodeStatusTable>` 组件
- [ ] 实现 `<StatusBadge>` 组件
- [ ] 显示 Node name, Type, Status, Last Seen
- [ ] 实现相对时间显示
- [ ] 点击行跳转到详情页

**位置**: `apps/web/src/components/dashboard/node-status-table.tsx`

---

## Task 3.3: Dashboard 页面集成

- [ ] 修改 `apps/web/src/app/page.tsx`
- [ ] 调用 tRPC API 获取数据
- [ ] 集成统计卡片和表格
- [ ] 配置数据轮询

**位置**: `apps/web/src/app/page.tsx`

---

## Task 3.4: 空状态处理

- [ ] 无设备时显示提示
- [ ] Loading 状态
- [ ] Error 状态

---

## Task 3.5: 样式调整

- [ ] 响应式布局
- [ ] 深色主题适配
- [ ] 间距和颜色调整
