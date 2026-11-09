# Nodes List Page - 需求

## 需求来源

docs/requirement.md #6 Node 列表, #7 添加 Node

## 目标

实现 Nodes 列表页面，支持查看、搜索、筛选和管理设备。

## 页面路径

`/dashboard/nodes`

## 页面功能

### 1. 设备列表表格

显示所有设备的详细信息：

| Name | Node ID | Type | Location | Status | Last Seen | Created At | Actions |
|------|---------|------|----------|--------|-----------|------------|---------|
| 温度节点 001 | ION-001 | Temperature | 南京工厂 | ● Online | 10s ago | 2024-11-09 | 🗑️ |

### 2. 顶部操作栏

- **搜索框**: 搜索设备名称、Node ID、位置
- **状态筛选**: All / Online / Offline / Warning
- **类型筛选**: 下拉选择设备类型
- **+ Add Node 按钮**: 打开添加设备对话框

### 3. Add/Edit Node 表单

表单字段：
- Node ID (required, unique)
- Node Name (required)
- Type (required)
- Location (optional)
- Description (optional)

### 4. Delete Node

点击删除图标，弹出确认对话框，确认后删除设备及其所有数据。

## 数据来源

```typescript
// 获取设备列表（支持筛选）
trpc.nodes.list.useQuery({
  search: searchTerm,
  status: statusFilter,
  type: typeFilter,
})

// 创建设备
trpc.nodes.create.useMutation()

// 更新设备
trpc.nodes.update.useMutation()

// 删除设备
trpc.nodes.delete.useMutation()
```

## 验收标准

- [ ] 表格正确显示所有设备
- [ ] 搜索功能正常
- [ ] 状态筛选正常
- [ ] 类型筛选正常
- [ ] Add Node 表单提交成功
- [ ] Edit Node 表单提交成功
- [ ] Delete Node 确认后删除成功
- [ ] 点击设备名可跳转到详情页
