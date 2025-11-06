#!/bin/bash
# Docker 镜像构建脚本
# 用法: ./build-docker.sh [tag]

set -e

IMAGE_NAME="ai-travel-planner"
TAG="${1:-latest}"

echo "🚀 开始构建 Docker 镜像: ${IMAGE_NAME}:${TAG}"
echo ""

# 检查环境变量文件
if [ ! -f ".env.docker" ]; then
    echo "❌ 错误: .env.docker 文件不存在"
    echo "请执行: cp .env.docker.example .env.docker"
    exit 1
fi

# 本地构建
echo "📦 步骤 1/2: 本地构建项目..."
cp .env.docker .env
npm run build

if [ ! -d "dist" ]; then
    echo "❌ 构建失败: dist 目录未生成"
    exit 1
fi

# 构建镜像
echo ""
echo "🐳 步骤 2/2: 构建 Docker 镜像..."
docker build -t "${IMAGE_NAME}:${TAG}" .

echo ""
echo "✅ 构建完成!"
echo ""
echo "运行容器:"
echo "  docker run -d -p 80:80 --name ${IMAGE_NAME} ${IMAGE_NAME}:${TAG}"
echo ""
