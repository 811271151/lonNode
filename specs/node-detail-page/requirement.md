# Node Detail Page - 需求

## 需求来源

docs/requirement.md #8 Node Detail

## 目标

实现单个 Node 的详情页面，展示设备信息、实时数据和历史趋势。

## 页面路径

`/dashboard/nodes/[id]`

## 页面结构

### 1. 顶部信息卡

显示设备基础信息：

```
Temperature Node 001
● Online

Node ID: ION-001
Type: Temperature Sensor
Location: Factory A
Last Seen: 10 seconds ago
```

### 2. 实时数据卡片

4 个指标卡片横向排列：

- **Temperature**: 26.5 °C
- **Humidity**: 63 %
- **Voltage**: 3.7 V
- **Battery**: 85 %

### 3. 历史数据图表

- **时间范围切换**: 1 Hour / 6 Hours / 24 Hours / 7 Days
- **多折线图**: 显示 temperature, humidity, voltage 的历史趋势
- 使用 Recharts `<LineChart>`

### 4. 详细信息区

显示更多字段（占位）：
- IP Address (MVP 暂不实现)
- Firmware Version (MVP 暂不实现)
- Created At
- Updated At

## 数据来源

```typescript
// 获取设备详情
trpc.nodes.get.useQuery({ id: nodeId })

// 获取最新数据
trpc.nodeData.latest.useQuery({ nodeId })

// 获取历史数据
trpc.nodeData.list.useQuery({
  nodeId,
  timeRange: selectedRange,
})
```

## 验收标准

- [ ] 设备基础信息正确显示
- [ ] Status badge 颜色正确
- [ ] 实时数据正确显示（最新一条）
- [ ] 历史数据图表正常渲染
- [ ] 时间范围切换生效
- [ ] Last Seen 显示相对时间
- [ ] 无数据时显示空状态
