# Dashboard Page - 任务清单

- [ ] T-01: [前端] 统计卡片组件 (~1.5h)
  - 依赖: 无
  - 文件: apps/web/src/components/dashboard/stat-card.tsx
  - AC: 4 个统计卡片正确显示

- [ ] T-02: [前端] 设备状态表格 (~2h)
  - 依赖: 无
  - 文件: apps/web/src/components/dashboard/node-status-table.tsx, apps/web/src/components/dashboard/status-badge.tsx
  - AC: 设备状态表格正常渲染, Status badge 颜色正确, Last Seen 显示相对时间

- [ ] T-03: [前端] Dashboard 页面集成 (~1.5h)
  - 依赖: T-01, T-02
  - 文件: apps/web/src/app/page.tsx
  - AC: 点击设备行可跳转到详情页

- [ ] T-04: [前端] 空状态处理 (~30min)
  - 依赖: T-03
  - 文件: apps/web/src/app/page.tsx, apps/web/src/components/dashboard/empty-state.tsx
  - AC: 无

- [ ] T-05: [前端] 样式调整 (~1h)
  - 依赖: T-03
  - 文件: apps/web/src/app/page.tsx, apps/web/src/components/dashboard/*.tsx
  - AC: 无
