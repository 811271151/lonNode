# IonNode MVP 产品需求文档

> 产品名称：IonNode  
> 中文名：离子节点  
> 产品定位：轻量级 IoT / 设备节点管理平台  
> 版本：v0.1.0  
> 状态：MVP

---

# 1. 产品概述

IonNode 是一个用于管理 IoT 设备节点的 Web 系统。

用户可以在系统中：

- 添加设备
- 查看设备
- 查看设备在线状态
- 查看设备基础信息
- 查看设备实时数据
- 查看历史数据
- 查看设备运行日志

核心目标：

> **用一个简单的后台，把一批 IoT 设备管理起来。**

---

# 2. 核心概念

## Node

Node 就是一台设备。

例如：

```text
Node 001
温度传感器
南京工厂
```

或者：

```text
Node 002
压力传感器
生产线 A
```

每个 Node 具有：

```text
ID
名称
类型
位置
状态
最后在线时间
```

---

# 3. 产品角色

MVP 只需要一个角色：

### Admin

管理员可以：

- 查看设备
- 添加设备
- 修改设备
- 删除设备
- 查看设备数据

暂时不做复杂权限系统。

---

# 4. 页面结构

整个系统只需要 4 个主要页面。

```text
IonNode
│
├── Dashboard
│
├── Nodes
│
├── Node Detail
│
└── Settings
```

---

# 5. Dashboard

首页显示整个系统的设备概况。

## 顶部统计

```text
Total Nodes
12

Online
9

Offline
2

Warning
1
```

---

## 设备状态

显示一个简单的设备列表：

| Node | Type | Status | Last Seen |
|---|---|---|---|
| Node-001 | Temperature | Online | 10s ago |
| Node-002 | Pressure | Online | 5s ago |
| Node-003 | Temperature | Offline | 5m ago |

---

## 数据趋势

简单显示几个数据图：

```text
Temperature
Pressure
Humidity
```

可以使用折线图。

---

# 6. Node 列表

路径：

```text
/Nodes
```

展示所有设备。

字段：

```text
Name
Node ID
Type
Location
Status
Last Seen
Created At
```

支持：

```text
搜索
状态筛选
类型筛选
```

---

# 7. 添加 Node

点击：

```text
+ Add Node
```

填写：

```text
Node Name
Node ID
Type
Location
Description
```

例如：

```text
Node Name:
温度节点 001

Node ID:
ION-001

Type:
Temperature Sensor

Location:
南京工厂 1 号车间

Description:
生产线温度采集设备
```

保存后创建 Node。

---

# 8. Node Detail

点击设备进入详情页面。

例如：

```text
Temperature Node 001

● Online

Node ID: ION-001
Type: Temperature Sensor
Location: Factory A
Last Seen: 10 seconds ago
```

---

## 实时数据

显示：

```text
Temperature
26.5 °C

Humidity
63 %

Voltage
3.7 V
```

---

## 数据趋势

显示最近：

```text
1 hour
6 hours
24 hours
7 days
```

的历史数据。

---

## Node 信息

显示：

```text
Node ID
Type
Location
IP Address
Firmware Version
Created At
Last Seen
```

---

# 9. Node 状态

Node 只需要三个状态：

```text
Online
Offline
Warning
```

判断规则很简单。

例如：

```text
超过 60 秒没有收到数据
→ Offline
```

如果数据异常：

```text
Temperature > 80℃
→ Warning
```

---

# 10. Node 数据

MVP 只支持几个基础数据：

```text
Temperature
Humidity
Voltage
Battery
```

后续可以扩展。

数据格式：

```json
{
  "nodeId": "ION-001",
  "temperature": 26.5,
  "humidity": 63,
  "voltage": 3.7,
  "timestamp": "2026-11-09T10:00:00Z"
}
```

---

# 11. 模拟设备

第一版**不要求真实硬件**。

开发阶段使用模拟 Node。

