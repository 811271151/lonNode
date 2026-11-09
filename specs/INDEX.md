# IonNode MVP - Specs Index

> 需求来源: docs/requirement.md  
> 目标版本: v0.1.0  
> 工作分支: feature/ionnode-mvp

## 功能模块 (Features)

### 1. database-layer
数据库 schema 设计：Node 和 NodeData 表

### 2. api-layer
tRPC API 实现：Node CRUD + Data 上报/查询

### 3. dashboard-page
Dashboard 首页：统计卡片 + 设备列表 + 数据趋势

### 4. nodes-page
Nodes 列表页：表格 + 搜索筛选 + Add/Edit/Delete

### 5. node-detail-page
Node 详情页：基础信息 + 实时数据 + 历史图表

### 6. simulator
Node Simulator CLI 工具

## 批次规划

### Batch 1: 数据层 (database-layer)
- [x] Prisma schema 定义
- [x] Prisma client 生成
- [ ] 数据库迁移/推送

### Batch 2: API 层 (api-layer)
- [x] nodesRouter 实现
- [x] nodeDataRouter 实现
- [ ] 类型检查
- [ ] 集成测试

### Batch 3: Dashboard (dashboard-page)
- [ ] 统计卡片组件
- [ ] 设备状态表格
- [ ] 数据趋势图表

### Batch 4: Nodes List (nodes-page)
- [ ] 列表页面
- [ ] 搜索筛选
- [ ] Add/Edit/Delete 表单

### Batch 5: Node Detail (node-detail-page)
- [ ] 详情页布局
- [ ] 实时数据展示
- [ ] 历史图表

### Batch 6: Simulator (simulator)
- [ ] CLI 工具
- [ ] 数据生成
- [ ] HTTP 上报

## 当前状态

- 已完成需求拆分
- 已创建 Prisma schema (Node, NodeData)
- 已实现 tRPC API routers
- 待完成：数据库配置 + 前端页面开发
