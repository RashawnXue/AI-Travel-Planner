/**
 * 用户类型定义
 */

// 用户信息
export interface User {
  id: string
  email: string
  username: string
}

// 用户状态
export interface UserState {
  id: string | null
  email: string | null
  username: string | null
  isLoggedIn: boolean
}

// 注册表单数据
export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// 登录表单数据
export interface LoginForm {
  email: string
  password: string
}