例如启动：

```text
Node Simulator
```

每隔 5 秒生成一次数据：

```text
Temperature: 25.1
Humidity: 61
Voltage: 3.7
```

然后发送给 IonNode。

这样可以在没有真实硬件的情况下完成整个系统。

---

# 12. 数据流

整个系统的数据流非常简单：

```text
Node Simulator
      │
      │ HTTP
      ▼
IonNode API
      │
      ▼
Database
      │
      ▼
Web Dashboard
```

暂时不需要：

```text
MQTT
Kafka
Redis
NATS
Agent
Edge Runtime
Plugin
AI
```

---

# 13. API

只需要几个 API。

## 获取设备

```http
GET /api/nodes
```

---

## 获取设备详情

```http
GET /api/nodes/:id
```

---

## 创建设备

```http
POST /api/nodes
```

---

## 修改设备

```http
PATCH /api/nodes/:id
```

---

## 删除设备

```http
DELETE /api/nodes/:id
```

---

## 上报数据

```http
POST /api/nodes/:id/data
```

---

## 获取历史数据

```http
GET /api/nodes/:id/data
```

---

# 14. 数据库

MVP 只需要三张主要表。

## nodes

```text
id
node_id
name
type
location
status
description
created_at
updated_at
last_seen_at
```

---

## node_data

```text
id
node_id
temperature
humidity
voltage
battery
created_at
```

---

## users

```text
id
username
password
created_at
```

---

# 15. 技术栈

为了简单，推荐：

### Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
```

### Backend

第一版直接使用：

```text
Next.js API
```

不用单独拆 NestJS。

### Database

```text
PostgreSQL
```

### ORM

```text
Prisma
```

### Charts

```text
Recharts
```

---

# 16. UI 风格

IonNode 不做传统的“物联网大屏”。

整体风格：

```text
简洁
工业
科技
专业
```

推荐：

```text
深色背景
卡片
数据表格
简洁折线图
状态标签
少量高亮色
```

首页重点是：

```text
设备数量
设备状态
数据趋势
设备列表
```

而不是堆大量炫酷动画。

---

# 17. MVP 完成标准

完成下面这些，就算 IonNode v0.1 完成：

### 设备

- [ ] 添加 Node
- [ ] 修改 Node
- [ ] 删除 Node
- [ ] 查看 Node
- [ ] 搜索 Node

### 状态

- [ ] Online
- [ ] Offline
- [ ] Warning

### 数据

- [ ] Node 上报数据
- [ ] 查看实时数据
- [ ] 查看历史数据
- [ ] 数据折线图

### Dashboard

- [ ] Node 总数
- [ ] Online 数量
- [ ] Offline 数量
- [ ] Warning 数量
- [ ] 最近设备数据

### Simulator

- [ ] 模拟 Node
- [ ] 自动产生数据
- [ ] 自动上报数据

---

# 18. 第一版暂时不做

为了控制项目规模，以下功能全部放到后续版本：

```text
MQTT
设备 Agent
OTA
插件系统
AI
规则引擎
告警通知
多租户
复杂权限
设备拓扑
3D 数字孪生
集群
Kubernetes
Kafka
```

---

# 19. 后续版本

## v0.2

加入：

```text
设备分组
设备标签
告警
数据导出
```

## v0.3

加入：

```text
MQTT
真实 IoT 设备接入
```

## v0.4

加入：

```text
Node Agent
远程控制
```

## v1.0

再考虑：

```text
AI
设备拓扑
规则引擎
OTA
数字孪生
```

---

# 20. 产品核心

IonNode 第一阶段只围绕一个闭环：

```text
        创建 Node
           ↓
        Node 上线
           ↓
        上报数据
           ↓
       保存数据
           ↓
      Dashboard 展示
           ↓
       查看历史数据
```

一句话定义：

> **IonNode 是一个简单、现代的 IoT Node 管理与数据监控平台。**