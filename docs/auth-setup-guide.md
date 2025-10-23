# 用户注册登录模块设置指南

## 功能概述

本模块实现了完整的用户注册和登录功能，包括：

- ✅ 邮箱密码注册
- ✅ 用户名唯一性验证
- ✅ 密码强度验证（需包含大写字母、小写字母和数字，至少 8 位）
- ✅ 邮箱格式验证
- ✅ 用户登录
- ✅ 登录状态持久化
- ✅ 路由守卫（未登录自动跳转）
- ✅ 登录状态自动恢复

## 快速开始

### 1. 配置 Supabase

#### 1.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 注册并创建新项目
3. 等待项目初始化完成

#### 1.2 初始化数据库

1. 在 Supabase 控制台，进入 SQL Editor
2. 复制 `docs/supabase-init.sql` 的内容
3. 粘贴并执行 SQL 脚本
4. 确认所有表和策略创建成功

#### 1.3 获取 API 密钥

1. 在 Supabase 控制台，进入 Settings > API
2. 复制以下信息：
   - Project URL
   - anon public key

### 2. 配置环境变量

创建 `.env` 文件（或使用终端命令创建）：

```bash
cat > .env << 'EOF'
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# 阿里云百炼（暂时可以留空）
VITE_BAILIAN_API_KEY=
VITE_BAILIAN_ASR_ENDPOINT=
VITE_BAILIAN_LLM_ENDPOINT=
VITE_BAILIAN_MODEL_NAME=qwen-max

# 高德地图（暂时可以留空）
VITE_AMAP_KEY=
VITE_AMAP_SECRET=
EOF
```

**重要**: 将上面的 `your-project` 和 `your_anon_key` 替换为实际的值。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

## 功能测试

### 测试注册流程

1. 访问 http://localhost:5173/register
2. 填写注册表单：
   - 用户名：test123（2-20个字符，支持中英文、数字、下划线）
   - 邮箱：test@example.com
   - 密码：Test123456（至少8位，包含大小写字母和数字）
   - 确认密码：Test123456
3. 点击"注册"按钮
4. 注册成功后会显示提示信息
5. 3秒后自动跳转到登录页

**注意**: 
- Supabase 默认会发送验证邮件，但在开发环境可以关闭此验证
- 若要关闭邮箱验证：Supabase 控制台 > Authentication > Settings > Email Auth > "Enable email confirmations" 取消勾选

### 测试登录流程

1. 访问 http://localhost:5173/login
2. 输入注册时使用的邮箱和密码
3. 点击"登录"按钮
4. 登录成功后自动跳转到首页

### 测试路由守卫

1. 登出后直接访问 http://localhost:5173/
2. 应该自动跳转到登录页，并显示"请先登录"提示
3. 登录后再访问首页，可以正常访问

### 测试登录状态持久化

1. 登录成功后
2. 刷新页面
3. 登录状态应该保持，不需要重新登录

## 表单验证规则

### 用户名验证

- 不能为空
- 长度 2-20 个字符
- 仅允许中英文、数字、下划线

### 邮箱验证

- 不能为空
- 必须符合邮箱格式（包含 @ 和域名）

### 密码验证

- 不能为空
- 长度至少 8 个字符
- 必须包含大写字母、小写字母和数字

### 确认密码验证

- 不能为空
- 必须与密码一致

## 常见问题

### Q1: 注册时提示"该邮箱已被注册"

**A**: 该邮箱已经在系统中注册过，请直接登录或使用其他邮箱。

### Q2: 登录时提示"邮箱或密码错误"

**A**: 请检查邮箱和密码是否正确。如果忘记密码，暂时需要重新注册（密码重置功能后续开发）。

### Q3: 注册后无法登录，提示"请先验证邮箱"

**A**: 这是因为 Supabase 启用了邮箱验证。解决方法：
1. 检查注册邮箱的收件箱（包括垃圾邮件）
2. 点击验证链接
3. 或者在 Supabase 控制台关闭邮箱验证（见上文）

### Q4: 刷新页面后需要重新登录

**A**: 请检查：
1. 浏览器是否禁用了 localStorage
2. 是否在隐私模式下运行
3. 控制台是否有错误信息

### Q5: 提示"网络错误，请稍后重试"

**A**: 请检查：
1. `.env` 文件中的 Supabase URL 和 Key 是否正确
2. 网络连接是否正常
3. Supabase 项目是否处于活动状态

## 技术细节

### 状态管理

使用 Pinia 管理用户状态：

```typescript
// 使用示例
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 获取登录状态
console.log(userStore.isLoggedIn)

// 获取用户信息
console.log(userStore.email)
console.log(userStore.username)
```

### 路由守卫

在 `src/router/index.ts` 中配置了全局前置守卫：

- 白名单路由：`/login`, `/register`（无需登录）
- 其他路由需要登录才能访问
- 已登录用户访问登录/注册页会自动跳转到首页

### API 封装

所有认证相关 API 封装在 `src/api/auth.ts`：

- `register()`: 用户注册
- `login()`: 用户登录
- `logout()`: 用户登出
- `getSession()`: 获取当前会话

### 表单验证

验证函数封装在 `src/utils/validate.ts`：

- `validateEmail()`: 邮箱验证
- `validateUsername()`: 用户名验证
- `validatePassword()`: 密码验证
- `validateConfirmPassword()`: 确认密码验证

## 下一步开发

- [ ] 密码重置功能
- [ ] 第三方登录（Google, GitHub）
- [ ] 用户个人中心
- [ ] 头像上传
- [ ] 用户信息编辑

## 相关文档

- [Supabase 文档](https://supabase.com/docs)
- [Vue 3 文档](https://vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Ant Design Vue 文档](https://antdv.com/)

