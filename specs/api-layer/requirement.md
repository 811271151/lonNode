# API Layer - 需求

## 需求来源

docs/requirement.md #13 API

## 目标

实现 Node 管理和数据上报的 tRPC API。

## API 列表

### Node CRUD

1. **获取设备列表** - `nodes.list`
   - 支持搜索（名称/ID/位置）
   - 支持状态筛选
   - 支持类型筛选

2. **获取设备详情** - `nodes.get`
   - 返回单个设备信息

3. **创建设备** - `nodes.create`
   - 检查 nodeId 唯一性

4. **修改设备** - `nodes.update`
   - 更新设备基础信息

5. **删除设备** - `nodes.delete`
   - 级联删除数据

### Node Data

1. **上报数据** - `nodeData.report`
   - 创建数据记录
   - 更新 lastSeenAt
   - 更新状态

2. **获取历史数据** - `nodeData.list`
   - 支持时间范围筛选 (1h/6h/24h/7d)
   - 限制返回数量

3. **获取最新数据** - `nodeData.latest`
   - 返回最新一条数据

## 状态计算逻辑

- **Online**: lastSeenAt < 60 秒前
- **Offline**: lastSeenAt >= 60 秒前
- **Warning**: Online 且 temperature > 80°C

## 验收标准

- [ ] 所有 API 实现完成
- [ ] 类型检查通过
- [ ] 错误处理正确
- [ ] 可通过 tRPC 客户端调用
