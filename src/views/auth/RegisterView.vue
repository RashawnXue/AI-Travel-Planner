<template>
  <div class="register-page">
    <div class="register-container">
      <div class="logo">✈️</div>
      <h1>注册 AI 旅行规划师</h1>

      <a-form
        :model="formState"
        layout="vertical"
        @finish="handleSubmit"
        :disabled="loading"
      >
        <!-- 用户名 -->
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ validator: validateUsernameRule }]"
        >
          <a-input
            v-model:value="formState.username"
            placeholder="请输入用户名"
            size="large"
          />
        </a-form-item>

        <!-- 邮箱 -->
        <a-form-item
          label="邮箱"
          name="email"
          :rules="[{ validator: validateEmailRule }]"
        >
          <a-input
            v-model:value="formState.email"
            type="email"
            placeholder="请输入邮箱地址"
            size="large"
          />
        </a-form-item>

        <!-- 密码 -->
        <a-form-item
          label="密码"
          name="password"
          :rules="[{ validator: validatePasswordRule }]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="请输入密码"
            size="large"
          >
            <template #iconRender="visible">
              <EyeTwoTone v-if="visible" />
              <EyeInvisibleOutlined v-else />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 确认密码 -->
        <a-form-item
          label="确认密码"
          name="confirmPassword"
          :rules="[{ validator: validateConfirmPasswordRule }]"
        >
          <a-input-password
            v-model:value="formState.confirmPassword"
            placeholder="请再次输入密码"
            size="large"
          >
            <template #iconRender="visible">
              <EyeTwoTone v-if="visible" />
              <EyeInvisibleOutlined v-else />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 提交按钮 -->
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            class="submit-btn"
          >
            {{ loading ? '注册中...' : '注册' }}
          </a-button>
        </a-form-item>
      </a-form>

      <div class="footer-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons-vue'
import { register } from '@/api/auth'
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword
} from '@/utils/validate'
import type { RegisterForm } from '@/types/user'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()

// 表单状态
const formState = reactive<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 加载状态
const loading = ref(false)

// 自定义验证规则
const validateUsernameRule = async (_rule: Rule, value: string) => {
  const result = validateUsername(value)
  if (!result.valid) {
    return Promise.reject(result.message)
  }
  return Promise.resolve()
}

const validateEmailRule = async (_rule: Rule, value: string) => {
  const result = validateEmail(value)
  if (!result.valid) {
    return Promise.reject(result.message)
  }
  return Promise.resolve()
}

const validatePasswordRule = async (_rule: Rule, value: string) => {
  const result = validatePassword(value)
  if (!result.valid) {
    return Promise.reject(result.message)
  }
  return Promise.resolve()
}

const validateConfirmPasswordRule = async (_rule: Rule, value: string) => {
  const result = validateConfirmPassword(formState.password, value)
  if (!result.valid) {
    return Promise.reject(result.message)
  }
  return Promise.resolve()
}

// 字段失焦验证已由 Ant Design Vue 的表单验证接管，无需手动处理

// 提交表单
const handleSubmit = async () => {
  loading.value = true

  try {
    const { error } = await register(formState)

    if (error) {
      message.error(error.message, 3)
      return
    }

    message.success('注册成功，请查收邮箱验证邮件', 3)

    // 3 秒后跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (err) {
    message.error(err instanceof Error ? err.message : '注册失败，请重试', 3)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-y: auto;
}

.register-container {
  background: white;
  width: 520px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 48px 60px;
}

.logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
}

h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 40px;
}

:deep(.ant-form-item) {
  margin-bottom: 24px;
}

:deep(.ant-form-item-label > label) {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

/* 普通输入框样式 */
:deep(.ant-input:not(.ant-input-affix-wrapper .ant-input)) {
  height: 46px;
  border-radius: 8px;
  font-size: 15px;
  padding: 0 16px;
  border: 1px solid #d9d9d9 !important;
}

:deep(.ant-input:not(.ant-input-affix-wrapper .ant-input):hover) {
  border-color: #667eea !important;
}

:deep(.ant-input:not(.ant-input-affix-wrapper .ant-input):focus) {
  border-color: #667eea !important;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
}

/* 密码输入框容器样式 */
:deep(.ant-input-affix-wrapper) {
  height: 46px;
  border-radius: 8px;
  padding: 0 11px;
  border: 1px solid #d9d9d9 !important;
}

:deep(.ant-input-affix-wrapper:hover) {
  border-color: #667eea !important;
}

:deep(.ant-input-affix-wrapper-focused) {
  border-color: #667eea !important;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
}

/* 密码输入框内部 input，移除边框避免双层 */
:deep(.ant-input-affix-wrapper .ant-input) {
  border: none !important;
  padding: 0 !important;
  box-shadow: none !important;
}

:deep(.ant-input-affix-wrapper .ant-input:focus) {
  border: none !important;
  box-shadow: none !important;
}

.submit-btn {
  height: 48px;
  background: #667eea;
  border-color: #667eea;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 500;
  margin-top: 32px;
}

.submit-btn:hover {
  background: #5568d3;
  border-color: #5568d3;
}

.footer-link {
  text-align: center;
  margin-top: 28px;
  font-size: 15px;
  color: #666;
}

.footer-link a {
  color: #667eea;
  text-decoration: none;
  margin-left: 6px;
  font-weight: 500;
}

.footer-link a:hover {
  text-decoration: underline;
}
</style>

