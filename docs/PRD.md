# AI 旅行规划师产品需求文档 (PRD)

## 文档信息
- **产品名称**: AI Travel Planner (AI 旅行规划师)
- **版本号**: v1.0.0
- **创建日期**: 2025-10-17
- **产品形态**: Web 应用
- **目标用户**: 需要制定旅行计划的个人或家庭用户

---

## 一、产品概述

### 1.1 产品定位
AI 旅行规划师是一款基于人工智能的 Web 旅行规划工具，通过语音/文字交互理解用户旅行需求，自动生成个性化旅行路线方案，并提供费用预算管理和云端数据同步功能。

### 1.2 产品价值
- 简化旅行规划流程，节省用户时间
- 通过 AI 提供个性化、专业的旅行建议
- 帮助用户合理规划和管理旅行预算
- 云端同步，随时随地查看和修改行程

### 1.3 技术架构
- **前端**: Vue 3 + TypeScript + Vite + Pinia + Vue Router + Ant Design Vue
- **后端**: Supabase (数据库、认证、存储)
- **地图服务**: 高德地图 API
- **AI 能力**: 阿里云百炼 (语音识别、大模型对话)

---

## 二、核心功能需求

## 功能模块一：用户管理与数据存储

### 2.1 用户注册

#### 2.1.1 注册方式
仅支持邮箱注册，不支持手机号和第三方登录。

#### 2.1.2 注册页面布局
- 页面路径: `/register`
- 页面居中显示，背景使用渐变色 `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- 表单卡片宽度固定 `400px`，白色背景，圆角 `12px`，阴影 `0 8px 24px rgba(0,0,0,0.12)`
- Logo 位于卡片顶部，尺寸 `64px * 64px`
- 标题文字 "注册 AI 旅行规划师"，字号 `24px`，字重 `600`，颜色 `#1a1a1a`

#### 2.1.3 表单字段
**必填字段（按顺序排列）:**
1. 用户名
   - 字段名: `username`
   - 输入框占位符: "请输入用户名"
   - 验证规则:
     - 不能为空，提示 "请输入用户名"
     - 长度 2-20 个字符，提示 "用户名长度为 2-20 个字符"
     - 仅允许中英文、数字、下划线，提示 "用户名只能包含中英文、数字和下划线"
   - 输入框高度 `40px`，圆角 `8px`

2. 邮箱
   - 字段名: `email`
   - 输入框占位符: "请输入邮箱地址"
   - 验证规则:
     - 不能为空，提示 "请输入邮箱地址"
     - 必须符合邮箱格式，正则: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`，提示 "请输入正确的邮箱格式"
   - 输入框高度 `40px`，圆角 `8px`

3. 密码
   - 字段名: `password`
   - 输入框类型: `password`
   - 输入框占位符: "请输入密码"
   - 显示密码可见性切换图标
   - 验证规则:
     - 不能为空，提示 "请输入密码"
     - 长度至少 8 个字符，提示 "密码长度至少为 8 个字符"
     - 必须包含大写字母、小写字母、数字，提示 "密码必须包含大写字母、小写字母和数字"
   - 输入框高度 `40px`，圆角 `8px`

4. 确认密码
   - 字段名: `confirmPassword`
   - 输入框类型: `password`
   - 输入框占位符: "请再次输入密码"
   - 显示密码可见性切换图标
   - 验证规则:
     - 不能为空，提示 "请再次输入密码"
     - 必须与密码字段一致，提示 "两次输入的密码不一致"
   - 输入框高度 `40px`，圆角 `8px`

#### 2.1.4 提交按钮
- 按钮文字: "注册"
- 按钮宽度: 100%
- 按钮高度: `44px`
- 按钮颜色: `#667eea`
- 悬停颜色: `#5568d3`
- 圆角: `8px`
- 字号: `16px`，字重: `500`
- 提交前需通过所有字段验证
- 提交时按钮文字变更为 "注册中..."，按钮禁用，显示 loading 图标

#### 2.1.5 注册流程
1. 用户填写表单，前端实时验证每个字段
2. 点击注册按钮，前端再次校验所有字段
3. 调用 Supabase Auth API `signUp` 方法:
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email: email,
     password: password,
     options: {
       data: {
         username: username
       }
     }
   })
   ```
4. 成功后提示 "注册成功，请查收邮箱验证邮件"，使用 Ant Design Vue 的 `message.success`
5. 3 秒后自动跳转到登录页 `/login`
6. 失败情况处理:
   - 邮箱已被注册: 显示 "该邮箱已被注册，请直接登录"
   - 网络错误: 显示 "网络错误，请稍后重试"
   - 其他错误: 显示 "注册失败: [错误信息]"
   - 所有错误使用 `message.error` 显示，持续 3 秒

#### 2.1.6 页面底部
- 显示文字 "已有账号？"，颜色 `#666666`，字号 `14px`
- 登录链接 "立即登录"，颜色 `#667eea`，字号 `14px`，悬停时添加下划线
- 点击跳转到 `/login`

#### 2.1.7 响应式适配
- 屏幕宽度小于 `480px` 时:
  - 表单卡片宽度改为 `90%`
  - 左右内边距改为 `20px`
  - Logo 尺寸改为 `48px * 48px`
  - 标题字号改为 `20px`

---

### 2.2 用户登录

#### 2.2.1 登录方式
仅支持邮箱密码登录，不支持手机号和第三方登录。

#### 2.2.2 登录页面布局
- 页面路径: `/login`
- 页面居中显示，背景使用渐变色 `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- 表单卡片宽度固定 `400px`，白色背景，圆角 `12px`，阴影 `0 8px 24px rgba(0,0,0,0.12)`
- Logo 位于卡片顶部，尺寸 `64px * 64px`
- 标题文字 "登录 AI 旅行规划师"，字号 `24px`，字重 `600`，颜色 `#1a1a1a`

#### 2.2.3 表单字段
**必填字段（按顺序排列）:**
1. 邮箱
   - 字段名: `email`
   - 输入框占位符: "请输入邮箱地址"
   - 验证规则:
     - 不能为空，提示 "请输入邮箱地址"
     - 必须符合邮箱格式，正则: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`，提示 "请输入正确的邮箱格式"
   - 输入框高度 `40px`，圆角 `8px`

2. 密码
   - 字段名: `password`
   - 输入框类型: `password`
   - 输入框占位符: "请输入密码"
   - 显示密码可见性切换图标
   - 验证规则:
     - 不能为空，提示 "请输入密码"
   - 输入框高度 `40px`，圆角 `8px`

#### 2.2.4 提交按钮
- 按钮文字: "登录"
- 按钮宽度: 100%
- 按钮高度: `44px`
- 按钮颜色: `#667eea`
- 悬停颜色: `#5568d3`
- 圆角: `8px`
- 字号: `16px`，字重: `500`
- 提交前需通过所有字段验证
- 提交时按钮文字变更为 "登录中..."，按钮禁用，显示 loading 图标

#### 2.2.5 登录流程
1. 用户填写表单，前端实时验证每个字段
2. 点击登录按钮，前端再次校验所有字段
3. 调用 Supabase Auth API `signInWithPassword` 方法:
   ```typescript
   const { data, error } = await supabase.auth.signInWithPassword({
     email: email,
     password: password
   })
   ```
