# Supabase 邮件验证配置指南

## 重要提示
本文档包含必须在 Supabase Dashboard 中进行的配置步骤,这些步骤是注册功能正常工作的前提。

## 配置步骤

### 1. 配置 URL 设置

访问 Supabase Dashboard > Authentication > URL Configuration

#### 1.1 设置 Site URL
开发环境:
```
http://localhost:5173
```

生产环境:
```
https://yourdomain.com
```

#### 1.2 设置 Redirect URLs
添加以下URL到允许的重定向URL列表:

**开发环境:**
```
http://localhost:5173/auth/confirm
http://localhost:5173/login
http://localhost:5173/*
```

**生产环境:**
```
https://yourdomain.com/auth/confirm
https://yourdomain.com/login
https://yourdomain.com/*
```

### 2. 修改邮件模板

访问 Supabase Dashboard > Authentication > Email Templates > Confirm signup

#### 2.1 找到默认模板
默认的确认链接格式如下:
```html
<a href="{{ .ConfirmationURL }}">Confirm your mail</a>
```

#### 2.2 替换为新格式
将整个邮件模板替换为:

```html
<h2>欢迎注册 AI 旅行规划师!</h2>

<p>感谢您注册我们的服务。请点击下面的链接来验证您的邮箱地址:</p>

<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email" 
     style="display: inline-block; padding: 12px 24px; background-color: #1e88e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500;">
    验证邮箱地址
  </a>
</p>

<p>或者复制以下链接到浏览器中打开:</p>
<p style="word-break: break-all; color: #666;">
  {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
</p>

<p style="color: #999; font-size: 12px; margin-top: 32px;">
  如果您没有注册过账号,请忽略此邮件。
</p>
```

**关键点说明:**
- `{{ .SiteURL }}` - 会自动替换为您在URL Configuration中设置的Site URL
- `{{ .TokenHash }}` - 验证令牌的哈希值
- `type=email` - 指定这是邮箱验证类型

### 3. (可选) 调整邮件验证设置

访问 Supabase Dashboard > Authentication > Providers > Email

#### 3.1 推荐配置
- ✅ **Enable email confirmations** - 保持开启(推荐)
- ✅ **Secure email change** - 开启,更改邮箱时需要验证
- ⚙️ **Confirm email** - 推荐设置为"enabled"

#### 3.2 开发测试配置(可选)
如果您在开发环境中想跳过邮件验证:
- ❌ 临时关闭 **Enable email confirmations**
- ⚠️ 记得在生产环境前重新开启!

### 4. 配置 SMTP (可选但推荐)

默认情况下,Supabase使用内置的邮件服务,但有以下限制:
- 每小时最多30封注册邮件
- 邮件可能被标记为垃圾邮件

#### 4.1 推荐使用自定义SMTP
访问 Supabase Dashboard > Authentication > Settings > Email Provider

推荐的SMTP服务提供商:
- **SendGrid** - 每天免费100封邮件
- **AWS SES** - 按使用量付费,价格低廉
- **Mailgun** - 每月免费5000封邮件
- **阿里云邮件推送** - 国内用户推荐

#### 4.2 SMTP配置示例
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: <your-api-key>
Sender Email: noreply@yourdomain.com
Sender Name: AI旅行规划师
```

**注意:** 使用自定义SMTP后记得关闭链接跟踪功能,否则可能导致验证链接失效。

### 5. 数据库触发器修复

确保执行了 `supabase_fix_registration.sql` 脚本来修复:
- user_profiles 表的 RLS 策略
- 触发器函数的权限问题

在 Supabase Dashboard > SQL Editor 中执行:
```sql
-- 查看脚本内容
-- /Users/rashawn/projects/course/AI-Travel-Planner-be/supabase_fix_registration.sql
```

## 验证配置

### 测试注册流程

1. **注册新用户**
   ```
   邮箱: test@example.com
   密码: Test123456
   ```

2. **检查邮箱**
   - 查看收件箱(包括垃圾邮件文件夹)
   - 应该收到标题为"确认您的注册"的邮件

3. **点击验证链接**
   - 链接格式应该是: `http://localhost:5173/auth/confirm?token_hash=...&type=email`
   - 应该跳转到验证页面并显示"邮箱验证成功"

4. **登录测试**
   - 验证成功后应该能正常登录
   - 如果验证前尝试登录,应该提示需要先验证邮箱

## 常见问题

### Q1: 收不到验证邮件
**可能原因:**
1. 邮件被拦截在垃圾邮件中
2. 达到发送限制(默认每小时30封)
3. SMTP配置错误

**解决方法:**
- 检查垃圾邮件文件夹
- 配置自定义SMTP服务
- 在Dashboard中查看 Authentication > Logs

### Q2: 验证链接点击后显示错误
**可能原因:**
1. 链接格式不正确
2. token_hash 已过期(默认24小时)
3. Redirect URLs 没有正确配置

**解决方法:**
- 检查邮件模板是否使用了正确的格式
- 在URL Configuration中添加 /auth/confirm 路由
- 请求新的验证邮件

### Q3: 验证成功但无法登录
**可能原因:**
1. 数据库触发器未正确执行
2. user_profiles 表没有创建对应记录

**解决方法:**
- 执行 supabase_fix_registration.sql
- 检查数据库 user_profiles 表

### Q4: 邮件链接被扫描器提前访问
**企业邮箱的安全扫描器可能会提前访问链接**

**解决方法:**
- 使用中转页面,要求用户点击按钮后再跳转
- 或者使用OTP验证码代替Magic Link

## 生产环境检查清单

部署到生产环境前,请确保:

- [ ] Site URL 已更新为生产域名
- [ ] Redirect URLs 包含所有生产环境的URL
- [ ] 邮件模板使用 `{{ .SiteURL }}` 而非硬编码的localhost
- [ ] 已配置自定义SMTP服务
- [ ] 已启用邮件确认功能
- [ ] 数据库触发器已正确配置
- [ ] 测试完整的注册验证流程

## 相关文档

- [Supabase Auth Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase Auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [注册功能修复指南](./registration-fix-guide.md)

