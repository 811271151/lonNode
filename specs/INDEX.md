# IonNode MVP - Specs Index

> 需求来源: docs/requirement.md  
> 目标版本: v0.1.0  
> 工作分支: feature/ionnode-mvp

## 运行设置

- 工作分支: feature/ionnode-mvp
- 开工确认: 未确认
- 交付推送: 未授权
- 当前批次: 03-dashboard-page: T-01, T-02（并行）· 本批 AC: 4 个统计卡片正确显示, 设备状态表格正常渲染, Status badge 颜色正确, Last Seen 显示相对时间 · 提交点: 否

## 基线

- 测试命令: 无
- 构建命令: pnpm run build
- 静态检查: pnpm run check-types · pnpm exec ultracite check
- 原有失败: 无
- 原有静态检查报错: 0 条
- 数据源可达: 已确认（PostgreSQL 本地，DATABASE_URL=postgresql://postgres:123456@localhost:5432/ionnode，Navicat+Prisma 连接测试通过）

## Feature

| 序号 | Feature | 目录 | 依赖 | 任务数 | 状态 |
|------|---------|------|------|--------|------|
| 01 | database-layer | database-layer | — | 4 | ✅ 已完成 |
| 02 | api-layer | api-layer | 01 | 5 | ✅ 已完成 |
| 03 | dashboard-page | dashboard-page | 02 | 5 | 🚧 开发中 |
| 04 | nodes-page | nodes-page | 02 | 7 | ⏳ 待开发 |
| 05 | node-detail-page | node-detail-page | 02 | 8 | ⏳ 待开发 |
| 06 | simulator | simulator | 02 | 8 | ⏳ 待开发 |
