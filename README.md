# AI 旅行规划师 (AI Travel Planner)

基于 AI 的智能旅行规划 Web 应用，通过语音/文字交互理解用户旅行需求，自动生成个性化旅行路线方案。

## 技术栈

### 前端
- **框架**: Vue 3 + TypeScript + Vite + Pinia + Vue Router
- **UI 组件库**: Ant Design Vue
- **后端服务**: Supabase (数据库、认证、存储)
- **地图服务**: 高德地图 API

### 后端
- **框架**: FastAPI (Python 3.10+)
- **AI 能力**: 阿里云百炼 (大模型对话)
- **语音识别**: 阿里云 Paraformer ASR
- **对象存储**: 阿里云 OSS (音频文件存储)

### 架构说明
本项目采用前后端分离架构：
- **前端**: 负责界面展示、用户交互、Supabase 数据操作
- **后端**: 负责 AI 调用、语音识别、文件上传等敏感操作
- **优势**: 敏感配置（OSS密钥、ASR密钥等）不暴露在浏览器中

## 项目结构

```
src/
├── api/                    # API 接口封装
│   ├── auth.ts            # 认证相关 API
│   ├── plan.ts            # 行程相关 API
│   ├── expense.ts         # 支出相关 API
│   └── paraformer.ts      # 百炼 Paraformer 实时识别 WS（推流、结果）
├── assets/                 # 静态资源
│   ├── base.css           # 基础样式
│   └── main.css           # 主样式
├── components/             # 组件
│   ├── common/            # 公共组件
│   │   ├── AppHeader.vue         # 顶部导航栏
│   │   └── EmptyState.vue        # 空状态组件
│   └── plan/              # 行程相关组件
│       ├── PlanList.vue          # 行程列表
│       ├── PlanCard.vue          # 行程卡片
│       ├── PlanOverview.vue      # 行程概览
│       ├── DailyPlan.vue         # 每日行程
│       ├── AccommodationTab.vue  # 住宿 Tab
│       ├── TransportTab.vue      # 交通 Tab
│       └── BudgetTab.vue         # 预算 Tab
├── router/                 # 路由配置
│   └── index.ts
├── stores/                 # Pinia stores
│   ├── user.ts            # 用户状态
│   ├── plan.ts            # 行程状态
│   └── expense.ts         # 支出状态
├── types/                  # TypeScript 类型定义
│   ├── user.ts            # 用户类型
│   ├── api.ts             # API 类型
│   ├── plan.ts            # 行程类型
│   └── expense.ts         # 支出类型
├── utils/                  # 工具函数
│   ├── supabase.ts        # Supabase 客户端
│   ├── validate.ts        # 验证函数
│   └── audio.ts           # 麦克风采集、16k 下采样、PCM 分片
├── views/                  # 页面组件
│   ├── auth/              # 认证页面
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   └── plan/              # 行程页面
│       ├── PlanListView.vue      # 行程列表页（首页）
│       ├── CreatePlanView.vue    # 创建行程页
│       └── PlanDetailView.vue    # 行程详情页
├── App.vue                 # 根组件
└── main.ts                 # 入口文件
```

## 快速开始

### 重要提示 ⚠️

在首次运行项目前，请务必完成以下步骤：

1. **配置 Supabase 邮件验证**
   - 参考 `docs/supabase-email-config.md` 完成Supabase Dashboard中的配置
   - 这是注册功能正常工作的前提条件

2. **执行数据库初始化脚本**
   - 在 Supabase Dashboard > SQL Editor 中执行 `docs/supabase-init.sql`
   - 或执行 `AI-Travel-Planner-be/supabase_fix_registration.sql` 修复注册问题

## 环境配置

### 前端配置

1. 复制 `.env.example` 文件为 `.env`
2. 配置以下环境变量：

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 阿里云百炼（仅需 App ID，API Key 在界面配置或后端处理）
VITE_BAILIAN_APP_ID=your_bailian_app_id

# 高德地图（仅需 Key，Secret 在后端处理）
VITE_AMAP_KEY=your_amap_key
```

### 后端配置

1. 进入后端目录：`cd AI-Travel-Planner-be`
2. 复制 `.env.example` 文件为 `.env`
3. 配置以下环境变量：

```env
# 阿里云百炼
BAILIAN_APP_ID=your_bailian_app_id

# 阿里云 OSS
OSS_REGION=oss-cn-shanghai
OSS_ACCESS_KEY_ID=your_oss_access_key_id
OSS_ACCESS_KEY_SECRET=your_oss_access_key_secret
OSS_BUCKET=your_bucket_name

# 高德地图
AMAP_SECRET=your_amap_secret

# CORS 配置（允许的前端域名）
CORS_ORIGINS=http://localhost:5173,http://localhost:80
```

## Supabase 数据库初始化

1. 在 Supabase 控制台创建新项目
2. 在 SQL Editor 中执行 `docs/supabase-init.sql` 脚本
3. 配置邮箱验证（可选，用于生产环境）

## 高德地图配置

1. 访问 [高德开放平台](https://lbs.amap.com/) 注册账号
2. 创建应用并获取 Web 端 JS API Key
3. 在 `index.html` 中替换 API Key 和安全密钥
4. 详细配置步骤请查看 `docs/amap-setup.md`

## 安装依赖

```sh
npm install
```

## 开发

### 启动后端服务

```sh
cd AI-Travel-Planner-be

# 首次运行：创建虚拟环境并安装依赖
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 启动后端（开发模式，支持热重载）
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

或使用提供的启动脚本：
```sh
chmod +x start.sh
./start.sh
```

