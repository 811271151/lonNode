# Nodes List Page - 设计

## 页面组件结构

```
app/dashboard/nodes/page.tsx
├── <PageHeader>
│   ├── <SearchInput>
│   ├── <StatusFilter>
│   ├── <TypeFilter>
│   └── <AddNodeButton>
└── <NodesTable>
    └── <NodeRow>
        ├── <StatusBadge>
        └── <DeleteButton>
```

## 搜索与筛选状态

```typescript
const [search, setSearch] = useState('')
const [statusFilter, setStatusFilter] = useState<NodeStatus | undefined>()
const [typeFilter, setTypeFilter] = useState<string | undefined>()

const { data: nodes } = trpc.nodes.list.useQuery({
  search,
  status: statusFilter,
  type: typeFilter,
})
```

## Add/Edit Node Dialog

使用 shadcn/ui 的 `<Dialog>` 组件：

```tsx
<Dialog>
  <DialogTrigger>
    <Button>+ Add Node</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Node</DialogTitle>
    </DialogHeader>
    <NodeForm onSubmit={handleCreate} />
  </DialogContent>
</Dialog>
```

## Node Form 表单验证

使用 zod + react-hook-form：

```typescript
const nodeFormSchema = z.object({
  nodeId: z.string().min(1, "Node ID is required"),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  location: z.string().optional(),
  description: z.string().optional(),
})

type NodeFormValues = z.infer<typeof nodeFormSchema>
```

## Delete 确认对话框

使用 `<AlertDialog>`:

```tsx
<AlertDialog>
  <AlertDialogTrigger>
    <Button variant="ghost" size="sm">
      <TrashIcon />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Node</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete this node and all its data.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## UI 组件

- `<Table>` from shadcn/ui
- `<Dialog>` from shadcn/ui
- `<AlertDialog>` from shadcn/ui
- `<Input>` from shadcn/ui
- `<Select>` from shadcn/ui
- `<Button>` from shadcn/ui
- `<Form>` from shadcn/ui (react-hook-form)

## 布局

```tsx
<div className="container mx-auto px-4 py-8">
  <div className="mb-6 flex items-center justify-between">
    <h1>Nodes</h1>
    <Button>+ Add Node</Button>
  </div>
  
  <div className="mb-4 flex gap-4">
    <SearchInput />
    <StatusFilter />
    <TypeFilter />
  </div>
  
  <NodesTable />
</div>
```
