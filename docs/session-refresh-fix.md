# 刷新页面保持登录状态 - 修复说明

## 问题描述

**现象：** 用户登录后，刷新页面会被强制退出，需要重新登录。

**根本原因：**
1. Pinia store 的状态存储在内存中，页面刷新后会丢失
2. 路由守卫在检查 `isLoggedIn` 时，store 还是空的（未从 Supabase localStorage 恢复）
3. 导致守卫认为用户未登录，强制跳转到登录页

## 解决方案

### 修改 1: 应用启动时恢复会话 (`src/main.ts`)

**修改前：**
```typescript
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

**修改后：**
```typescript
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// ✅ 在应用启动时立即恢复会话
const userStore = useUserStore()
userStore.checkAuth().then(() => {
  console.log('Initial auth check completed, logged in:', userStore.isLoggedIn)
})

// ✅ 监听认证状态变化，自动同步到 store
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    userStore.checkAuth()
  }
  if (event === 'SIGNED_OUT') {
    userStore.clearUser()
  }
  if (event === 'SIGNED_IN') {
    userStore.checkAuth()
  }
})

app.mount('#app')
```

**效果：**
- 应用启动时立即从 Supabase localStorage 读取会话并填充 store
- 认证状态变化时自动同步到 store，保持一致性

### 修改 2: 路由守卫优化 (`src/router/index.ts`)

**修改前：**
```typescript
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 如果需要登录但未登录
  if (requiresAuth && !userStore.isLoggedIn) {
    message.warning('请先登录')
    next('/login')
    return
  }
  
  next()
})
```

**修改后：**
```typescript
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (requiresAuth) {
    // ✅ 如果 store 为空，尝试从 Supabase 恢复会话
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

**效果：**
- 即使 store 为空（刷新页面后），也会先尝试从 Supabase 恢复会话
- 只有确认 Supabase 中也没有会话时，才跳转到登录页

## 工作原理

### 1. 登录流程

```
用户输入账号密码
    ↓
调用 supabase.auth.signInWithPassword()
    ↓
Supabase 返回 session (包含 access_token 和 refresh_token)
    ↓
session 自动保存到 localStorage (key: 'ai-travel-planner-auth')
    ↓
userStore.setUser() 更新 Pinia store
    ↓
用户成功登录
```

### 2. 刷新页面流程（修复后）

```
页面刷新
    ↓
Pinia store 被清空（内存丢失）
    ↓
main.ts 执行 userStore.checkAuth()
    ↓
checkAuth() 调用 supabase.auth.getSession()
    ↓
Supabase 从 localStorage 读取 session
    ↓
session 有效 → 更新 userStore
    ↓
路由守卫检查 userStore.isLoggedIn → true ✅
    ↓
允许访问，无需重新登录
```

### 3. Token 自动刷新流程

```
用户保持页面打开
    ↓
Access token 即将过期（默认 1 小时）
    ↓
Supabase 检测到即将过期
    ↓
自动使用 refresh_token 获取新的 access_token
    ↓
触发 onAuthStateChange('TOKEN_REFRESHED')
    ↓
自动更新 userStore（通过监听器）
    ↓
用户继续使用，无感知刷新 ✅
```

## 验证测试

### 测试 1: 刷新页面保持登录

**步骤：**
1. 登录应用
2. 打开浏览器开发者工具 Console
3. 刷新页面（F5 或 Cmd+R）

**预期结果：**
- ✅ Console 输出 `Initial auth check completed, logged in: true`
- ✅ 页面不跳转到登录页
- ✅ 用户信息正常显示（头像、邮箱等）
- ✅ 可以正常访问需要登录的页面

**如果失败：**
- 检查 localStorage 中是否有 `ai-travel-planner-auth` 键
- 检查 Console 是否有 Supabase 相关错误
- 确认 Supabase URL 和 Key 配置正确

### 测试 2: 关闭浏览器后重新打开

**步骤：**
1. 登录应用
2. 完全关闭浏览器（不是关闭标签页）
3. 重新打开浏览器
4. 访问应用首页

**预期结果：**
- ✅ 仍然保持登录状态
- ✅ 无需重新输入账号密码

**如果失败：**
- 检查浏览器设置，确保没有"关闭时清除 Cookies 和站点数据"
- 检查是否在隐私/无痕模式下（隐私模式会清除 localStorage）

### 测试 3: 长时间保持登录

**步骤：**
1. 登录应用
2. 保持页面打开数小时
3. 观察 Console 日志

**预期结果：**
- ✅ 定期看到 `Auth state changed: TOKEN_REFRESHED` 日志
- ✅ 用户仍然可以正常操作（创建行程、查看详情等）
- ✅ 不会突然跳转到登录页

### 测试 4: 创建行程时 Token 刷新

**步骤：**
1. 登录应用
2. 进入创建行程页面
3. 输入行程信息，点击"生成行程"
4. 等待 AI 生成（可能需要较长时间）

**预期结果：**
- ✅ 即使生成时间很长，也能成功保存到数据库
- ✅ Console 输出 `User ID saved: xxx`
- ✅ Console 输出 `Create plan response: { data: { id: xxx } }`
- ✅ 自动跳转到行程详情页

**如果失败：**
- 检查 Console 是否有 "请先登录后再生成行程" 错误
- 检查是否有 Supabase 权限错误（RLS）
- 确认 `createPlanFromAI` 正确接收了 `userId` 参数

## 调试技巧

### 1. 检查 localStorage

在浏览器 Console 中运行：
```javascript
// 查看存储的认证信息
console.log(localStorage.getItem('ai-travel-planner-auth'))

// 查看 Supabase 默认存储的信息（如果有）
console.log(localStorage.getItem('supabase.auth.token'))
```

### 2. 手动触发会话恢复

在 Console 中运行：
```javascript
// 导入 userStore（在开发环境中可用）
import { useUserStore } from '@/stores/user'

// 手动触发会话检查
const userStore = useUserStore()
await userStore.checkAuth()
console.log('Logged in:', userStore.isLoggedIn)
console.log('User:', userStore.userState)
```

### 3. 监听所有认证事件

临时添加到 `main.ts`：
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  console.log('=== Auth Event ===')
  console.log('Event:', event)
  console.log('Session:', session)
  console.log('User:', session?.user)
  console.log('==================')
})
```

### 4. 清除会话重新测试

如果需要清除当前会话重新测试：
```javascript
// 在 Console 中运行
localStorage.clear()
location.reload()
```

## 常见问题

### Q1: 为什么有时刷新页面仍需要登录？

**可能原因：**
1. 浏览器隐私设置阻止了 localStorage
2. Token 已经过期且 refresh token 也过期
3. Supabase 后台手动撤销了会话

**解决方案：**
1. 检查浏览器隐私设置
2. 确认 Supabase Dashboard 中 JWT Expiry 设置正确
3. 检查是否有网络问题导致 token 刷新失败

### Q2: Token 自动刷新是如何工作的？

**答：**
- Supabase 客户端会在后台监测 access_token 的过期时间
- 当 token 即将过期时（默认提前 60 秒），自动使用 refresh_token 获取新的 access_token
- 这个过程完全在后台进行，用户无感知
- 只要 refresh_token 有效（默认 30 天），就能一直自动刷新

### Q3: 如果用户清除了浏览器缓存会怎样？

**答：**
- localStorage 会被清除
- 下次访问时会跳转到登录页
- 这是正常行为，用户需要重新登录

### Q4: 如何延长会话有效期？

**答：**
需要在 Supabase Dashboard 配置：
1. Settings → Authentication → JWT Settings
2. 修改 `JWT Expiry` 和 `Refresh Token Expiry`
3. 建议值：
   - JWT Expiry: 259200 秒（3 天）
   - Refresh Token Expiry: 2592000 秒（30 天）

## 总结

**修复要点：**
1. ✅ 应用启动时立即恢复会话（`main.ts`）
2. ✅ 路由守卫中再次检查会话（`router/index.ts`）
3. ✅ 监听认证状态变化并同步到 store（`main.ts`）
4. ✅ 提前缓存 userId 避免长时间操作中会话失效（`CreatePlanView.vue`）

**效果：**
- 🎯 刷新页面不再需要重新登录
- 🎯 关闭浏览器后重新打开仍保持登录
- 🎯 Token 自动刷新，用户无感知
- 🎯 长时间操作（如 AI 生成行程）不会因会话过期而失败