4. 成功后:
   - 将用户信息 (id, email, username) 存储到 Pinia store
   - 将 session token 存储到 localStorage，key 为 `supabase.auth.token`
   - 提示 "登录成功"，使用 `message.success`
   - 跳转到首页 `/`
5. 失败情况处理:
   - 邮箱或密码错误: 显示 "邮箱或密码错误"
   - 邮箱未验证: 显示 "请先验证邮箱后再登录"
   - 网络错误: 显示 "网络错误，请稍后重试"
   - 其他错误: 显示 "登录失败: [错误信息]"
   - 所有错误使用 `message.error` 显示，持续 3 秒

#### 2.2.6 页面底部
- 显示文字 "还没有账号？"，颜色 `#666666`，字号 `14px`
- 注册链接 "立即注册"，颜色 `#667eea`，字号 `14px`，悬停时添加下划线
- 点击跳转到 `/register`

#### 2.2.7 响应式适配
- 屏幕宽度小于 `480px` 时:
  - 表单卡片宽度改为 `90%`
  - 左右内边距改为 `20px`
  - Logo 尺寸改为 `48px * 48px`
  - 标题字号改为 `20px`

---

### 2.3 用户登出

#### 2.3.1 登出入口
在应用顶部导航栏右侧显示用户头像和用户名下拉菜单:
- 头像为圆形，直径 `32px`，背景色 `#667eea`
- 头像内显示用户名首字母，白色，字号 `14px`，字重 `600`
- 用户名显示在头像右侧，颜色 `#1a1a1a`，字号 `14px`
- 点击后展开下拉菜单，包含选项:
  - "个人中心" (暂不实现功能，仅显示占位)
  - "退出登录" (红色文字 `#ff4d4f`)

#### 2.3.2 登出流程
1. 用户点击下拉菜单中的 "退出登录"
2. 弹出确认对话框:
   - 标题: "提示"
   - 内容: "确定要退出登录吗？"
   - 取消按钮: "取消"
   - 确认按钮: "确定"，红色
3. 用户点击确定后:
   - 调用 Supabase Auth API `signOut` 方法
   - 清除 Pinia store 中的用户信息
   - 清除 localStorage 中的 `supabase.auth.token`
   - 提示 "已退出登录"，使用 `message.success`
   - 跳转到登录页 `/login`
4. 失败情况:
   - 网络错误: 显示 "网络错误，请稍后重试"
   - 其他错误: 显示 "退出失败: [错误信息]"
   - 使用 `message.error` 显示，持续 3 秒

---

### 2.4 登录状态管理

#### 2.4.1 Pinia Store 结构
创建 `src/stores/user.ts`，包含以下状态和方法:

**State:**
```typescript
{
  id: string | null,              // 用户 ID
  email: string | null,           // 用户邮箱
  username: string | null,        // 用户名
  isLoggedIn: boolean,            // 登录状态
}
```

**Actions:**
- `setUser(user: { id: string, email: string, username: string })`: 设置用户信息
- `clearUser()`: 清除用户信息
- `checkAuth()`: 检查登录状态

#### 2.4.2 路由守卫
在 `src/router/index.ts` 中配置全局前置守卫:
1. 白名单路由（无需登录）: `/login`, `/register`
2. 其他所有路由需要登录
3. 未登录用户访问非白名单路由时，跳转到 `/login`，并提示 "请先登录"
4. 已登录用户访问 `/login` 或 `/register` 时，跳转到 `/`

#### 2.4.3 Token 自动刷新
在应用初始化时 (`App.vue` mounted):
1. 调用 Supabase `auth.getSession()` 获取当前 session
2. 如果存在有效 session，自动恢复登录状态
3. 监听 Supabase `auth.onAuthStateChange` 事件:
   - `SIGNED_IN`: 更新 store 中的用户信息
   - `SIGNED_OUT`: 清除 store 中的用户信息
   - `TOKEN_REFRESHED`: 无需操作，Supabase 自动处理

---

### 2.5 数据库设计

#### 2.5.1 用户扩展表 `user_profiles`
补充 Supabase Auth 默认用户表，存储额外的用户信息。

**表结构:**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | uuid | PRIMARY KEY | 关联 auth.users.id |
| username | text | NOT NULL, UNIQUE | 用户名 |
| avatar_url | text | NULLABLE | 头像 URL (预留) |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 创建时间 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新时间 |

**RLS 策略:**
- 用户只能查看和编辑自己的记录
- 启用 RLS: `ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;`
- SELECT 策略: `auth.uid() = id`
- UPDATE 策略: `auth.uid() = id`
- INSERT 策略: `auth.uid() = id`

**触发器:**
创建触发器，在 `auth.users` 新增用户时自动在 `user_profiles` 创建记录:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 功能模块二：智能行程规划

### 2.6 行程规划主页

#### 2.6.1 页面布局
- 页面路径: `/`
- 页面分为三部分:
  1. 顶部导航栏 (固定，高度 `64px`)
  2. 左侧行程列表 (宽度 `320px`，可折叠)
  3. 右侧内容区 (自适应宽度)

#### 2.6.2 顶部导航栏
**布局:**
- 高度 `64px`，白色背景，底部边框 `1px solid #e8e8e8`
- 左侧: Logo (尺寸 `32px * 32px`) + 标题 "AI 旅行规划师" (字号 `18px`，字重 `600`)
- 中间: 导航链接
  - "我的行程" (路径 `/`)
  - "创建行程" (路径 `/create`)
- 右侧: 用户头像下拉菜单 (见 2.3.1)

**响应式:**
- 屏幕宽度小于 `768px` 时，隐藏导航链接，显示汉堡菜单图标

---

### 2.7 创建行程

#### 2.7.1 页面入口
- 导航栏 "创建行程" 链接
- 行程列表顶部 "创建新行程" 按钮

#### 2.7.2 页面路径
`/create`

#### 2.7.3 页面布局
页面居中显示，最大宽度 `800px`，白色背景，圆角 `12px`，阴影 `0 2px 8px rgba(0,0,0,0.08)`，内边距 `32px`。

**页面标题:**
- 文字 "创建新行程"，字号 `28px`，字重 `600`，颜色 `#1a1a1a`
- 副标题 "告诉 AI 你的旅行需求，让我们为你规划完美行程"，字号 `14px`，颜色 `#666666`

#### 2.7.4 输入方式切换
在标题下方显示两个 Tab:
- "语音输入" (默认选中)
- "文字输入"

**交互:**
- Tab 切换时切换下方的输入区域
- 选中的 Tab 显示蓝色底部边框 `2px solid #667eea`，文字颜色 `#667eea`
- 未选中的 Tab 文字颜色 `#666666`

---

#### 2.7.5 语音输入模式

**布局:**
- 居中显示一个大的麦克风图标按钮
- 按钮尺寸 `120px * 120px`，圆形
- 未录音状态: 背景色 `#667eea`，图标颜色白色
- 录音状态: 背景色 `#ff4d4f`，图标颜色白色，并添加呼吸动画效果
- 按钮下方显示提示文字:
  - 未录音: "点击开始语音输入"，字号 `16px`，颜色 `#666666`
  - 录音中: "正在录音中，再次点击结束..."，字号 `16px`，颜色 `#ff4d4f`
  - 识别中: "正在识别中，请稍候..."，字号 `16px`，颜色 `#1890ff`

