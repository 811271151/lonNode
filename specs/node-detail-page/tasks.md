# Node Detail Page - 任务清单

- [ ] T-01: [前端] 创建页面路由 (~20min)
  - 依赖: 无
  - 文件: apps/web/src/app/dashboard/nodes/[id]/page.tsx
  - AC: 无

- [ ] T-02: [前端] 实现 Node Header (~1.5h)
  - 依赖: 无
  - 文件: apps/web/src/components/node-detail/node-header.tsx
  - AC: 设备基础信息正确显示, Status badge 颜色正确, Last Seen 显示相对时间

- [ ] T-03: [前端] 实现实时数据卡片 (~1h)
  - 依赖: 无
  - 文件: apps/web/src/components/node-detail/data-card.tsx
  - AC: 实时数据正确显示

- [ ] T-04: [前端] 实现时间范围选择器 (~30min)
  - 依赖: 无
  - 文件: apps/web/src/components/node-detail/time-range-selector.tsx
  - AC: 时间范围切换生效

- [ ] T-05: [前端] 实现历史数据图表 (~2.5h)
  - 依赖: T-04
  - 文件: apps/web/src/components/node-detail/history-chart.tsx
  - AC: 历史数据图表正常渲染, 无数据时显示空状态

- [ ] T-06: [前端] 集成数据查询 (~1h)
  - 依赖: T-02, T-03, T-05
  - 文件: apps/web/src/app/dashboard/nodes/[id]/page.tsx
  - AC: 无

- [ ] T-07: [前端] 详细信息区域 (~30min)
  - 依赖: 无
  - 文件: apps/web/src/components/node-detail/node-detail-info.tsx
  - AC: 无

- [ ] T-08: [前端] 错误处理 (~30min)
  - 依赖: T-06
  - 文件: apps/web/src/app/dashboard/nodes/[id]/page.tsx
  - AC: 无
