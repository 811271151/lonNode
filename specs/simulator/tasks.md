# Node Simulator - 任务清单

- [ ] T-01: [配置] 创建项目结构 (~30min)
  - 依赖: 无
  - 文件: tools/simulator/index.ts, tools/simulator/package.json, tools/simulator/tsconfig.json
  - AC: 无

- [ ] T-02: [配置] 安装依赖 (~15min)
  - 依赖: T-01
  - 文件: tools/simulator/package.json
  - AC: 无

- [ ] T-03: [后端] 实现数据生成逻辑 (~1h)
  - 依赖: 无
  - 文件: tools/simulator/index.ts
  - AC: 数据生成逻辑正确

- [ ] T-04: [后端] 实现数据上报逻辑 (~1h)
  - 依赖: T-03
  - 文件: tools/simulator/index.ts
  - AC: 定时上报功能正常, 上报成功/失败有日志

- [ ] T-05: [后端] 实现 CLI 参数解析 (~1h)
  - 依赖: 无
  - 文件: tools/simulator/index.ts
  - AC: 命令行参数生效

- [ ] T-06: [后端] 实现定时任务 (~30min)
  - 依赖: T-04, T-05
  - 文件: tools/simulator/index.ts
  - AC: 可通过 Ctrl+C 优雅退出

- [ ] T-07: [测试] 测试 Simulator (~1h)
  - 依赖: T-06
  - 文件: (手动测试，无文件改动)
  - AC: CLI 工具可运行, 多设备同时模拟可行

- [ ] T-08: [配置] 文档 (~30min)
  - 依赖: T-07
  - 文件: tools/simulator/README.md
  - AC: 无
