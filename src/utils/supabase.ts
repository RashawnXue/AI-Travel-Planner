/**
 * Supabase 客户端初始化
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 配置缺失，请检查环境变量')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 保持会话持久化到 localStorage
    persistSession: true,
    // 自动刷新 token，避免过期
    autoRefreshToken: true,
    // 检测 URL 中的会话信息（用于邮箱验证等场景）
    detectSessionInUrl: true,
    // 使用 localStorage 存储会话，确保刷新页面后仍然保持登录
    storage: window.localStorage,
    // 自定义存储 key，避免与其他应用冲突
    storageKey: 'ai-travel-planner-auth',
    // 使用 implicit 流程以支持浏览器环境的会话恢复
    flowType: 'implicit'
  },
  // 全局配置
  global: {
    headers: {
      'X-Client-Info': 'ai-travel-planner'
    }
  }
})

