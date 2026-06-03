#!/bin/bash

# 确保脚本在错误时停止
set -e

echo "🚀 开始本地发布流程..."

# 1. 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️ 警告: 您有未提交的更改。建议先提交代码。"
  read -p "是否继续发布? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# 2. 自动递增版本号 (Patch)
echo "📦 正在递增版本号..."
npm version patch --no-git-tag-version

# 获取更新后的版本号
VERSION=$(node -p "require('./package.json').version")
echo "✅ 当前版本: $VERSION"

# 3. 编译项目
echo "🏗️ 正在编译项目..."
npm run compile

# 4. 执行发布
echo "🌐 正在发布到 VS Code Marketplace..."
# 使用本地已安装的 vsce (已经在 devDependencies 中)
npx vsce publish --no-dependencies

# 5. 更新本地 Git 记录 (可选)
echo "📝 正在同步版本信息到 Git..."
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: release v$VERSION"
git tag "v$VERSION"

echo "🎉 发布成功！版本 v$VERSION 已上线。"
echo "💡 提示：别忘了运行 'git push origin dev --tags' 同步到 GitHub（不含 assets）。"
