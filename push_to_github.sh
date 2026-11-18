#!/bin/bash

echo "=========================================="
echo "  准备推送代码到 GitHub"
echo "=========================================="
echo ""
echo "仓库: https://github.com/811271151/lonNode.git"
echo "分支: main"
echo ""
echo "最近的提交:"
git log --oneline -3
echo ""
echo "=========================================="
echo ""

read -p "确认推送？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "正在推送..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "=========================================="
        echo "  ✅ 推送成功！"
        echo "=========================================="
        echo ""
        echo "你可以访问以下链接查看你的仓库:"
        echo "https://github.com/811271151/lonNode"
        echo ""
    else
        echo ""
        echo "=========================================="
        echo "  ❌ 推送失败"
        echo "=========================================="
        echo ""
        echo "可能的原因:"
        echo "1. 需要输入 GitHub 用户名和密码"
        echo "2. 需要配置 SSH 密钥"
        echo "3. 网络连接问题"
        echo ""
        echo "建议:"
        echo "- 使用 GitHub Personal Access Token 代替密码"
        echo "- 或配置 SSH 密钥: https://docs.github.com/zh/authentication"
        echo ""
    fi
else
    echo "已取消推送"
fi
