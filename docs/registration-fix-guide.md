# 注册功能修复指南

## 问题分析

注册功能无法正常工作的主要原因:

1. **邮件验证配置不正确** - Supabase默认启用邮箱验证,但redirect URL没有正确配置
2. **邮件模板问题** - 验证邮件中的链接格式需要调整为支持PKCE流程
3. **缺少验证端点** - 前端没有处理邮件验证回调的端点

## 修复步骤

### 1. Supabase Dashboard 配置

#### 1.1 配置 Redirect URLs
在 Supabase Dashboard > Authentication > URL Configuration 中添加:
- Site URL: `http://localhost:5173` (开发环境)
- Redirect URLs: 
  - `http://localhost:5173/auth/confirm`
  - `http://localhost:5173/login`
  - 生产环境的对应URL

#### 1.2 修改邮件模板
在 Supabase Dashboard > Authentication > Email Templates > Confirm signup:

将默认的:
```html
{{ .ConfirmationURL }}
```

改为:
```html
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

完整示例:
```html
<h2>确认您的注册</h2>
<p>点击下面的链接来验证您的邮箱地址:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">验证邮箱</a></p>
<p>或者访问以下链接:</p>
<p>{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email</p>
```

#### 1.3 (可选)调整邮件验证设置
在 Supabase Dashboard > Authentication > Providers > Email:
- **Enable email confirmations**: 保持开启(推荐)
- **Secure email change**: 推荐开启
- 如果是测试环境且不想验证邮箱,可以临时关闭邮件确认

### 2. 前端修复

#### 2.1 创建验证端点
创建 `src/views/auth/ConfirmView.vue` 来处理邮件验证回调

#### 2.2 添加路由
在 `src/router/index.ts` 中添加验证路由

#### 2.3 更新注册逻辑
注册成功后不再自动登出,让Supabase的邮件验证流程接管

### 3. 后端修复

#### 3.1 执行数据库修复脚本
确保已执行 `supabase_fix_registration.sql` 来修复:
- user_profiles 表的 RLS 策略
- 触发器函数的 SECURITY DEFINER 权限
- 为已存在用户补充 profile

#### 3.2 确认后端配置
后端的注册接口应该返回完整的用户和session信息

## 验证修复

1. 尝试新用户注册
2. 检查邮箱收到验证邮件
3. 点击验证链接
4. 确认跳转到登录页并可以成功登录

## 其他注意事项

1. **SMTP配置** - 如果使用自定义SMTP,确保配置正确
2. **Rate Limiting** - 注册邮件默认每小时最多30封
3. **Link Tracking** - 如果使用自定义SMTP服务,关闭链接跟踪功能
4. **邮件扫描** - 企业邮件扫描器可能会提前访问验证链接,考虑使用中转页面

## 相关文档

- [Supabase Auth Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Server-Side Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod)

