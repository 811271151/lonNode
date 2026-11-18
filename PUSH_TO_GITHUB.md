# 推送代码到 GitHub 指南

## 📦 当前状态

✅ 代码已经提交到本地 Git 仓库
✅ 远程仓库已配置: https://github.com/811271151/lonNode.git
✅ 分支已重命名为 main

## 🚀 推送步骤

### 方法 1: 使用命令行推送（推荐）

在项目根目录执行：

```bash
git push -u origin main
```

### 方法 2: 使用 PowerShell

```powershell
git push -u origin main
```

### 方法 3: 使用 VS Code

1. 打开 VS Code 的源代码管理面板（Ctrl+Shift+G）
2. 点击 "..." 菜单
3. 选择 "Push to..."
4. 选择 origin/main

## 🔑 如果需要认证

### 使用 Personal Access Token (推荐)

如果 GitHub 要求输入密码，你需要使用 Personal Access Token 而不是密码：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" -> "Generate new token (classic)"
3. 勾选 "repo" 权限
4. 生成 token 并复制
5. 在推送时使用 token 作为密码

### 或配置 SSH 密钥

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 将公钥添加到 GitHub: Settings -> SSH and GPG keys
```

然后更改远程 URL：
```bash
git remote set-url origin git@github.com:811271151/lonNode.git
git push -u origin main
```

## 📊 推送的内容

本次推送包含：

- ✅ 27 个文件修改
- ✅ 2741 行新增代码
- ✅ 所有 MVP 功能实现
- ✅ 完整的文档

### 主要文件：
- Dashboard 页面及组件
- Nodes 列表和详情页
- API routers (nodes & nodeData)
- UI 组件 (Dialog, AlertDialog, Select)
- Simulator CLI 工具
- 项目文档 (README.md, PROJECT_STATUS.md 等)

## ✅ 验证推送成功

推送成功后，访问：
https://github.com/811271151/lonNode

你应该能看到：
- 所有代码文件
- README.md 显示项目介绍
- 最新的提交记录

## 🆘 遇到问题？

### 网络问题
如果遇到 "Connection was reset" 错误：
- 检查网络连接
- 尝试使用 VPN
- 稍后重试

### 认证失败
- 确保使用 Personal Access Token 而不是密码
- 检查 token 是否有 repo 权限

### 权限问题
- 确认你是仓库的所有者
- 检查仓库设置中的访问权限

## 📞 需要帮助？

如果推送遇到问题，你可以：
1. 截图错误信息
2. 检查 GitHub 的状态页面
3. 尝试使用 GitHub Desktop 客户端推送
