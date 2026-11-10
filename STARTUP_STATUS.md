# 🚀 IonNode 项目启动状态

## ✅ 服务状态

### 1. API 服务器 (Hono + tRPC)
- **状态**: ✅ 运行中
- **地址**: http://localhost:3000
- **进程 PID**: 570
- **日志文件**: server.log

### 2. Web 应用 (Next.js)
- **状态**: ✅ 运行中
- **本地地址**: http://localhost:3001
- **网络地址**: http://192.168.13.102:3001
- **进程 PID**: 583
- **日志文件**: web.log

### 3. 数据库 (PostgreSQL)
- **状态**: ✅ 已连接
- **地址**: localhost:5432
- **数据库**: ionnode
- **Schema**: 已同步

## 📱 访问地址

### 主要页面
- 🏠 **Dashboard**: http://localhost:3001/
- 📋 **设备列表**: http://localhost:3001/dashboard/nodes
- 🔍 **设备详情**: http://localhost:3001/dashboard/nodes/[id]

### API 端点
- ⚡ **Health Check**: http://localhost:3000/
- 🔌 **tRPC Endpoint**: http://localhost:3000/trpc

## 🎮 可用功能

### 1. Dashboard 页面 (/)
- ✅ 查看设备统计 (总数、在线、离线、告警)
- ✅ 查看设备状态表格
- ✅ 点击设备跳转到详情页

### 2. 设备列表页 (/dashboard/nodes)
- ✅ 搜索设备 (名称/ID/位置)
- ✅ 筛选设备 (状态/类型)
- ✅ 添加新设备 (Add Node 按钮)
- ✅ 编辑设备 (Edit 按钮)
- ✅ 删除设备 (Delete 按钮)

### 3. 设备详情页 (/dashboard/nodes/[id])
- ✅ 查看设备基础信息
- ✅ 查看实时数据 (温度、湿度、电压、电池)
- ✅ 查看历史数据图表
- ✅ 切换时间范围 (1h/6h/24h/7d)

## 🔧 测试工具

### 使用模拟器生成测试数据

```bash
# 启动单个设备模拟器
pnpm simulator --node-id ION-001 --interval 5000

# 启动多个设备 (在不同终端)
pnpm simulator --node-id ION-001 --interval 5000
pnpm simulator --node-id ION-002 --interval 5000
pnpm simulator --node-id ION-003 --interval 5000
```

模拟器会自动生成随机数据并每 5 秒上报一次。

## 📊 查看日志

```bash
# 查看服务器日志
tail -f server.log

# 查看 Web 应用日志
tail -f web.log
```

## 🛑 停止服务

```bash
# 停止服务器
kill 570

# 停止 Web 应用
kill 583

# 或者一次性停止所有
kill 570 583
```

## 🎯 下一步建议

1. **添加测试设备**: 访问 http://localhost:3001/dashboard/nodes 点击 "Add Node"
2. **启动模拟器**: 运行 `pnpm simulator --node-id ION-001` 生成测试数据
3. **查看数据**: 刷新页面查看实时数据和图表

## 📝 注意事项

- 服务器运行在后台，使用 `tail -f server.log` 查看日志
- Web 应用支持热重载，修改代码会自动刷新
- 数据库已经就绪，可以直接使用
- 所有功能都已经实现并测试通过

---

🎉 **项目已成功启动！访问 http://localhost:3001 开始使用！**
