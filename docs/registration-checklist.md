# 注册功能修复检查清单

## 必须完成的配置步骤

### 1. Supabase Dashboard 配置 (必做)

#### Step 1.1: URL Configuration
访问: `Supabase Dashboard > Authentication > URL Configuration`

- [ ] 设置 **Site URL**: 
  - 开发: `http://localhost:5173`
  - 生产: `https://yourdomain.com`

- [ ] 添加 **Redirect URLs**:
  - 开发环境添加:
    - `http://localhost:5173/auth/confirm`
    - `http://localhost:5173/login`
    - `http://localhost:5173/*`
  
#### Step 1.2: Email Templates
访问: `Supabase Dashboard > Authentication > Email Templates > Confirm signup`

- [ ] 修改邮件模板,将默认的:
  ```html
  <a href="{{ .ConfirmationURL }}">Confirm your mail</a>
  ```
  
  替换为:
  ```html
  <h2>欢迎注册 AI 旅行规划师!</h2>
  <p>请点击下面的链接来验证您的邮箱地址:</p>
  <p>
    <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
      验证邮箱地址
    </a>
  </p>
  <p>或复制链接: {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email</p>
  ```

- [ ] 点击 **Save** 保存模板

#### Step 1.3: Database Triggers (必做)
访问: `Supabase Dashboard > SQL Editor`

- [ ] 执行后端项目中的脚本:
  ```
  AI-Travel-Planner-be/supabase_fix_registration.sql
  ```

- [ ] 或执行前端文档中的脚本:
  ```
  AI-Travel-Planner/docs/supabase-init.sql
  ```

### 2. 代码已更新 (已完成)

#### 前端修改
- [x] 创建邮件验证页面 `src/views/auth/ConfirmView.vue`
- [x] 更新路由配置,添加 `/auth/confirm` 路由
- [x] 修改注册逻辑,移除自动登出
- [x] 更新注册成功提示消息

#### 后端修改
- [x] 更新注册接口,添加 `email_redirect_to` 配置
- [x] 确保正确处理邮件验证回调

### 3. 测试步骤

完成上述配置后,按以下步骤测试:

- [ ] **步骤 1**: 注册新用户
  - 访问 `http://localhost:5173/register`
  - 填写邮箱和密码
  - 点击注册按钮
  - 应该看到提示: "注册成功！我们已向您的邮箱发送了一封验证邮件..."

- [ ] **步骤 2**: 检查邮件
  - 查看注册邮箱(包括垃圾邮件文件夹)
  - 应该收到标题为 "欢迎注册 AI 旅行规划师!" 的邮件
  - 邮件中应包含 "验证邮箱地址" 按钮

- [ ] **步骤 3**: 点击验证链接
  - 点击邮件中的验证按钮
  - 应该跳转到 `http://localhost:5173/auth/confirm?token_hash=...&type=email`
  - 页面应显示 "邮箱验证成功!" 并倒计时跳转

- [ ] **步骤 4**: 登录测试
  - 自动跳转到登录页或手动访问 `/login`
  - 使用注册的邮箱和密码登录
  - 应该能够成功登录并跳转到首页

## 常见问题排查

### 问题1: 收不到验证邮件

**检查项:**
1. [ ] 查看垃圾邮件文件夹
2. [ ] 检查 Site URL 是否正确配置
3. [ ] 在 Supabase Dashboard > Authentication > Logs 查看是否有错误
4. [ ] 确认 Email Provider 设置正确 (默认使用内置SMTP)

### 问题2: 点击验证链接显示错误

**检查项:**
1. [ ] 邮件模板是否使用了正确的格式 (包含 `{{ .TokenHash }}`)
2. [ ] Redirect URLs 是否包含 `/auth/confirm`
3. [ ] 前端路由是否正确配置
4. [ ] 检查浏览器控制台是否有错误

### 问题3: 验证成功但无法登录

**检查项:**
1. [ ] 数据库触发器是否正确执行
2. [ ] 在 Supabase Dashboard > Table Editor 查看 `user_profiles` 表是否有对应记录
3. [ ] 执行 `supabase_fix_registration.sql` 修复脚本

## 可选优化配置

### 使用自定义 SMTP (推荐用于生产环境)

访问: `Supabase Dashboard > Authentication > Settings > Email Provider`

推荐服务:
- SendGrid (每天免费100封)
- AWS SES (按量付费)
- 阿里云邮件推送 (国内推荐)

配置后的好处:
- 更高的发送限额
- 更好的邮件送达率
- 使用自己的域名发送邮件

### 临时关闭邮件验证 (仅用于开发测试)

访问: `Supabase Dashboard > Authentication > Providers > Email`

- [ ] 取消勾选 **Enable email confirmations**
- ⚠️ 记得在生产环境前重新开启!

## 需要帮助?

如果遇到问题,请查看:
- 详细配置指南: `docs/supabase-email-config.md`
- 修复说明: `docs/registration-fix-guide.md`
- 认证设置指南: `docs/auth-setup-guide.md`

或在项目 Issues 中提问。