**语音录制流程:**
1. 用户点击麦克风按钮开始录音
2. 浏览器请求麦克风权限
   - 用户拒绝: 提示 "需要麦克风权限才能使用语音输入"，使用 `message.error`
3. 开始录音，按钮变为录音状态，提示文字变为 "正在录音中..."
4. 用户再次点击按钮停止录音
5. 调用阿里云百炼语音识别 API:
   - API 端点: 使用阿里云百炼语音识别服务
   - 音频格式: `wav`，采样率 `16000Hz`，单声道
   - 请求超时: 30 秒
6. 识别成功:
   - 将识别的文字填充到下方的文本预览区
   - 提示 "语音识别成功"，使用 `message.success`
7. 识别失败:
   - 提示 "语音识别失败，请重试"，使用 `message.error`
   - 按钮恢复到初始状态

**文本预览区:**
- 位于麦克风按钮下方
- 显示识别出的文字内容
- 背景色 `#f5f5f5`，圆角 `8px`，内边距 `16px`
- 字号 `14px`，行高 `1.6`，颜色 `#1a1a1a`
- 右上角显示 "重新录音" 链接，颜色 `#667eea`，点击后清空文本并恢复到初始状态
- 用户可以手动编辑识别的文字

**技术实现:**
- 使用浏览器 `MediaRecorder` API 录音
- 录音格式: `audio/webm`
- 录音完成后转换为 `wav` 格式再上传
- 调用阿里云百炼语音识别 API，接口地址和密钥从环境变量读取:
  - `VITE_BAILIAN_API_KEY`
  - `VITE_BAILIAN_ASR_ENDPOINT`

---

#### 2.7.6 文字输入模式

**布局:**
- 显示一个大的多行文本框
- 文本框高度 `240px`，宽度 100%
- 占位符文字: "请描述你的旅行需求，例如：我想去日本旅行 5 天，预算 1 万元，喜欢美食和动漫，带孩子，希望行程轻松一些"
- 字号 `14px`，行高 `1.6`
- 边框颜色 `#d9d9d9`，聚焦时边框颜色 `#667eea`
- 圆角 `8px`，内边距 `12px`

**字数统计:**
- 文本框右下角显示字数统计: "0/500"，字号 `12px`，颜色 `#999999`
- 最大输入 500 个字符
- 超出限制时，字数显示为红色 `#ff4d4f`

---

#### 2.7.7 需求参数补充（可选）

在输入区域下方显示折叠面板 "补充详细信息（可选）"，默认折叠。

**面板内容（从上到下）:**
1. 旅行目的地
   - 输入框占位符: "例如：日本东京"
   - 宽度 100%，高度 `40px`

2. 旅行天数
   - 数字输入框，占位符: "例如：5"
   - 右侧显示单位 "天"
   - 最小值 1，最大值 30
   - 宽度 `200px`，高度 `40px`

3. 预算范围
   - 数字输入框，占位符: "例如：10000"
   - 右侧显示单位 "元"
   - 最小值 0
   - 宽度 `200px`，高度 `40px`

4. 同行人数
   - 数字输入框，占位符: "例如：2"
   - 右侧显示单位 "人"
   - 最小值 1，最大值 20
   - 宽度 `200px`，高度 `40px`

5. 旅行偏好
   - 多选框组，每行显示 4 个选项
   - 选项列表:
     - "美食"、"景点"、"购物"、"文化"
     - "自然"、"历史"、"艺术"、"运动"
     - "亲子"、"休闲"、"冒险"、"摄影"
   - 选中的选项显示蓝色背景 `#e6f7ff`，边框 `1px solid #91d5ff`

6. 出发日期
   - 日期选择器，占位符: "请选择出发日期"
   - 不能选择今天之前的日期
   - 宽度 `200px`，高度 `40px`

**说明文字:**
在面板顶部显示: "如果已在上方描述中包含这些信息，可以跳过此部分"，字号 `12px`，颜色 `#999999`。

---

#### 2.7.8 生成行程按钮

**位置:**
在输入区域下方，居中显示。

**样式:**
- 按钮文字: "生成行程"
- 按钮宽度: `200px`
- 按钮高度: `48px`
- 按钮颜色: `#667eea`
- 悬停颜色: `#5568d3`
- 圆角: `24px`
- 字号: `16px`，字重 `600`
- 右侧显示魔法棒图标

**禁用状态:**
- 语音输入模式下，文本预览区为空时禁用
- 文字输入模式下，文本框为空时禁用
- 禁用时按钮颜色 `#d9d9d9`，鼠标指针为 `not-allowed`

**生成中状态:**
- 按钮文字变为 "AI 正在规划中..."
- 按钮禁用
- 显示 loading 图标

---

#### 2.7.9 行程生成流程

**第一步: 提取需求参数**
1. 收集用户输入的文字内容
2. 收集用户填写的补充参数（如果有）
3. 将所有信息组合成一个完整的需求描述

**第二步: 调用 AI 生成行程**
1. 调用阿里云百炼大模型 API，接口地址和密钥从环境变量读取:
   - `VITE_BAILIAN_API_KEY`
   - `VITE_BAILIAN_LLM_ENDPOINT`
   - `VITE_BAILIAN_MODEL_NAME` (模型名称，如 `qwen-max`)

2. Prompt 模板:
```
你是一个专业的旅行规划师。请根据用户的需求生成一份详细的旅行行程方案。

用户需求：
{用户输入的完整需求描述}

请按照以下 JSON 格式返回行程数据，不要返回其他任何内容：
{
  "title": "行程标题",
  "destination": "目的地",
  "days": 行程天数（数字）,
  "budget": 预算金额（数字，单位元）,
  "travelers": 同行人数（数字）,
  "preferences": ["偏好1", "偏好2"],
  "start_date": "出发日期（YYYY-MM-DD 格式）",
  "summary": "行程总体概述（100字以内）",
  "daily_plans": [
    {
      "day": 1,
      "title": "第一天标题",
      "activities": [
        {
          "time": "09:00",
          "title": "活动标题",
          "location": "具体地点",
          "address": "详细地址",
          "duration": "活动时长（分钟）",
          "description": "活动描述",
          "estimated_cost": 预计花费（数字）,
          "tips": "温馨提示"
        }
      ]
    }
  ],
  "accommodation": [
    {
      "day": 1,
      "hotel_name": "酒店名称",
      "address": "酒店地址",
      "price_range": "价格区间",
      "rating": "评分",
      "reason": "推荐理由"
    }
  ],
  "transportation": {
    "overview": "交通方式概述",
    "details": [
      {
        "type": "交通类型（飞机/火车/地铁/公交）",
        "route": "路线描述",
        "estimated_cost": 预计花费（数字）
      }
    ]
  },
  "budget_breakdown": {
    "transportation": 交通费用总计（数字）,
    "accommodation": 住宿费用总计（数字）,
    "food": 餐饮费用总计（数字）,
    "activities": 活动费用总计（数字）,
    "shopping": 购物费用总计（数字）,
    "other": 其他费用总计（数字）,
    "total": 总计（数字）
  }
}

要求：
1. 行程安排要合理，避免时间过于紧凑或松散
2. 活动之间的时间衔接要考虑交通时间
3. 每个活动都要有具体的地点和地址
4. 费用预估要合理，符合当地消费水平
5. 根据用户偏好选择合适的景点和活动
6. 如果带孩子，要选择亲子友好的场所
7. 必须严格按照上述 JSON 格式返回，不要添加任何额外的文字说明
```

