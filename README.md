# IonNode

一个功能完整的 IoT 设备管理和数据监控平台

## ✨ 特性

- 🎛️ **设备管理**: 完整的 CRUD 操作，支持搜索和筛选
- 📊 **实时监控**: Dashboard 展示设备状态和统计数据
- 📈 **数据可视化**: 历史数据图表，支持多种时间范围
- 🔄 **自动刷新**: 实时数据自动更新
- 🎮 **设备模拟器**: CLI 工具用于测试和开发

## 🏗️ 技术栈

### 前端
- **Next.js 16** - React 框架 (App Router)
- **TypeScript** - 类型安全
- **TailwindCSS** - 样式
- **Recharts** - 数据可视化
- **Radix UI** - UI 组件
- **React Query** - 数据获取

### 后端
- **Hono** - 轻量级 HTTP 服务器
- **tRPC** - 类型安全的 API
- **Prisma** - ORM
- **PostgreSQL** - 数据库

### 工具
- **pnpm** - 包管理
- **Turbo** - Monorepo 构建
- **Biome** - 代码检查和格式化

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14

### 安装

```bash
# 克隆仓库
git clone https://github.com/811271151/lonNode.git
cd lonNode

# 安装依赖
pnpm install

# 配置环境变量
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env

# 编辑 apps/server/.env 配置数据库连接
# DATABASE_URL=postgresql://user:password@localhost:5432/ionnode

# 同步数据库
pnpm run db:push
```

### 运行

```bash
# 启动 API 服务器
pnpm run dev:server

# 启动 Web 应用（新终端）
pnpm run dev:web

# 启动设备模拟器（可选，新终端）
pnpm simulator --node-id ION-001 --interval 5000
```

访问 http://localhost:3001 查看应用

## 📁 项目结构

```
IonNode/
├── apps/
│   ├── web/                 # Next.js Web 应用
│   ├── server/              # API 服务器
│   └── fumadocs/            # 文档站
├── packages/
│   ├── api/                 # tRPC API 定义
│   ├── db/                  # Prisma 数据库
│   ├── auth/                # Better Auth
│   └── ui/                  # 共享 UI 组件
└── tools/
    └── simulator/           # 设备模拟器 CLI
```

## 🎮 功能模块

### Dashboard
- 设备统计（总数、在线、离线、告警）
- 设备状态表格
- 快速跳转到设备详情

### 设备列表
- 搜索设备（名称/ID/位置）
- 按状态和类型筛选
- 添加/编辑/删除设备

### 设备详情
- 实时数据展示（温度、湿度、电压、电池）
- 历史数据图表
- 时间范围切换（1h/6h/24h/7d）

### 设备模拟器
- 生成随机传感器数据
- 定时上报数据
- 支持多设备并发

## 📝 API 文档

### 设备管理
- `GET /trpc/nodes.list` - 获取设备列表
- `GET /trpc/nodes.get` - 获取单个设备
- `POST /trpc/nodes.create` - 创建设备
- `POST /trpc/nodes.update` - 更新设备
- `POST /trpc/nodes.delete` - 删除设备

### 数据管理
- `POST /trpc/nodeData.report` - 上报数据
- `GET /trpc/nodeData.latest` - 获取最新数据
- `GET /trpc/nodeData.list` - 获取历史数据

## 🛠️ 开发

```bash
# 类型检查
pnpm run check-types

# 代码检查
pnpm run check

# 构建
pnpm run build

# 数据库迁移
pnpm run db:migrate
```

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
