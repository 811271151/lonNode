# Dashboard Page - 设计

## 页面组件结构

```
app/page.tsx
├── <StatCards>
│   ├── <StatCard title="Total Nodes" />
│   ├── <StatCard title="Online" />
│   ├── <StatCard title="Offline" />
│   └── <StatCard title="Warning" />
└── <NodeStatusTable>
    └── <StatusBadge />
```

## 统计数据计算

```typescript
const { data: nodes } = trpc.nodes.list.useQuery({})

const stats = useMemo(() => {
  if (!nodes) return { total: 0, online: 0, offline: 0, warning: 0 }
  
  return {
    total: nodes.length,
    online: nodes.filter(n => n.status === 'online').length,
    offline: nodes.filter(n => n.status === 'offline').length,
    warning: nodes.filter(n => n.status === 'warning').length,
  }
}, [nodes])
```

## Status Badge 颜色映射

```typescript
const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  warning: 'bg-yellow-500',
}
```

## 相对时间显示

使用 `date-fns` 的 `formatDistanceToNow`:

```typescript
import { formatDistanceToNow } from 'date-fns'

const relativeTime = formatDistanceToNow(new Date(node.lastSeenAt), { 
  addSuffix: true 
})
// "10 seconds ago"
```

## 数据轮询

使用 React Query 的 `refetchInterval`:

```typescript
trpc.nodes.list.useQuery({}, {
  refetchInterval: 10000, // 10 秒刷新
})
```

## UI 组件

- `<Card>` from shadcn/ui
- `<Table>` from shadcn/ui
- `<Badge>` from shadcn/ui

## 布局

使用 Grid 布局：

```tsx
<div className="grid grid-cols-4 gap-4">
  {/* 统计卡片 */}
</div>
<div className="mt-8">
  {/* 设备表格 */}
</div>
```
