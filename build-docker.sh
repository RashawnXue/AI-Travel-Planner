#!/bin/bash

# Docker 镜像构建脚本
# 用法: ./build-docker.sh [tag]

set -e

# 默认镜像名称和标签
IMAGE_NAME="ai-travel-planner"
TAG="${1:-latest}"
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

echo "================================================"
echo "AI Travel Planner - Docker 构建"
echo "镜像名称: ${FULL_IMAGE_NAME}"
echo "================================================"
echo ""

# 步骤1: 检查 .env.docker 文件
echo "📋 步骤 1/4: 检查环境变量配置..."
if [ ! -f ".env.docker" ]; then
    echo "❌ 错误: .env.docker 文件不存在！"
    echo "请先创建 .env.docker 文件并配置环境变量"
    echo "参考: cp .env.docker.example .env.docker"
    exit 1
fi
echo "✅ .env.docker 文件存在"
echo ""

# 步骤2: 在本地构建项目
echo "📋 步骤 2/4: 在本地构建项目..."
echo "复制 .env.docker 为 .env..."
cp .env.docker .env

echo "执行 npm run build..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ 错误: dist 目录未生成！构建失败"
    exit 1
fi
echo "✅ 项目构建成功，dist 目录已生成"
echo ""

# 步骤3: 检查必需文件
echo "📋 步骤 3/4: 检查必需文件..."
if [ ! -f "Dockerfile" ]; then
    echo "❌ 错误: Dockerfile 不存在！"
    exit 1
fi

if [ ! -f "nginx.conf" ]; then
    echo "❌ 错误: nginx.conf 不存在！"
    exit 1
fi
echo "✅ 所有必需文件存在"
echo ""

# 步骤4: 构建 Docker 镜像
echo "� 步骤 4/4: 构建 Docker 镜像..."
echo "注意: Docker 镜像只包含 Nginx + 静态文件"
echo ""

docker build -t "${FULL_IMAGE_NAME}" .

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "✅ Docker 镜像构建成功！"
    echo "镜像名称: ${FULL_IMAGE_NAME}"
    echo "================================================"
    echo ""
    
    # 显示镜像信息
    echo "� 镜像信息:"
    docker images "${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    echo ""
    
    echo "�📋 后续操作:"
    echo ""
    echo "1️⃣  运行容器:"
    echo "   docker run -d -p 80:80 --name ai-travel-planner ${FULL_IMAGE_NAME}"
    echo ""
    echo "2️⃣  查看容器日志:"
    echo "   docker logs -f ai-travel-planner"
    echo ""
    echo "3️⃣  停止容器:"
    echo "   docker stop ai-travel-planner"
    echo ""
    echo "4️⃣  推送到仓库 (可选):"
    echo "   docker tag ${FULL_IMAGE_NAME} your-registry/${FULL_IMAGE_NAME}"
    echo "   docker push your-registry/${FULL_IMAGE_NAME}"
    echo ""
else
    echo ""
    echo "❌ Docker 镜像构建失败！请检查错误信息。"
    exit 1
fi
            echo -e "${YELLOW}推送镜像到仓库...${NC}"
            docker push "$FULL_IMAGE_NAME"
            echo -e "${GREEN}✓ 镜像推送成功!${NC}"
        fi
    fi
    
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}构建完成!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "\n运行命令:"
    echo -e "${YELLOW}docker run -d -p 80:80 --name ai-travel-planner $FULL_IMAGE_NAME${NC}"
    echo -e "\n或使用 docker-compose:"
    echo -e "${YELLOW}docker-compose up -d${NC}"
    echo ""
else
    echo -e "\n${RED}✗ Docker镜像构建失败!${NC}"
    exit 1
fi