3. API 请求参数:
   - `temperature`: 0.7
   - `top_p`: 0.9
   - `max_tokens`: 4000

**第三步: 解析和存储行程**
1. 解析 AI 返回的 JSON 数据
2. 数据验证:
   - 检查必填字段是否存在
   - 检查数据类型是否正确
   - 如果验证失败，提示 "生成失败，请重试"
3. 保存到 Supabase 数据库 `travel_plans` 表
4. 保存成功后，跳转到行程详情页 `/plan/{id}`

**错误处理:**
- AI 调用超时（60 秒）: 提示 "生成超时，请重试"
- AI 返回格式错误: 提示 "生成失败，请重试"
- 网络错误: 提示 "网络错误，请稍后重试"
- 其他错误: 提示 "生成失败: [错误信息]"
- 所有错误使用 `message.error` 显示，持续 5 秒

---

### 2.8 行程列表

#### 2.8.1 位置
首页 `/` 左侧，宽度 `320px`。

#### 2.8.2 布局
**顶部:**
- 标题 "我的行程"，字号 `18px`，字重 `600`
- "创建新行程" 按钮，宽度 100%，高度 `40px`，颜色 `#667eea`

**列表区域:**
- 显示当前用户的所有行程
- 按创建时间倒序排列（最新的在最上面）
- 每页显示 20 条，支持下拉加载更多
- 如果没有行程，显示空状态:
  - 灰色图标
  - 文字 "还没有行程，点击上方按钮创建"，字号 `14px`，颜色 `#999999`

#### 2.8.3 行程卡片
每个行程显示为一个卡片，包含以下信息:
- 行程标题，字号 `16px`，字重 `600`，颜色 `#1a1a1a`，最多显示两行，超出显示省略号
- 目的地和天数: "日本东京 · 5天"，字号 `14px`，颜色 `#666666`
- 出发日期: "2025-12-01 出发"，字号 `12px`，颜色 `#999999`
- 预算: "¥10,000"，字号 `14px`，颜色 `#ff4d4f`
- 创建时间: "3天前创建"，字号 `12px`，颜色 `#999999`

**交互:**
- 点击卡片跳转到行程详情页
- 鼠标悬停时，卡片背景色变为 `#f5f5f5`，添加左侧蓝色边框 `3px solid #667eea`
- 当前查看的行程卡片显示选中状态: 背景色 `#e6f7ff`，左侧边框 `3px solid #667eea`

**右键菜单:**
- 右键点击卡片显示菜单:
  - "查看详情"
  - "编辑行程"（暂不实现，显示 "即将开放"）
  - "删除行程"（红色文字）

#### 2.8.4 删除行程
1. 用户点击右键菜单的 "删除行程"
2. 弹出确认对话框:
   - 标题: "删除行程"
   - 内容: "确定要删除「{行程标题}」吗？删除后无法恢复。"
   - 取消按钮: "取消"
   - 确认按钮: "删除"，红色
3. 用户点击确定后:
   - 从 Supabase 数据库删除对应记录（同时级联删除相关的费用记录）
   - 从列表中移除该卡片
   - 提示 "已删除行程"，使用 `message.success`
   - 如果当前正在查看该行程，跳转到首页并清空右侧内容区

#### 2.8.5 折叠功能
- 左侧列表顶部右上角显示折叠图标按钮
- 点击后折叠列表，仅显示宽度 `48px` 的图标栏
- 再次点击展开列表
- 折叠状态下，仅显示 "创建新行程" 图标按钮
- 屏幕宽度小于 `768px` 时，默认折叠

---

### 2.9 行程详情页

#### 2.9.1 页面路径
`/plan/:id`

#### 2.9.2 数据加载
1. 根据 URL 参数 `id` 从 Supabase 数据库加载行程数据
2. 如果行程不存在或不属于当前用户，显示 404 页面
3. 加载时显示骨架屏占位

#### 2.9.3 页面布局
页面分为三个区域:
1. 顶部行程概览区（背景色 `#fafafa`）
2. 中间 Tab 导航
3. 底部内容区（根据选中的 Tab 显示不同内容）

---

#### 2.9.4 行程概览区

**布局:**
- 高度自适应，最小高度 `200px`
- 背景色 `#fafafa`，内边距 `32px`

**左侧信息:**
- 行程标题，字号 `32px`，字重 `700`，颜色 `#1a1a1a`
- 行程概述，字号 `14px`，颜色 `#666666`，最多显示 3 行

**右侧信息（网格布局，2列）:**
1. 目的地
   - 图标: 位置图标
   - 标签: "目的地"，字号 `12px`，颜色 `#999999`
   - 内容: 目的地名称，字号 `16px`，颜色 `#1a1a1a`

2. 行程天数
   - 图标: 日历图标
   - 标签: "行程"，字号 `12px`，颜色 `#999999`
   - 内容: "X 天"，字号 `16px`，颜色 `#1a1a1a`

3. 出发日期
   - 图标: 日期图标
   - 标签: "出发"，字号 `12px`，颜色 `#999999`
   - 内容: 日期（格式 "2025-12-01"），字号 `16px`，颜色 `#1a1a1a`

4. 预算
   - 图标: 钱包图标
   - 标签: "预算"，字号 `12px`，颜色 `#999999`
   - 内容: "¥ X,XXX"，字号 `16px`，颜色 `#ff4d4f`，字重 `600`

5. 同行人数
   - 图标: 用户组图标
   - 标签: "同行"，字号 `12px`，颜色 `#999999`
   - 内容: "X 人"，字号 `16px`，颜色 `#1a1a1a`

6. 旅行偏好
   - 图标: 标签图标
   - 标签: "偏好"，字号 `12px`，颜色 `#999999`
   - 内容: 偏好标签（多个标签用逗号分隔），字号 `14px`，颜色 `#1a1a1a`

---

#### 2.9.5 Tab 导航

**位置:**
在概览区下方，白色背景，底部边框 `1px solid #e8e8e8`。

**Tab 列表:**
1. "每日行程"（默认）
2. "住宿安排"
3. "交通信息"
4. "费用预算"

**样式:**
- Tab 高度 `48px`
- 选中的 Tab 显示蓝色底部边框 `2px solid #667eea`，文字颜色 `#667eea`，字重 `600`
- 未选中的 Tab 文字颜色 `#666666`
- 字号 `16px`

---

#### 2.9.6 每日行程 Tab

**布局:**
- 左侧显示日期列表（侧边栏），宽度 `160px`
- 右侧显示选中日期的详细活动安排

**日期列表:**
- 每个日期显示为一个项目:
  - "第 X 天"，字号 `16px`，字重 `600`
  - 日期标题，字号 `14px`，颜色 `#666666`
  - 活动数量: "X 个活动"，字号 `12px`，颜色 `#999999`
