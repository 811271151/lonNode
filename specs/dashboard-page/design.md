# Dashboard Page - 设计

## 页面组件结构

```
app/page.tsx
├── <StatCards>
│   ├── <StatCard title="Total Nodes" />
│   ├── <StatCard title="Online" />
│   ├── <StatCard title="Offline" />
│   └── <StatCard title="Warning" />
├── <NodeStatusTable>
│   └── <StatusBadge />
└── <EmptyState> (无设备时显示)
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

不使用外部库，自行实现相对时间转换：

```typescript
function getRelativeTime(date: Date): string {
  const now = Date.now()
  const diffMs = now - date.getTime()
  
  if (diffMs < 60000) {
    return `${Math.floor(diffMs / 1000)}s ago`
  }
  if (diffMs < 3600000) {
    return `${Math.floor(diffMs / 60000)}m ago`
  }
  if (diffMs < 86400000) {
    return `${Math.floor(diffMs / 3600000)}h ago`
  }
  return `${Math.floor(diffMs / 86400000)}d ago`
}

// 处理 null 的情况
const relativeTime = node.lastSeenAt ? getRelativeTime(new Date(node.lastSeenAt)) : 'Never'
```

## 数据轮询

使用 React Query 的 `refetchInterval` 实现 10 秒自动刷新：

```typescript
trpc.nodes.list.useQuery({}, {
  refetchInterval: 10000, // 10 秒刷新
})
```

注：React Query 默认在页面失焦或切换到后台时会暂停轮询，无需手动处理。

## UI 组件

- `<Card>` from @IonNode/ui/components/card（已存在）
- `<Table>` 使用原生 `<table>` + Tailwind 样式（shadcn/ui 的 Table 组件未安装）
- `<Badge>` 自行实现（使用 Tailwind 的 `rounded-full` + 背景色）

导入路径：
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@IonNode/ui/components/card"
```

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

## 导航实现

点击表格行跳转到详情页，使用 Next.js `useRouter`：

```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()

const handleRowClick = (nodeId: string) => {
  router.push(`/dashboard/nodes/${nodeId}`)
}
```

目标路径格式：`/dashboard/nodes/[id]`（其中 id 是节点的数据库 id 字段）

## 数据字段映射

API 返回字段 → 表格列映射：

| API 字段 | 表格列 | 说明 |
|---------|--------|------|
| `name` | Node | 设备名称 |
| `type` | Type | 设备类型 |
| `status` | Status | 状态（online/offline/warning），由 API 动态计算 |
| `lastSeenAt` | Last Seen | 最后上报时间，前端转为相对时间 |
| `id` | - | 用于跳转的路由参数，不在表格显示 |

其他字段（`nodeId`, `location`, `description`, `createdAt`, `updatedAt`）在表格中不显示，留给详情页使用。

## 空状态实现

当 `nodes.length === 0` 时显示空状态组件：

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <p className="text-muted-foreground">No nodes found</p>
  <p className="text-sm text-muted-foreground mt-2">
    Add your first node to get started
  </p>
</div>
```

空状态显示在表格位置，统计卡片仍显示（全为 0）。
