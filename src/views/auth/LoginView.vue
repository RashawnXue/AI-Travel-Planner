<template>
  <div class="login-page">
    <div class="login-container">
      <div class="logo">✈️</div>
      <h1>登录 AI 旅行规划师</h1>

      <a-form
        :model="formState"
        layout="vertical"
        @finish="handleSubmit"
        :disabled="loading"
      >
        <!-- 邮箱 -->
        <a-form-item
          label="邮箱"
          name="email"
          :rules="[
            { required: true, message: '请输入邮箱地址' },
            { validator: validateEmailRule }
          ]"
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
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="请输入密码"
            size="large"
          />
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
            {{ loading ? '登录中...' : '登录' }}
          </a-button>
        </a-form-item>
      </a-form>

      <div class="footer-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { login } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import { validateEmail } from '@/utils/validate'
import type { LoginForm } from '@/types/user'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()
const userStore = useUserStore()

// 表单状态
const formState = reactive<LoginForm>({
  email: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 自定义验证规则
const validateEmailRule = async (_rule: Rule, value: string) => {
  const result = validateEmail(value)
  if (!result.valid) {
    return Promise.reject(result.message)
  }
  return Promise.resolve()
}

// 提交表单
const handleSubmit = async () => {
  loading.value = true

  try {
    const { data, error } = await login(formState)

    if (error) {
      message.error(error.message, 3)
      return
    }

    if (data) {
      // 存储用户信息到 store
      userStore.setUser(data)
      message.success('登录成功')
      
      // 跳转到首页
      router.push('/')
    }
  } catch (err: any) {
    message.error(err.message || '登录失败，请重试', 3)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  background: white;
  width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 40px;
}

.logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 32px;
}

:deep(.ant-form-item) {
  margin-bottom: 20px;
}

:deep(.ant-form-item-label > label) {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

:deep(.ant-input),
:deep(.ant-input-password) {
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
}

:deep(.ant-input:focus),
:deep(.ant-input-password .ant-input:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.submit-btn {
  height: 44px;
  background: #667eea;
  border-color: #667eea;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 24px;
}

.submit-btn:hover {
  background: #5568d3;
  border-color: #5568d3;
}

.footer-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;
}

.footer-link a {
  color: #667eea;
  text-decoration: none;
  margin-left: 4px;
}

.footer-link a:hover {
  text-decoration: underline;
}
</style>

