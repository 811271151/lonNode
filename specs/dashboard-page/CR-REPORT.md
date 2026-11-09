# dashboard-page Code Review 报告

## 设计审查（2025-01-09 16:30）

- [缺失] AC-05 "点击设备行可跳转到详情页" 在 design.md 中没有实现细节 — 需补充：使用 Next.js 的哪种导航方式（Link 或 useRouter）、目标路径格式 — 已补全：使用 useRouter，路径为 `/dashboard/nodes/[id]`（A-08）

- [缺失] requirement.md 提到"如果没有设备或数据，显示空状态提示"，但 design.md 完全没有空状态的实现细节 — 需补充：空状态组件的结构、文案、样式 — 已补全：空状态显示在表格位置，包含文案和样式说明（A-05）

- [缺失] design.md 使用 `date-fns` 的 `formatDistanceToNow`，但未说明依赖是否已安装、`lastSeenAt` 为 null 时的处理方式 — 需补充：依赖确认、边界情况处理 — 已补全：改为自行实现相对时间转换，不引入 date-fns；null 时显示 "Never"（A-06）

- [缺失] design.md 列出使用 shadcn/ui 的 Card/Table/Badge 组件，但未说明这些组件的导入路径和是否已安装 — 需补充：导入路径、确认组件可用性 — 已补全：Card 使用现有组件并说明导入路径；Table 用原生 table；Badge 自行实现（A-07）

- [缺失] nodes API 返回的字段与表格列的映射关系不明确 — design.md 没有说明前端使用哪些字段、如何映射到 Node/Type/Status/Last Seen 列 — 已补全：添加"数据字段映射"表格说明 API 字段到表格列的对应关系

- [缺失] design.md 提到数据轮询使用 `refetchInterval: 10000`，但没有说明这是否为必需功能、用户离开页面时是否需要停止轮询 — 需补充：轮询策略说明 — 已补全：说明依赖 React Query 的失焦暂停行为，无需手动处理（A-09）

结论: 6 条，补全 6 / 误报 0 / 挂起 0
