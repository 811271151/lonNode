# Node Simulator - 任务清单

## Task 6.1: 创建项目结构

- [ ] 创建 `tools/simulator/index.ts`
- [ ] 配置 TypeScript
- [ ] 添加 package.json 脚本

**状态**: ⏸️ 待开始

---

## Task 6.2: 安装依赖

- [ ] 安装 yargs（CLI 参数解析）
- [ ] 安装 node-fetch（HTTP 客户端）
- [ ] 安装类型定义

```bash
pnpm add yargs node-fetch
pnpm add -D @types/yargs tsx
```

---

## Task 6.3: 实现数据生成逻辑

- [ ] 实现 `generateData()` 函数
- [ ] 随机生成 temperature, humidity, voltage, battery
- [ ] 确保数值范围合理

**位置**: `tools/simulator/index.ts`

---

## Task 6.4: 实现数据上报逻辑

- [ ] 实现 `reportData()` 函数
- [ ] 使用 fetch 调用 tRPC API
- [ ] 处理成功和失败情况
- [ ] 输出日志

---

## Task 6.5: 实现 CLI 参数解析

- [ ] 使用 yargs 解析参数
- [ ] 支持 --node-id, --interval, --api-url
- [ ] 设置默认值
- [ ] 添加 --help 说明

---

## Task 6.6: 实现定时任务

- [ ] 使用 setInterval 定时上报
- [ ] 实现优雅退出（SIGINT 处理）
- [ ] 启动时输出配置信息

---

## Task 6.7: 测试

- [ ] 启动 server
- [ ] 运行 simulator
- [ ] 验证数据上报成功
- [ ] 验证 Dashboard 显示数据
- [ ] 测试多设备同时运行

---

## Task 6.8: 文档

- [ ] 添加 README
- [ ] 使用示例
- [ ] 参数说明
