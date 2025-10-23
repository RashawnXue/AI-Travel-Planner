/**
 * 表单验证工具函数
 */

// 邮箱格式验证
export const validateEmail = (email: string): { valid: boolean; message: string } => {
  if (!email) {
    return { valid: false, message: '请输入邮箱地址' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: '请输入正确的邮箱格式' }
  }
  return { valid: true, message: '' }
}

// 用户名验证
export const validateUsername = (username: string): { valid: boolean; message: string } => {
  if (!username) {
    return { valid: false, message: '请输入用户名' }
  }
  if (username.length < 2 || username.length > 20) {
    return { valid: false, message: '用户名长度为 2-20 个字符' }
  }
  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    return { valid: false, message: '用户名只能包含中英文、数字和下划线' }
  }
  return { valid: true, message: '' }
}

// 密码验证
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (!password) {
    return { valid: false, message: '请输入密码' }
  }
  if (password.length < 8) {
    return { valid: false, message: '密码长度至少为 8 个字符' }
  }
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { valid: false, message: '密码必须包含大写字母、小写字母和数字' }
  }
  return { valid: true, message: '' }
}

// 确认密码验证
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): { valid: boolean; message: string } => {
  if (!confirmPassword) {
    return { valid: false, message: '请再次输入密码' }
  }
  if (password !== confirmPassword) {
    return { valid: false, message: '两次输入的密码不一致' }
  }
  return { valid: true, message: '' }
}

