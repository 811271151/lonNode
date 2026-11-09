# Node Simulator - 设计

## 项目位置

`tools/simulator/index.ts` 或独立包 `packages/simulator/`

## 技术选型

- **Runtime**: Node.js + TypeScript (tsx)
- **CLI 参数解析**: yargs 或 commander
- **HTTP 客户端**: node-fetch 或 axios
- **定时任务**: setInterval

## 核心逻辑

### 数据生成函数

```typescript
interface NodeData {
  temperature: number
  humidity: number
  voltage: number
  battery: number
}

function generateData(): NodeData {
  return {
    temperature: 20 + Math.random() * 15,  // 20-35°C
    humidity: 50 + Math.random() * 30,     // 50-80%
    voltage: 3.3 + Math.random() * 0.8,    // 3.3-4.1V
    battery: 70 + Math.random() * 30,      // 70-100%
  }
}
```

### 数据上报函数

```typescript
async function reportData(
  apiUrl: string,
  nodeId: string,
  data: NodeData
): Promise<void> {
  const url = `${apiUrl}/trpc/nodeData.report`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nodeId,
      ...data,
    }),
  })
  
  if (response.ok) {
    console.log(`[${nodeId}] ✓ Data reported:`, data)
  } else {
    console.error(`[${nodeId}] ✗ Failed to report data:`, response.statusText)
  }
}
```

### 定时任务

```typescript
function startSimulator(config: SimulatorConfig) {
  const { nodeId, interval, apiUrl } = config
  
  console.log(`[${nodeId}] Starting simulator...`)
  console.log(`[${nodeId}] API URL: ${apiUrl}`)
  console.log(`[${nodeId}] Interval: ${interval}ms`)
  
  const timer = setInterval(async () => {
    const data = generateData()
    await reportData(apiUrl, nodeId, data)
  }, interval)
  
  // 优雅退出
  process.on('SIGINT', () => {
    console.log(`\n[${nodeId}] Stopping simulator...`)
    clearInterval(timer)
    process.exit(0)
  })
}
```

### CLI 参数解析

使用 yargs:

```typescript
import yargs from 'yargs'

const argv = yargs
  .option('node-id', {
    type: 'string',
    demandOption: true,
    describe: 'Node ID',
  })
  .option('interval', {
    type: 'number',
    default: 5000,
    describe: 'Report interval in milliseconds',
  })
  .option('api-url', {
    type: 'string',
    default: 'http://localhost:3000',
    describe: 'API base URL',
  })
  .help()
  .parse()

startSimulator({
  nodeId: argv['node-id'],
  interval: argv.interval,
  apiUrl: argv['api-url'],
})
```

## package.json 脚本

```json
{
  "scripts": {
    "simulator": "tsx tools/simulator/index.ts"
  }
}
```

## 多设备模拟

启动多个终端窗口：

```bash
# Terminal 1
pnpm simulator --node-id ION-001

# Terminal 2
pnpm simulator --node-id ION-002

# Terminal 3
pnpm simulator --node-id ION-003 --interval 3000
```

## 依赖

```json
{
  "dependencies": {
    "yargs": "^17.7.2",
    "node-fetch": "^3.3.2"
  },
  "devDependencies": {
    "@types/yargs": "^17.0.32",
    "tsx": "^4.7.0"
  }
}
```