- 选中的日期显示蓝色背景 `#e6f7ff`
- 点击切换右侧内容

**活动列表:**
采用时间轴样式展示:
- 左侧: 时间点和垂直时间线
- 右侧: 活动卡片

**活动卡片（从上到下）:**
1. 时间: "09:00"，字号 `14px`，字重 `600`，颜色 `#667eea`
2. 活动标题，字号 `18px`，字重 `600`，颜色 `#1a1a1a`
3. 地点和地址:
   - 图标: 位置图标
   - 地点名称，字号 `14px`，颜色 `#1a1a1a`
   - 详细地址，字号 `12px`，颜色 `#999999`
   - 右侧显示 "导航" 按钮，颜色 `#667eea`，点击后调用高德地图导航
4. 时长和费用（横向排列）:
   - 图标: 时钟图标 + "X 分钟"
   - 图标: 金钱图标 + "¥ XXX"
   - 字号 `14px`，颜色 `#666666`
5. 活动描述，字号 `14px`，行高 `1.6`，颜色 `#666666`
6. 温馨提示（如果有）:
   - 背景色 `#fff7e6`，边框 `1px solid #ffd591`，圆角 `4px`，内边距 `8px 12px`
   - 图标: 提示图标，颜色 `#fa8c16`
   - 文字字号 `12px`，颜色 `#d46b08`

**活动之间:**
- 显示虚线分隔

**底部:**
- 显示当日预计总花费: "当日预计花费: ¥ XXX"，字号 `16px`，颜色 `#ff4d4f`，字重 `600`

---

#### 2.9.7 导航功能

**触发方式:**
用户点击活动卡片中的 "导航" 按钮。

**实现方式:**
1. 调用高德地图 API 获取活动地点的经纬度坐标:
   - API: 高德地图地理编码 API
   - 输入: 活动地址
   - 输出: 经纬度坐标
2. 如果是移动设备（屏幕宽度 < 768px），直接跳转到高德地图 App:
   ```
   https://uri.amap.com/navigation?to={经度},{纬度},{地点名称}&mode=walk&coordinate=gaode
   ```
3. 如果是桌面设备，在页面中显示弹窗，嵌入高德地图 Web 组件:
   - 弹窗尺寸: 宽度 `800px`，高度 `600px`
   - 标题: "导航到 {地点名称}"
   - 地图显示目标地点标记
   - 底部显示 "在高德地图中打开" 链接

**错误处理:**
- 地址解析失败: 提示 "无法解析地址，请手动导航"
- 网络错误: 提示 "网络错误，请稍后重试"

---

#### 2.9.8 住宿安排 Tab

**布局:**
显示每天的住宿推荐，采用卡片式布局。

**住宿卡片（从上到下）:**
1. 标题: "第 X 天住宿"，字号 `18px`，字重 `600`，颜色 `#1a1a1a`
2. 酒店名称，字号 `16px`，字重 `600`，颜色 `#1a1a1a`
3. 地址:
   - 图标: 位置图标
   - 详细地址，字号 `14px`，颜色 `#666666`
   - 右侧显示 "查看地图" 按钮，点击后在地图中显示酒店位置
4. 价格区间和评分（横向排列）:
   - 价格区间: "¥ 500-800/晚"，字号 `16px`，颜色 `#ff4d4f`，字重 `600`
   - 评分: "⭐ 4.5"，字号 `14px`，颜色 `#faad14`
5. 推荐理由:
   - 背景色 `#f0f5ff`，边框 `1px solid #adc6ff`，圆角 `4px`，内边距 `12px`
   - 文字字号 `14px`，行高 `1.6`，颜色 `#1a1a1a`

**卡片之间:**
- 间距 `16px`

---

#### 2.9.9 交通信息 Tab

**布局:**
分为两部分:
1. 交通概述
2. 详细交通方案

**交通概述:**
- 背景色 `#f5f5f5`，圆角 `8px`，内边距 `16px`
- 标题: "交通概述"，字号 `18px`，字重 `600`
- 内容: 交通方式总体说明，字号 `14px`，行高 `1.6`，颜色 `#666666`

**详细交通方案:**
每个交通方式显示为一个卡片:
1. 交通类型标签:
   - "飞机"、"火车"、"地铁"、"公交" 等
   - 背景色根据类型不同:
     - 飞机: `#e6f7ff`，文字 `#1890ff`
     - 火车: `#f6ffed`，文字 `#52c41a`
     - 地铁: `#fff7e6`，文字 `#fa8c16`
     - 公交: `#fff1f0`，文字 `#f5222d`
   - 圆角 `4px`，内边距 `4px 12px`，字号 `12px`
2. 路线描述，字号 `14px`，颜色 `#1a1a1a`
3. 预计费用: "¥ XXX"，字号 `16px`，颜色 `#ff4d4f`，字重 `600`

**底部:**
- 显示交通费用总计: "交通费用总计: ¥ XXX"，字号 `18px`，颜色 `#ff4d4f`，字重 `600`

---

#### 2.9.10 费用预算 Tab

**布局:**
分为两部分:
1. 预算总览
2. 费用明细

**预算总览:**
- 居中显示大的圆形进度图:
  - 显示总预算和已规划费用
  - 圆环颜色:
    - 已规划费用占比 < 80%: 蓝色 `#1890ff`
    - 已规划费用占比 80%-100%: 橙色 `#fa8c16`
    - 已规划费用占比 > 100%: 红色 `#ff4d4f`
  - 中心显示:
    - 已规划费用，字号 `32px`，字重 `700`
    - 占总预算百分比，字号 `16px`
- 进度图下方显示:
  - "总预算: ¥ X,XXX"，字号 `18px`
  - "剩余预算: ¥ X,XXX"，字号 `18px`（如果超预算则显示 "超出预算: ¥ X,XXX"，红色）

**费用明细:**
采用条形图展示各项费用占比:
- 交通费用
- 住宿费用
- 餐饮费用
- 活动费用
- 购物费用
- 其他费用

**每个条形图项:**
- 左侧: 费用类型图标 + 名称，字号 `14px`
- 中间: 条形进度条，高度 `20px`，圆角 `10px`
  - 不同类型使用不同颜色
  - 显示占比
- 右侧: 具体金额 "¥ X,XXX"，字号 `14px`，字重 `600`

**底部:**
- 显示 "添加支出记录" 按钮，宽度 100%，高度 `40px`，颜色 `#667eea`

---

### 2.10 数据库设计 - 行程相关

#### 2.10.1 行程表 `travel_plans`

**表结构:**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | 行程 ID |
| user_id | uuid | NOT NULL, FOREIGN KEY -> auth.users(id) | 用户 ID |
| title | text | NOT NULL | 行程标题 |
| destination | text | NOT NULL | 目的地 |
| days | integer | NOT NULL | 行程天数 |
| budget | numeric(10,2) | NOT NULL | 预算金额 |
| travelers | integer | NOT NULL | 同行人数 |
| preferences | text[] | NOT NULL | 旅行偏好（数组） |
| start_date | date | NOT NULL | 出发日期 |
| summary | text | NOT NULL | 行程概述 |
| ai_response | jsonb | NOT NULL | AI 返回的完整数据 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 创建时间 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新时间 |

