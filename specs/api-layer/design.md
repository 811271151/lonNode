# API Layer - 设计

## Router 结构

```typescript
appRouter
├── nodes
│   ├── list
│   ├── get
│   ├── create
│   ├── update
│   └── delete
└── nodeData
    ├── report
    ├── list
    └── latest
```

## 状态计算

在 `nodesRouter` 中实现状态计算函数：

```typescript
function calculateNodeStatus(
  lastSeenAt: Date,
  latestTemperature?: number | null,
): NodeStatus {
  const now = Date.now();
  const lastSeen = lastSeenAt.getTime();
  const diffMs = now - lastSeen;

  if (diffMs > 60000) return "offline";
  if (latestTemperature && latestTemperature > 80) return "warning";
  return "online";
}
```

## 数据上报流程

1. 接收数据
2. 查找 Node（支持 id 或 nodeId）
3. 创建 NodeData 记录
4. 更新 Node.lastSeenAt
5. 计算并更新 Node.status

## 时间范围映射

```typescript
const TIME_RANGE_MAP = {
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
}
```

## 错误处理

使用 tRPC 标准错误：

- `NOT_FOUND`: Node 不存在
- `CONFLICT`: nodeId 已存在
- `BAD_REQUEST`: 输入验证失败

## 权限

MVP 阶段所有 API 使用 `publicProcedure`，不做权限控制。
