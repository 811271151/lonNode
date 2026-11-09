# Node Simulator - 需求

## 需求来源

docs/requirement.md #11 模拟设备

## 目标

实现一个 CLI 工具，模拟 IoT 设备生成数据并上报到 IonNode。

## 功能需求

### 1. 数据生成

自动生成随机设备数据：

- **Temperature**: 20-35°C 随机值
- **Humidity**: 50-80% 随机值
- **Voltage**: 3.3-4.1V 随机值
- **Battery**: 70-100% 随机值

### 2. 定时上报

- 每隔 N 秒（默认 5 秒）上报一次数据
- 使用 HTTP POST 调用 tRPC API
- 上报成功/失败有日志输出

### 3. 命令行参数

```bash
node simulator.js --node-id ION-001 --interval 5000 --api-url http://localhost:3000
```

参数：
- `--node-id`: Node ID（必需）
- `--interval`: 上报间隔（毫秒，默认 5000）
- `--api-url`: API 地址（默认 http://localhost:3000）

### 4. 多设备支持

可同时启动多个 Simulator 进程模拟多个设备。

## 上报接口

```typescript
POST /trpc/nodeData.report

Body:
{
  nodeId: "ION-001",
  temperature: 26.5,
  humidity: 63,
  voltage: 3.7,
  battery: 85
}
```

## 使用示例

```bash
# 启动 Simulator
pnpm simulator --node-id ION-001

# 输出示例
[ION-001] Starting simulator...
[ION-001] API URL: http://localhost:3000
[ION-001] Interval: 5000ms
[ION-001] Data reported: { temperature: 26.5, humidity: 63, voltage: 3.7, battery: 85 }
[ION-001] Data reported: { temperature: 27.1, humidity: 61, voltage: 3.8, battery: 87 }
```

## 验收标准

- [ ] CLI 工具可运行
- [ ] 数据生成逻辑正确
- [ ] 定时上报功能正常
- [ ] 命令行参数生效
- [ ] 多设备同时模拟可行
- [ ] 上报成功/失败有日志
- [ ] 可通过 Ctrl+C 优雅退出