**索引:**
- `user_id` 上创建索引
- `created_at` 上创建索引（倒序）

**RLS 策略:**
- 用户只能查看、创建和删除自己的记录
- SELECT 策略: `auth.uid() = user_id`
- INSERT 策略: `auth.uid() = user_id`
- DELETE 策略: `auth.uid() = user_id`

---

## 功能模块三：费用预算与管理

### 2.11 添加支出记录

#### 2.11.1 入口
行程详情页 "费用预算" Tab 底部的 "添加支出记录" 按钮。

#### 2.11.2 弹窗布局
- 弹窗标题: "添加支出记录"
- 弹窗宽度: `500px`
- 支持两种输入方式: 语音输入（默认）、手动输入

---

#### 2.11.3 语音输入方式

**布局:**
- 显示麦克风图标按钮（样式同 2.7.5）
- 按钮下方显示提示: "说出你的花费，例如：午餐花了 150 元"

**语音识别流程:**
1. 用户点击麦克风开始录音（流程同 2.7.5）
2. 录音结束后调用阿里云百炼语音识别 API
3. 识别成功后，显示识别的文字
4. 调用阿里云百炼大模型提取结构化信息:
   - Prompt: 
   ```
   从以下文字中提取支出信息，返回 JSON 格式：
   {
     "category": "分类（交通/住宿/餐饮/活动/购物/其他）",
     "amount": 金额（数字）,
     "description": "描述"
   }
   
   文字内容：{识别的文字}
   ```
5. 解析 AI 返回的数据，自动填充到下方的表单
6. 用户可以修改自动填充的内容

---

#### 2.11.4 手动输入方式

**表单字段（从上到下）:**
1. 支出分类
   - 下拉选择框
   - 选项: "交通"、"住宿"、"餐饮"、"活动"、"购物"、"其他"
   - 必填，验证: 不能为空，提示 "请选择支出分类"

2. 支出金额
   - 数字输入框
   - 占位符: "请输入金额"
   - 前缀显示 "¥"
   - 必填，验证:
     - 不能为空，提示 "请输入金额"
     - 必须大于 0，提示 "金额必须大于 0"
     - 最多保留 2 位小数

3. 支出描述
   - 多行文本框，高度 `80px`
   - 占位符: "请描述这笔支出的详情"
   - 选填
   - 最多 200 个字符

4. 支出日期
   - 日期选择器
   - 默认选择今天
   - 不能选择早于行程出发日期的日期
   - 不能选择晚于行程结束日期的日期
   - 必填

5. 支出时间
   - 时间选择器
   - 默认选择当前时间
   - 必填

---

#### 2.11.5 提交按钮

**布局:**
弹窗底部显示两个按钮:
- "取消" 按钮，左侧，宽度 `100px`，高度 `36px`，白色背景，灰色边框
- "保存" 按钮，右侧，宽度 `100px`，高度 `36px`，蓝色背景 `#667eea`

**保存流程:**
1. 点击保存按钮，前端校验所有字段
2. 校验通过后，保存到 Supabase 数据库 `expenses` 表
3. 保存成功:
   - 关闭弹窗
   - 刷新费用预算 Tab 的数据
   - 提示 "支出记录已添加"，使用 `message.success`
4. 保存失败:
   - 提示 "保存失败，请重试"，使用 `message.error`

---

### 2.12 支出记录列表

#### 2.12.1 位置
在费用预算 Tab 的费用明细下方显示。

#### 2.12.2 列表标题
"支出记录"，字号 `18px`，字重 `600`。

#### 2.12.3 列表内容
采用表格形式展示:

**表格列（从左到右）:**
1. 日期时间
   - 宽度 `180px`
   - 格式: "2025-12-01 12:30"
   - 字号 `14px`，颜色 `#666666`

2. 分类
   - 宽度 `100px`
   - 显示为带颜色的标签:
     - 交通: 蓝色
     - 住宿: 绿色
     - 餐饮: 橙色
     - 活动: 紫色
     - 购物: 粉色
     - 其他: 灰色
   - 字号 `12px`

3. 描述
   - 宽度自适应
   - 字号 `14px`，颜色 `#1a1a1a`
   - 最多显示一行，超出显示省略号

4. 金额
   - 宽度 `120px`，右对齐
   - 格式: "¥ XXX.XX"
   - 字号 `16px`，颜色 `#ff4d4f`，字重 `600`

5. 操作
   - 宽度 `80px`
   - 显示 "删除" 按钮，红色文字

**列表排序:**
- 按日期时间倒序排列（最新的在最上面）

**空状态:**
- 如果没有支出记录，显示 "暂无支出记录"，字号 `14px`，颜色 `#999999`

---

#### 2.12.4 删除支出记录

**流程:**
1. 用户点击表格中的 "删除" 按钮
2. 弹出确认对话框:
   - 标题: "删除支出记录"
   - 内容: "确定要删除这条支出记录吗？"
   - 取消按钮: "取消"
   - 确认按钮: "删除"，红色
3. 用户点击确定后:
   - 从 Supabase 数据库删除对应记录
   - 刷新支出记录列表
   - 刷新费用预算统计数据
   - 提示 "已删除支出记录"，使用 `message.success`

---

### 2.13 数据库设计 - 费用相关

#### 2.13.1 支出记录表 `expenses`

**表结构:**
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | 记录 ID |
| plan_id | uuid | NOT NULL, FOREIGN KEY -> travel_plans(id) ON DELETE CASCADE | 行程 ID |
| user_id | uuid | NOT NULL, FOREIGN KEY -> auth.users(id) | 用户 ID |
| category | text | NOT NULL | 支出分类 |
| amount | numeric(10,2) | NOT NULL | 支出金额 |
| description | text | NULLABLE | 支出描述 |
| expense_date | date | NOT NULL | 支出日期 |
| expense_time | time | NOT NULL | 支出时间 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 创建时间 |

**索引:**
- `plan_id` 上创建索引
- `user_id` 上创建索引
- `expense_date` 上创建索引（倒序）

**RLS 策略:**
- 用户只能查看、创建和删除自己的记录
- SELECT 策略: `auth.uid() = user_id`
- INSERT 策略: `auth.uid() = user_id`
- DELETE 策略: `auth.uid() = user_id`

**约束:**
- `category` 的值必须是: "交通"、"住宿"、"餐饮"、"活动"、"购物"、"其他" 之一
  ```sql
  ALTER TABLE expenses ADD CONSTRAINT expenses_category_check 
  CHECK (category IN ('交通', '住宿', '餐饮', '活动', '购物', '其他'));
  ```

---

## 三、非功能性需求

### 3.1 性能要求

#### 3.1.1 页面加载
- 首屏加载时间 < 2 秒
- 路由切换响应时间 < 300ms
- 图片懒加载，可见区域才加载

#### 3.1.2 AI 响应
- 语音识别响应时间 < 5 秒
- 行程生成时间 < 60 秒（超时后提示重试）
- 支出信息提取时间 < 3 秒

#### 3.1.3 数据库查询
- 行程列表查询 < 500ms
- 行程详情查询 < 800ms
- 支出记录查询 < 300ms

