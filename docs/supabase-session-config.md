# Supabase 会话配置指南

## 目标
确保用户登录信息在 3 天内保持有效，除非用户主动退出。**解决刷新页面后需要重新登录的问题。**

## 前端配置（已完成）

### 1. Supabase 客户端配置 (`src/utils/supabase.ts`)

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // 持久化会话到 localStorage
    autoRefreshToken: true,       // 自动刷新 token
    detectSessionInUrl: true,     // 检测 URL 中的会话
    storage: window.localStorage, // 使用 localStorage
    storageKey: 'ai-travel-planner-auth', // 自定义存储 key
    flowType: 'pkce'             // 使用 PKCE 流程
  }
})
```

### 2. 应用启动时恢复会话 (`src/main.ts`)

```typescript
// 在应用启动时立即从 localStorage 恢复会话
const userStore = useUserStore()
userStore.checkAuth().then(() => {
  console.log('Initial auth check completed, logged in:', userStore.isLoggedIn)
})

// 监听认证状态变化，自动同步到 store
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    userStore.checkAuth() // 更新 store
  }
  if (event === 'SIGNED_OUT') {
    userStore.clearUser() // 清除 store
    router.push('/login')
  }
  if (event === 'SIGNED_IN') {
    userStore.checkAuth() // 更新 store
  }
})
```

**关键点：**
- ✅ 应用启动时立即调用 `userStore.checkAuth()` 从 Supabase localStorage 恢复会话
- ✅ 路由守卫中如果 store 为空，会再次调用 `checkAuth()` 确保恢复会话
- ✅ 监听认证状态变化，自动同步 Supabase 会话到 Pinia store

### 3. 路由守卫优化 (`src/router/index.ts`)

```typescript
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth !== false
  
  if (requiresAuth) {
    // 如果 store 中没有用户信息，尝试从 Supabase 恢复会话
    if (!userStore.isLoggedIn) {
      const isAuthenticated = await userStore.checkAuth()
      
      if (!isAuthenticated) {
        message.warning('请先登录')
        next('/login')
        return
      }
    }
  }
  
  next()
})
```

**关键改进：**
- ✅ 刷新页面后，路由守卫会调用 `checkAuth()` 从 localStorage 恢复会话
- ✅ 避免因 store 状态丢失而错误地跳转到登录页

这些配置确保：
- ✅ 会话信息保存在浏览器本地存储
- ✅ 刷新页面后自动恢复登录状态
- ✅ Token 即将过期时自动刷新
- ✅ 页面刷新后仍保持登录状态
- ✅ 3 天内不会自动登出（除非用户手动退出）

## 后端配置（需要在 Supabase Dashboard 设置）

### 步骤 1: 登录 Supabase Dashboard

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目：`AI-Travel-Planner`

### 步骤 2: 配置 JWT 过期时间

1. 进入 **Settings** → **Authentication**
2. 找到 **JWT Settings** 部分
3. 设置以下参数：

   ```
   JWT Expiry:           259200 秒（3 天）
   Refresh Token Expiry: 2592000 秒（30 天）
   ```

   **说明：**
   - `JWT Expiry`: Access Token 的有效期，设置为 3 天（259200 秒 = 3 × 24 × 60 × 60）
   - `Refresh Token Expiry`: Refresh Token 的有效期，建议设置为 30 天，确保即使用户一段时间不活跃，也能通过 refresh token 重新获取 access token

### 步骤 3: 配置自动刷新阈值（可选）

在 **Advanced Settings** 中可以配置：

```
Auto Refresh Token Threshold: 300 秒（5 分钟）
```

这意味着当 Access Token 还有 5 分钟就要过期时，客户端会自动刷新。

### 步骤 4: 保存并应用配置

点击 **Save** 按钮保存配置。配置会立即生效。

## 测试验证

### 测试场景 1: 页面刷新保持登录

1. 登录应用
2. 刷新页面（F5 或 Cmd+R）
3. ✅ 应该仍然保持登录状态

### 测试场景 2: 关闭浏览器后重新打开

1. 登录应用
2. 完全关闭浏览器
3. 重新打开浏览器，访问应用
4. ✅ 应该仍然保持登录状态（3 天内）

### 测试场景 3: Token 自动刷新

1. 登录应用
2. 保持页面打开 2-3 天（或修改系统时间进行测试）
3. ✅ Token 应该在后台自动刷新，用户无感知

### 测试场景 4: 长时间生成行程

1. 登录应用
2. 创建一个需要较长时间生成的行程（AI 调用）
3. ✅ 生成完成后应该能成功保存到数据库（因为我们提前缓存了 userId）

## 代码说明

### 为什么需要缓存 userId？

在 `CreatePlanView.vue` 中，我们在调用 AI 之前就获取并缓存了 `userId`：

```typescript
// 1. 立即获取并缓存用户 ID
const { data: userSession } = await supabase.auth.getSession()
userId = userSession.session.user.id

// 2. 执行长时间的 AI 调用
const res = await invokeBailianApp({ prompt })

// 3. 使用缓存的 userId 而不是重新获取
const createRes = await createPlanFromAI(aiObj, userId)
```

**好处：**
- 即使 AI 调用时间很长（超过 token 有效期），我们仍然可以使用之前缓存的 `userId`
- 避免在 `createPlanFromAI` 内部调用 `supabase.auth.getUser()` 时因 token 过期而失败
- Supabase 会在后台自动刷新 token，不影响后续操作

## 安全注意事项

1. **PKCE 流程**: 我们使用了 PKCE (Proof Key for Code Exchange) 流程，这是 OAuth 2.0 的安全增强，防止授权码拦截攻击。

2. **LocalStorage 安全性**: 
   - LocalStorage 存储的 token 受同源策略保护
   - 建议启用 HTTPS，防止中间人攻击
   - Token 已加密，但仍需防止 XSS 攻击

3. **自动登出场景**:
   - 用户主动点击"退出"按钮
   - Token 过期且 refresh token 也过期（30 天后）
   - 用户清除浏览器缓存/localStorage
   - 在 Supabase Dashboard 手动撤销用户会话

## 故障排查

### 问题 1: 用户频繁被登出

**可能原因：**
- JWT Expiry 时间设置过短
- autoRefreshToken 未启用
- localStorage 被浏览器清理策略清除

**解决方案：**
1. 检查 Supabase Dashboard 的 JWT Expiry 设置
2. 确认 `autoRefreshToken: true` 已配置
3. 检查浏览器隐私设置，确保允许存储 cookies 和本地数据

### 问题 2: AI 生成行程后保存失败，提示"未登录"

**可能原因：**
- Token 在长时间 AI 调用期间过期
- RLS（Row Level Security）策略要求有效的 session

**解决方案：**
1. ✅ 已实现：在调用 AI 前缓存 `userId`
2. ✅ 已实现：修改 `createPlanFromAI` 接受 `userId` 参数
3. 如果问题仍存在，考虑使用 Supabase Service Role Key（服务端）进行写入

### 问题 3: Token 刷新失败

**可能原因：**
- Refresh token 已过期
- 网络问题导致刷新请求失败

**解决方案：**
1. 监听 `onAuthStateChange` 事件，捕获刷新失败
2. 引导用户重新登录

示例代码：

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully')
  }
  if (event === 'SIGNED_OUT') {
    console.log('User signed out')
    router.push('/auth/login')
  }
})
```

## 参考资料

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [JWT Best Practices](https://supabase.com/docs/guides/auth/jwts)
- [Session Management](https://supabase.com/docs/guides/auth/sessions)
