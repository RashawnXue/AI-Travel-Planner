# AI 旅行规划师 (AI Travel Planner)

基于 AI 的智能旅行规划 Web 应用，通过语音/文字交互理解用户旅行需求，自动生成个性化旅行路线方案。

## 技术栈

- **前端**: Vue 3 + TypeScript + Vite + Pinia + Vue Router + Ant Design Vue
- **后端**: Supabase (数据库、认证、存储)
- **地图服务**: 高德地图 API
- **AI 能力**: 阿里云百炼 (语音识别、大模型对话)

## 项目结构

```
src/
├── api/                    # API 接口封装
│   ├── auth.ts            # 认证相关 API
│   ├── plan.ts            # 行程相关 API
│   └── expense.ts         # 支出相关 API
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
│   └── validate.ts        # 验证函数
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

## 环境配置

1. 复制 `.env.example` 文件为 `.env`
2. 配置以下环境变量：

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 阿里云百炼
VITE_BAILIAN_API_KEY=your_bailian_api_key
VITE_BAILIAN_ASR_ENDPOINT=your_asr_endpoint
VITE_BAILIAN_LLM_ENDPOINT=your_llm_endpoint
VITE_BAILIAN_MODEL_NAME=qwen-max

# 高德地图
VITE_AMAP_KEY=your_amap_key
VITE_AMAP_SECRET=your_amap_secret
```

## Supabase 数据库初始化

1. 在 Supabase 控制台创建新项目
2. 在 SQL Editor 中执行 `docs/supabase-init.sql` 脚本
3. 配置邮箱验证（可选，用于生产环境）

## 安装依赖

```sh
npm install
```

## 开发

```sh
npm run dev
```

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

## 待开发功能

详见 `docs/PRD.md`

- [ ] 智能行程规划（AI 生成）
- [ ] 语音输入（语音识别）
- [ ] 地图导航（高德地图集成）
- [ ] 行程编辑
- [ ] 行程分享

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
