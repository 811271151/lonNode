# IonNode MVP - Specs Index

> 需求来源: docs/requirement.md  
> 目标版本: v0.1.0  
> 工作分支: feature/ionnode-mvp

## 功能模块 (Features)

### 1. database-layer ✅
数据库 schema 设计：Node 和 NodeData 表
- [requirement.md](database-layer/requirement.md)
- [design.md](database-layer/design.md)
- [tasks.md](database-layer/tasks.md)

### 2. api-layer ✅
tRPC API 实现：Node CRUD + Data 上报/查询
- [requirement.md](api-layer/requirement.md)
- [design.md](api-layer/design.md)
- [tasks.md](api-layer/tasks.md)

### 3. dashboard-page
Dashboard 首页：统计卡片 + 设备列表 + 数据趋势
- [requirement.md](dashboard-page/requirement.md)
- [design.md](dashboard-page/design.md)
- [tasks.md](dashboard-page/tasks.md)

### 4. nodes-page
Nodes 列表页：表格 + 搜索筛选 + Add/Edit/Delete
- [requirement.md](nodes-page/requirement.md)
- [design.md](nodes-page/design.md)
- [tasks.md](nodes-page/tasks.md)

### 5. node-detail-page
Node 详情页：基础信息 + 实时数据 + 历史图表
- [requirement.md](node-detail-page/requirement.md)
- [design.md](node-detail-page/design.md)
- [tasks.md](node-detail-page/tasks.md)

### 6. simulator
Node Simulator CLI 工具
- [requirement.md](simulator/requirement.md)
- [design.md](simulator/design.md)
- [tasks.md](simulator/tasks.md)

## 设计决策

参见 [DECISIONS.md](DECISIONS.md)

## 批次规划

### Batch 1: 数据层 (database-layer) ✅
- [x] Prisma schema 定义
- [x] Prisma client 生成
- [x] 数据库推送

**状态**: 已完成

---

### Batch 2: API 层 (api-layer) ✅
- [x] nodesRouter 实现
- [x] nodeDataRouter 实现
- [ ] 类型检查
- [ ] 集成测试

**状态**: 基本完成，待测试

---

### Batch 3: Dashboard (dashboard-page) 🚧
- [ ] 统计卡片组件
- [ ] 设备状态表格
- [ ] tRPC 客户端集成
- [ ] 数据轮询

**状态**: 进行中（已创建部分组件，待集成）

---

### Batch 4: Nodes List (nodes-page) ⏸️
- [ ] 列表页面
- [ ] 搜索筛选
- [ ] Add/Edit/Delete 表单

**状态**: 待开始

---

### Batch 5: Node Detail (node-detail-page) ⏸️
- [ ] 详情页布局
- [ ] 实时数据展示
- [ ] 历史图表

**状态**: 待开始

---

### Batch 6: Simulator (simulator) ⏸️
- [ ] CLI 工具
- [ ] 数据生成
- [ ] HTTP 上报

**状态**: 待开始

## 当前进度

- ✅ Batch 1 (数据层): 完成
- ✅ Batch 2 (API 层): 完成
- 🚧 Batch 3 (Dashboard): 进行中
- ⏸️ Batch 4-6: 待开始

## 下一步

1. 完成 Dashboard 页面集成和测试
2. 开始 Batch 4: Nodes 列表页面
3. 实现 Batch 5: Node 详情页
4. 实现 Batch 6: Simulator 工具
5. 端到端测试
6. 交付报告
