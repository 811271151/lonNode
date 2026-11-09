# Node Detail Page - 任务清单

## Task 5.1: 创建页面路由

- [ ] 创建 `apps/web/src/app/dashboard/nodes/[id]/page.tsx`
- [ ] 配置动态路由参数

**状态**: ⏸️ 待开始

---

## Task 5.2: 实现 Node Header

- [ ] 创建 `<NodeHeader>` 组件
- [ ] 显示设备名称、ID、类型、位置
- [ ] 集成 `<StatusBadge>`
- [ ] 显示 Last Seen（相对时间）

**位置**: `apps/web/src/components/node-detail/node-header.tsx`

---

## Task 5.3: 实现实时数据卡片

- [ ] 创建 `<DataCard>` 组件
- [ ] 显示指标名称、数值、单位
- [ ] 支持可选图标
- [ ] 布局 4 个卡片

**位置**: `apps/web/src/components/node-detail/data-card.tsx`

---

## Task 5.4: 实现时间范围选择器

- [ ] 创建 `<TimeRangeSelector>` 组件
- [ ] 使用 `<Tabs>` 实现
- [ ] 支持 1h/6h/24h/7d 切换

**位置**: `apps/web/src/components/node-detail/time-range-selector.tsx`

---

## Task 5.5: 实现历史数据图表

- [ ] 安装 Recharts (`pnpm add recharts`)
- [ ] 创建 `<HistoryChart>` 组件
- [ ] 实现多折线图（temperature, humidity, voltage）
- [ ] 格式化时间轴
- [ ] 空数据状态处理

**位置**: `apps/web/src/components/node-detail/history-chart.tsx`

---

## Task 5.6: 集成数据查询

- [ ] 使用 `trpc.nodes.get` 获取设备详情
- [ ] 使用 `trpc.nodeData.latest` 获取实时数据
- [ ] 使用 `trpc.nodeData.list` 获取历史数据
- [ ] 配置数据轮询

---

## Task 5.7: 详细信息区域

- [ ] 创建 `<NodeDetailInfo>` 组件
- [ ] 显示 Created At, Updated At
- [ ] IP 和 Firmware 显示占位符

**位置**: `apps/web/src/components/node-detail/node-detail-info.tsx`

---

## Task 5.8: 错误处理

- [ ] Node 不存在时显示 404
- [ ] Loading 状态
- [ ] 数据加载失败处理