---

### 3.2 兼容性要求

#### 3.2.1 浏览器兼容
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- 不支持 IE 浏览器

#### 3.2.2 设备兼容
- 桌面端: 最小屏幕宽度 1280px
- 平板端: 768px - 1279px
- 移动端: 375px - 767px

#### 3.2.3 语音功能兼容
- 需浏览器支持 `MediaRecorder` API
- 需用户授予麦克风权限
- 不支持的浏览器自动隐藏语音输入选项，仅显示文字输入

---

### 3.3 安全要求

#### 3.3.1 身份认证
- 使用 Supabase Auth 提供的 JWT token 认证
- Token 过期时间: 7 天
- 自动刷新 token 机制

#### 3.3.2 数据权限
- 所有数据表启用 RLS（Row Level Security）
- 用户只能访问自己的数据
- 数据库层面强制权限校验

#### 3.3.3 API 密钥
- 所有第三方 API 密钥存储在环境变量中
- 不在前端代码中硬编码密钥
- 敏感请求通过 Supabase Edge Functions 代理

#### 3.3.4 输入验证
- 前端所有表单输入进行验证
- 后端数据库层面添加约束验证
- 防止 XSS 攻击: 用户输入内容进行转义

---

### 3.4 用户体验要求

#### 3.4.1 加载状态
- 所有异步操作显示 loading 状态
- 长时间操作（> 3 秒）显示进度提示
- 数据加载失败显示重试按钮

#### 3.4.2 错误提示
- 所有错误提示用户友好，避免技术术语
- 错误提示显示时长: 3-5 秒
- 严重错误（如网络断开）显示全局提示

#### 3.4.3 空状态
- 所有列表为空时显示友好的空状态插画和提示文字
- 空状态提供引导操作入口

#### 3.4.4 响应式设计
- 移动端适配: 导航栏折叠、表格转为卡片、弹窗全屏显示
- 平板端适配: 侧边栏可折叠、内容区自适应
- 桌面端: 充分利用宽屏空间

---

### 3.5 可维护性要求

#### 3.5.1 代码规范
- 遵循 Vue 3 组合式 API 规范
- 遵循 TypeScript 严格模式
- 使用 ESLint 进行代码检查
- 组件、函数、变量命名规范一致

#### 3.5.2 组件化
- 公共组件提取到 `src/components/common/`
- 业务组件按功能模块组织
- 组件职责单一，便于复用和测试

#### 3.5.3 状态管理
- 全局状态使用 Pinia store
- Store 按功能模块拆分（user、plan、expense）
- 避免在组件中直接操作 store state

#### 3.5.4 API 封装
- 所有 API 调用封装在 `src/api/` 目录
- API 模块按功能拆分（auth、plan、expense、ai、map）
- 统一错误处理和响应拦截

---

## 四、技术实现细节

### 4.1 环境变量配置

在项目根目录创建 `.env` 文件（不提交到版本控制），包含以下变量:

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

---

### 4.2 项目目录结构

```
src/
├── api/                    # API 接口封装
│   ├── auth.ts            # 认证相关 API
│   ├── plan.ts            # 行程相关 API
│   ├── expense.ts         # 支出相关 API
│   ├── ai.ts              # AI 服务 API
│   ├── map.ts             # 地图服务 API
│   └── index.ts           # API 统一导出
├── assets/                 # 静态资源
│   ├── images/            # 图片
│   ├── icons/             # 图标
│   └── styles/            # 全局样式
├── components/             # 组件
│   ├── common/            # 公共组件
│   │   ├── AppHeader.vue         # 顶部导航栏
│   │   ├── VoiceInput.vue        # 语音输入组件
│   │   ├── EmptyState.vue        # 空状态组件
│   │   └── ConfirmDialog.vue     # 确认对话框
│   ├── plan/              # 行程相关组件
│   │   ├── PlanList.vue          # 行程列表
│   │   ├── PlanCard.vue          # 行程卡片
│   │   ├── PlanOverview.vue      # 行程概览
│   │   ├── DailyPlan.vue         # 每日行程
│   │   ├── ActivityCard.vue      # 活动卡片
│   │   ├── AccommodationTab.vue  # 住宿 Tab
│   │   ├── TransportTab.vue      # 交通 Tab
│   │   └── BudgetTab.vue         # 预算 Tab
│   └── expense/           # 支出相关组件
│       ├── ExpenseForm.vue       # 支出表单
│       └── ExpenseList.vue       # 支出列表
├── composables/            # 组合式函数
│   ├── useAuth.ts         # 认证相关
│   ├── useVoice.ts        # 语音识别
│   ├── useMap.ts          # 地图服务
│   └── useAI.ts           # AI 服务
├── router/                 # 路由配置
│   └── index.ts
├── stores/                 # Pinia stores
│   ├── user.ts            # 用户状态
│   ├── plan.ts            # 行程状态
│   └── expense.ts         # 支出状态
├── types/                  # TypeScript 类型定义
│   ├── user.ts
│   ├── plan.ts
│   ├── expense.ts
│   └── api.ts
├── utils/                  # 工具函数
│   ├── format.ts          # 格式化函数
│   ├── validate.ts        # 验证函数
│   ├── date.ts            # 日期处理
│   └── supabase.ts        # Supabase 客户端
├── views/                  # 页面组件
│   ├── auth/
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   ├── plan/
│   │   ├── PlanListView.vue      # 行程列表页（首页）
│   │   ├── CreatePlanView.vue    # 创建行程页
│   │   └── PlanDetailView.vue    # 行程详情页
│   └── NotFoundView.vue   # 404 页面
├── App.vue                 # 根组件
└── main.ts                 # 入口文件
```

---

### 4.3 Supabase 数据库初始化

执行以下 SQL 脚本创建数据库表和策略:

```sql
-- 创建用户扩展表
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建行程表
CREATE TABLE IF NOT EXISTS public.travel_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  destination text NOT NULL,
  days integer NOT NULL,
  budget numeric(10,2) NOT NULL,
  travelers integer NOT NULL,
  preferences text[] NOT NULL,
  start_date date NOT NULL,
  summary text NOT NULL,
  ai_response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建支出记录表
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.travel_plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  amount numeric(10,2) NOT NULL,
  description text,
  expense_date date NOT NULL,
  expense_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT expenses_category_check CHECK (category IN ('交通', '住宿', '餐饮', '活动', '购物', '其他'))
);

-- 创建索引
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_travel_plans_user_id ON public.travel_plans(user_id);
CREATE INDEX idx_travel_plans_created_at ON public.travel_plans(created_at DESC);
CREATE INDEX idx_expenses_plan_id ON public.expenses(plan_id);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_expense_date ON public.expenses(expense_date DESC);

-- 启用 RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- user_profiles RLS 策略
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- travel_plans RLS 策略
CREATE POLICY "Users can view own plans" ON public.travel_plans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans" ON public.travel_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON public.travel_plans
  FOR DELETE USING (auth.uid() = user_id);

-- expenses RLS 策略
CREATE POLICY "Users can view own expenses" ON public.expenses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON public.expenses
  FOR DELETE USING (auth.uid() = user_id);

-- 创建触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间触发器
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.travel_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

### 4.4 依赖包安装

在现有 package.json 基础上，需要安装以下额外的依赖:

```bash
# Supabase 客户端
npm install @supabase/supabase-js

