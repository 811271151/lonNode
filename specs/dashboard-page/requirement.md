# Dashboard Page - 需求

## 需求来源

docs/requirement.md #5 Dashboard

## 目标

实现 IonNode 首页，展示系统概览和设备状态。

## 页面路径

`/` (apps/web 根路由)

## 页面结构

### 1. 统计卡片区

4 个卡片横向排列：

- **Total Nodes**: 总设备数
- **Online**: 在线设备数
- **Offline**: 离线设备数  
- **Warning**: 告警设备数

### 2. 设备状态表格

显示所有设备的实时状态：

| Node | Type | Status | Last Seen |
|------|------|--------|-----------|
| 温度节点 001 | Temperature | ● Online | 10s ago |

列字段：
- Node name
- Type
- Status (带颜色标签)
- Last Seen (相对时间，如 "10s ago", "5m ago")

点击行跳转到详情页。

### 3. 数据趋势图表（可选）

显示最近 24h 的数据趋势：
- Temperature 折线图
- Humidity 折线图
- Voltage 折线图

如果没有设备或数据，显示空状态提示。

## 数据来源

```typescript
// 获取所有设备
trpc.nodes.list.useQuery({})

// 获取某设备的历史数据（可选）
trpc.nodeData.list.useQuery({
  nodeId: selectedNodeId,
  timeRange: '24h',
})
```

## 验收标准

- [ ] 4 个统计卡片正确显示
- [ ] 设备状态表格正常渲染
- [ ] Status badge 颜色正确（online=绿/offline=灰/warning=黄）
- [ ] Last Seen 显示相对时间
- [ ] 点击设备行可跳转到详情页
