# Node Detail Page - 设计

## 页面组件结构

```
app/dashboard/nodes/[id]/page.tsx
├── <NodeHeader>
│   ├── Name
│   ├── <StatusBadge>
│   └── Basic Info
├── <RealTimeDataCards>
│   ├── <DataCard title="Temperature" />
│   ├── <DataCard title="Humidity" />
│   ├── <DataCard title="Voltage" />
│   └── <DataCard title="Battery" />
├── <HistoryChart>
│   ├── <TimeRangeSelector>
│   └── <LineChart>
└── <NodeDetailInfo>
```

## 实时数据卡片

```tsx
<DataCard 
  title="Temperature"
  value={latestData?.temperature}
  unit="°C"
  icon={<ThermometerIcon />}
/>
```

## 历史数据图表

使用 Recharts：

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

<LineChart data={historyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="createdAt" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature" />
  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity" />
  <Line type="monotone" dataKey="voltage" stroke="#10b981" name="Voltage" />
</LineChart>
```

## 时间范围选择器

使用 `<Tabs>`:

```tsx
<Tabs value={timeRange} onValueChange={setTimeRange}>
  <TabsList>
    <TabsTrigger value="1h">1 Hour</TabsTrigger>
    <TabsTrigger value="6h">6 Hours</TabsTrigger>
    <TabsTrigger value="24h">24 Hours</TabsTrigger>
    <TabsTrigger value="7d">7 Days</TabsTrigger>
  </TabsList>
</Tabs>
```

## 数据格式转换

图表需要格式化时间戳：

```typescript
const chartData = historyData?.map(d => ({
  ...d,
  createdAt: format(new Date(d.createdAt), 'HH:mm'),
}))
```

## UI 组件

- `<Card>` from shadcn/ui
- `<Tabs>` from shadcn/ui
- `<Badge>` from shadcn/ui
- Recharts components

## 布局

```tsx
<div className="container mx-auto px-4 py-8">
  <NodeHeader />
  
  <div className="mt-8 grid gap-4 md:grid-cols-4">
    <RealTimeDataCards />
  </div>
  
  <div className="mt-8">
    <h2>Data Trends</h2>
    <TimeRangeSelector />
    <HistoryChart />
  </div>
  
  <div className="mt-8">
    <NodeDetailInfo />
  </div>
</div>
```