### 启动前端服务

```sh
# 在项目根目录
npm run dev
```

前端将运行在 `http://localhost:5173`，后端运行在 `http://localhost:8000`

### API 文档

后端启动后，访问 `http://localhost:8000/docs` 查看自动生成的 API 文档（Swagger UI）

## 构建

```sh
npm run build
```

## 类型检查

```sh
npm run type-check
```

## 代码检查

```sh
npm run lint
```

## 已完成功能

### 用户管理
- ✅ 用户注册
- ✅ 用户登录
- ✅ 用户登出
- ✅ 登录状态管理
- ✅ 路由守卫
- ✅ 表单验证
- ✅ Supabase 集成

### 行程管理
- ✅ 行程列表展示
- ✅ 行程详情查看
- ✅ 行程删除
- ✅ 每日行程展示（含时间轴）
- ✅ 住宿安排展示
- ✅ 交通信息展示
- ✅ 费用预算可视化
- ✅ 地点经纬度支持（精确导航）
- ✅ 高德地图集成（实时路线展示）
- ✅ 活动和住宿照片展示

### 支出管理
- ✅ 支出记录列表
- ✅ 添加支出记录
- ✅ 删除支出记录
- ✅ 支出分类统计

### UI/UX
- ✅ 响应式布局（PC端）
- ✅ 侧边栏折叠
- ✅ 空状态提示
- ✅ Loading 状态
- ✅ 错误处理
- ✅ 现代化卡片设计（渐变背景、玻璃态效果、动画）
- ✅ 标签式偏好展示
- ✅ 悬浮交互效果

## 待开发功能

详见 `docs/PRD.md`

- [ ] 智能行程规划（AI 生成）
- [ ] 语音输入（语音识别）
- [ ] 行程编辑
- [ ] 行程分享
- [ ] 实时导航（调用高德导航 API）

## Docker 部署

### 架构说明

Docker 部署包含两个容器：
- **前端容器**: Nginx + Vue 静态文件（端口 80）
- **后端容器**: FastAPI 应用（端口 8000）

前端容器通过 Nginx 反向代理 `/api/backend/` 到后端容器。

### 快速部署

#### 1. 部署后端

```bash
cd AI-Travel-Planner-be

# 配置环境变量
cp .env.example .env
vi .env  # 填入实际配置

# 构建镜像
docker build -t ai-travel-planner-backend:latest .

# 运行容器
docker run -d \
  -p 8000:8000 \
  --name ai-travel-planner-backend \
  --env-file .env \
  ai-travel-planner-backend:latest
```

#### 2. 部署前端

```bash
cd ..  # 返回项目根目录

# 配置环境变量
cp .env.docker.example .env.docker
vi .env.docker  # 填入实际配置

# 构建并打包
chmod +x build.sh
./build.sh

# 运行容器（连接到后端）
docker run -d \
  -p 80:80 \
  --name ai-travel-planner \
  --link ai-travel-planner-backend:backend \
  ai-travel-planner:latest
```

### 使用 Docker Compose（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  backend:
    build: ./AI-Travel-Planner-be
    container_name: ai-travel-planner-backend
    ports:
      - "8000:8000"
    env_file:
      - ./AI-Travel-Planner-be/.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  frontend:
    build: .
    container_name: ai-travel-planner
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

启动所有服务：
```bash
docker-compose up -d
```

### 手动部署

#### 前端

```bash
# 1. 本地构建
cp .env.docker .env
npm run build

# 2. 构建镜像
docker build -t ai-travel-planner:latest .

# 3. 运行容器
docker run -d -p 80:80 --name ai-travel-planner ai-travel-planner:latest
```

#### 后端

```bash
cd AI-Travel-Planner-be

# 1. 构建镜像
docker build -t ai-travel-planner-backend:latest .

# 2. 运行容器
docker run -d \
  -p 8000:8000 \
  --name ai-travel-planner-backend \
  --env-file .env \
  ai-travel-planner-backend:latest
```

### 更新部署

```bash
# 前端
./build.sh v1.0.1
docker stop ai-travel-planner && docker rm ai-travel-planner
docker run -d -p 80:80 --name ai-travel-planner ai-travel-planner:v1.0.1

# 后端
cd AI-Travel-Planner-be
docker build -t ai-travel-planner-backend:v1.0.1 .
docker stop ai-travel-planner-backend && docker rm ai-travel-planner-backend
docker run -d -p 8000:8000 --name ai-travel-planner-backend \
  --env-file .env ai-travel-planner-backend:v1.0.1
```

### 环境变量说明

#### 前端环境变量（`.env.docker`）
- `VITE_SUPABASE_URL`: Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 匿名密钥
- `VITE_BAILIAN_APP_ID`: 百炼应用 ID
- `VITE_AMAP_KEY`: 高德地图 Key

#### 后端环境变量（`AI-Travel-Planner-be/.env`）
- `BAILIAN_APP_ID`: 百炼应用 ID
- `OSS_REGION`: OSS 区域
- `OSS_ACCESS_KEY_ID`: OSS 访问密钥 ID
- `OSS_ACCESS_KEY_SECRET`: OSS 访问密钥
- `OSS_BUCKET`: OSS 存储桶名称
- `AMAP_SECRET`: 高德地图密钥
- `CORS_ORIGINS`: 允许的前端域名（逗号分隔）

## 开发规范

- 使用 Vue 3 组合式 API
- 遵循 TypeScript 严格模式
- 组件职责单一，易于复用
- API 调用统一封装
- 所有表单进行前端验证
- 错误信息用户友好

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License
