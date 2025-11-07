<template>
  <div class="confirm-page">
    <div class="confirm-container">
      <div class="logo">
        <img class="logo-img" src="/icon.svg" alt="logo" />
      </div>

      <!-- 加载中状态 -->
      <div v-if="loading" class="status-container">
        <a-spin size="large" />
        <h2>正在验证您的邮箱...</h2>
        <p>请稍候,我们正在处理您的验证请求。</p>
      </div>

      <!-- 成功状态 -->
      <div v-else-if="success" class="status-container success">
        <div class="icon-wrapper success-icon">
          <CheckCircleOutlined />
        </div>
        <h2>邮箱验证成功!</h2>
        <p>您的邮箱已成功验证,{{ countdown }} 秒后将自动跳转到登录页。</p>
        <a-button type="primary" size="large" @click="goToLogin">
          立即登录
        </a-button>
      </div>

      <!-- 错误状态 -->
      <div v-else class="status-container error">
        <div class="icon-wrapper error-icon">
          <CloseCircleOutlined />
        </div>
        <h2>验证失败</h2>
        <p class="error-message">{{ errorMessage }}</p>
        <div class="action-buttons">
          <a-button type="primary" size="large" @click="goToLogin">
            返回登录
          </a-button>
          <a-button size="large" @click="goToRegister">
            重新注册
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { supabase } from '@/utils/supabase'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const success = ref(false)
const errorMessage = ref('')
const countdown = ref(3)

let countdownTimer: number | null = null

onMounted(async () => {
  await verifyEmail()
})

/**
 * 验证邮箱
 */
const verifyEmail = async () => {
  try {
    const tokenHash = route.query.token_hash as string
    const type = route.query.type as string

    if (!tokenHash || !type) {
      throw new Error('缺少验证参数,链接可能已过期或无效')
    }

    // 使用 Supabase 验证 OTP
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as any
    })

    if (error) {
      throw error
    }

    // 验证成功
    success.value = true
    message.success('邮箱验证成功!')

    // 开始倒计时
    startCountdown()
  } catch (err: any) {
    console.error('邮箱验证失败:', err)
    success.value = false
    
    // 根据错误类型显示不同的消息
    if (err.message?.includes('expired')) {
      errorMessage.value = '验证链接已过期,请重新注册或请求新的验证邮件'
    } else if (err.message?.includes('already')) {
      errorMessage.value = '该邮箱已经验证过了,请直接登录'
    } else {
      errorMessage.value = err.message || '验证失败,请稍后重试或联系客服'
    }
  } finally {
    loading.value = false
  }
}

/**
 * 开始倒计时
 */
const startCountdown = () => {
  countdownTimer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer)
      }
      goToLogin()
    }
  }, 1000)
}

/**
 * 跳转到登录页
 */
const goToLogin = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  router.push('/login')
}

/**
 * 跳转到注册页
 */
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.confirm-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f4f8 100%);
}

.confirm-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  width: 520px;
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 48px 60px;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.logo {
  width: 80px;
  height: 80px;
  background: var(--gradient-ocean);
  border-radius: 16px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(30, 136, 229, 0.3);
}

.logo-img {
  width: 60px;
  height: 60px;
  display: block;
}

.status-container {
  text-align: center;
  padding: 20px 0;
}

.icon-wrapper {
  font-size: 64px;
  margin-bottom: 24px;
}

.success-icon {
  color: #52c41a;
}

.error-icon {
  color: #ff4d4f;
}

h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

p {
  font-size: 15px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.error-message {
  color: #ff4d4f;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

:deep(.ant-btn) {
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  min-width: 120px;
}

:deep(.ant-btn-primary) {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

:deep(.ant-btn-primary:hover) {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

:deep(.ant-spin) {
  margin-bottom: 24px;
}
</style>

