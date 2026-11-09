# Database Layer - 设计

## Prisma Schema

位置：`packages/db/prisma/schema/ionnode.prisma`

```prisma
model Node {
  id          String   @id @default(cuid())
  nodeId      String   @unique @map("node_id")
  name        String
  type        String
  location    String?
  status      String   @default("offline")
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  lastSeenAt  DateTime @default(now()) @map("last_seen_at")

  data NodeData[]

  @@map("nodes")
}

model NodeData {
  id          String   @id @default(cuid())
  nodeId      String   @map("node_id")
  temperature Float?
  humidity    Float?
  voltage     Float?
  battery     Float?
  createdAt   DateTime @default(now()) @map("created_at")

  node Node @relation(fields: [nodeId], references: [id], onDelete: Cascade)

  @@index([nodeId, createdAt])
  @@map("node_data")
}
```

## 设计决策

### 状态字段

`status` 存储为 String，值为 `"online" | "offline" | "warning"`。

**理由**：
- 虽然可以动态计算，但存储状态可以简化查询筛选
- 每次数据上报时更新状态

### 数据字段可选

temperature、humidity、voltage、battery 都是可选字段。

**理由**：
- 不同设备可能只上报部分数据
- 灵活性更高

### 时间索引

`[nodeId, createdAt]` 复合索引用于优化历史数据查询。

**查询场景**：
```sql
SELECT * FROM node_data 
WHERE node_id = ? AND created_at >= ? 
ORDER BY created_at DESC
```

## 迁移策略

开发阶段使用 `prisma db push`，生产使用 `prisma migrate`。