# 图表库（用于费用预算可视化）
npm install echarts vue-echarts

# 音频处理（语音录制转换）
npm install lamejs

# 工具库（已安装，确认版本）
# lodash-es - 已安装
# dayjs - 已安装
```

---

### 4.5 高德地图集成

#### 4.5.1 引入方式
在 `index.html` 中引入高德地图 JS API:
```html
<script src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY"></script>
```

#### 4.5.2 地图组件
创建 `src/components/common/MapView.vue` 组件，封装地图显示和导航功能。

#### 4.5.3 导航 URL Scheme
使用高德地图 URI API 唤起导航:
```
https://uri.amap.com/navigation?to={经度},{纬度},{地点名称}&mode=walk&coordinate=gaode
```

---

### 4.6 语音识别实现

#### 4.6.1 录音实现
使用浏览器 `MediaRecorder` API 录音:
```typescript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
const mediaRecorder = new MediaRecorder(stream)
```

#### 4.6.2 音频格式转换
录音完成后，将 `webm` 格式转换为 `wav` 格式:
- 使用 `lamejs` 库进行格式转换
- 采样率: 16000Hz
- 声道: 单声道

#### 4.6.3 调用阿里云百炼 ASR
将音频文件上传到阿里云百炼语音识别服务:
- API 文档: 参考阿里云百炼官方文档
- 请求方式: POST
- 请求头: 包含 API Key
- 请求体: 音频文件 (Base64 编码或二进制流)

---

### 4.7 AI 大模型调用

#### 4.7.1 行程生成
调用阿里云百炼大模型 API:
- 模型: `qwen-max` 或 `qwen-plus`
- 请求方式: POST
- 请求参数:
  ```json
  {
    "model": "qwen-max",
    "messages": [
      {
        "role": "user",
        "content": "Prompt 内容"
      }
    ],
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 4000
  }
  ```

#### 4.7.2 支出信息提取
使用相同的 API，但 Prompt 不同:
- 模型: `qwen-turbo` (更快速)
- max_tokens: 500

---

## 五、开发计划

### 5.1 开发阶段划分

**第一阶段: 用户管理（2 天）**
- 注册登录页面
- Pinia store 和路由守卫
- Supabase Auth 集成

**第二阶段: 行程规划（5 天）**
- 创建行程页面（语音/文字输入）
- 行程列表页面
- 行程详情页面（四个 Tab）
- 地图导航功能
- AI 行程生成

**第三阶段: 费用管理（3 天）**
- 支出记录添加（语音/手动）
- 支出记录列表
- 费用预算可视化

**第四阶段: 优化和测试（2 天）**
- 响应式适配
- 错误处理优化
- 性能优化
- 功能测试

**总计: 12 个工作日**

---

### 5.2 开发优先级

**P0（必须实现）:**
- 用户注册登录
- 文字输入创建行程
- AI 行程生成
- 行程列表和详情展示
- 手动添加支出记录

**P1（重要功能）:**
- 语音输入创建行程
- 语音添加支出记录
- 地图导航功能
- 费用预算可视化

**P2（锦上添花）:**
- 行程编辑（本期不实现，显示 "即将开放"）
- 行程分享（预留入口）
- 个人中心（预留入口）

---

## 六、交付物

### 6.1 代码交付
- 完整的 Vue 3 前端项目代码
- Supabase 数据库初始化 SQL 脚本
- 环境变量配置模板（`.env.example`）
- README.md（项目说明、安装部署指南）

### 6.2 文档交付
- 本 PRD 文档
- API 接口文档（Supabase、阿里云百炼、高德地图）
- 数据库设计文档（表结构、关系图）

### 6.3 部署交付
- 部署到 Vercel 或 Netlify 的生产环境
- Supabase 项目配置完成
- 所有第三方服务配置完成并可用

---

## 七、验收标准

### 7.1 功能验收
- [ ] 用户可以成功注册和登录
- [ ] 用户可以通过语音或文字输入创建行程
- [ ] AI 可以根据用户需求生成合理的旅行行程
- [ ] 用户可以查看行程列表和详情
- [ ] 用户可以查看每日行程、住宿、交通、费用四个 Tab
- [ ] 用户可以点击导航按钮跳转到高德地图
- [ ] 用户可以通过语音或手动方式添加支出记录
- [ ] 用户可以查看和删除支出记录
- [ ] 用户可以查看费用预算和实际支出对比
- [ ] 用户可以退出登录

### 7.2 性能验收
- [ ] 首屏加载时间 < 2 秒
- [ ] AI 行程生成时间 < 60 秒
- [ ] 页面交互流畅，无明显卡顿

### 7.3 兼容性验收
- [ ] Chrome 浏览器功能正常
- [ ] Safari 浏览器功能正常
- [ ] 移动端适配正常
- [ ] 不同屏幕尺寸显示正常

### 7.4 安全验收
- [ ] 用户只能访问自己的数据
- [ ] 未登录用户访问受限页面自动跳转登录
- [ ] API 密钥不暴露在前端代码中

---

## 八、风险和限制

### 8.1 技术风险
- **AI 生成质量**: AI 生成的行程可能不够合理，需多次测试和调整 Prompt
- **语音识别准确度**: 语音识别准确度受环境噪音影响，需提示用户在安静环境使用
- **第三方服务稳定性**: 依赖阿里云百炼和高德地图服务，需做好错误处理和降级方案

### 8.2 功能限制
- **不支持行程编辑**: 第一版不支持编辑已生成的行程，仅支持删除重建
- **不支持多人协作**: 行程不支持多人共同编辑
- **不支持离线使用**: 所有功能需要网络连接

### 8.3 成本风险
- **AI 调用成本**: 阿里云百炼按调用次数计费，需控制成本
- **地图服务配额**: 高德地图有每日调用次数限制，需注意配额

---

## 九、后续迭代规划

### 9.1 功能增强
- 支持行程编辑和自定义调整
- 支持行程分享（生成分享链接）
- 支持行程导出（PDF/图片）
- 支持实时天气提醒
- 支持景点点评和推荐

### 9.2 AI 能力增强
- 根据用户历史偏好优化推荐
- 支持多轮对话式行程规划
- 支持实时行程调整建议

### 9.3 社交功能
- 支持查看他人的公开行程
- 支持行程点赞和收藏
- 支持用户之间的旅行交流

---

## 附录

### A. 术语表
- **AI**: Artificial Intelligence，人工智能
- **RLS**: Row Level Security，行级安全策略
- **Supabase**: 开源的 Firebase 替代方案，提供数据库、认证、存储等服务
- **阿里云百炼**: 阿里云提供的大模型服务平台
- **高德地图**: 国内领先的地图服务提供商

### B. 参考资料
- Vue 3 官方文档: https://vuejs.org/
- Supabase 官方文档: https://supabase.com/docs
- 阿里云百炼文档: https://help.aliyun.com/zh/model-studio/
- 高德地图 Web API: https://lbs.amap.com/api/javascript-api/summary
- Ant Design Vue: https://antdv.com/

---

**文档结束**

