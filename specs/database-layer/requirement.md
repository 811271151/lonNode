# Database Layer - 需求

## 需求来源

docs/requirement.md #14 数据库

## 目标

定义 IonNode 的数据库 schema，包含设备和数据记录表。

## 核心表

### nodes 表

存储设备基础信息：

- id: 主键
- nodeId: 唯一设备标识 (如 ION-001)
- name: 设备名称
- type: 设备类型
- location: 位置
- status: 状态 (online/offline/warning)
- description: 描述
- createdAt: 创建时间
- updatedAt: 更新时间
- lastSeenAt: 最后上线时间

### node_data 表

存储设备上报的数据：

- id: 主键
- nodeId: 外键指向 nodes
- temperature: 温度 (°C)
- humidity: 湿度 (%)
- voltage: 电压 (V)
- battery: 电量 (%)
- createdAt: 数据时间

## 关系

- Node 1:N NodeData
- 删除 Node 时级联删除其所有数据

## 索引

- `nodes.nodeId`: unique index
- `node_data.[nodeId, createdAt]`: composite index (时间范围查询优化)

## 验收标准

- [ ] Prisma schema 定义完成
- [ ] Prisma client 生成成功
- [ ] 数据库 push/migrate 成功
