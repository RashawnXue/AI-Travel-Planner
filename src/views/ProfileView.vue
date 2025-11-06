<template>
  <div class="profile-view">
    <AppHeader />
    
    <!-- 装饰背景元素 -->
    <div class="decor-orb orb-1"></div>
    <div class="decor-orb orb-2"></div>
    <div class="decor-orb orb-3"></div>

    <div class="main-container">
      <div class="page-card">
        <!-- 顶部 Hero 信息区 -->
        <div class="page-hero">
          <div class="hero-icon-wrapper">
            <div class="user-avatar-large">{{ userInitial }}</div>
          </div>
          <h1 class="page-title">
            <span class="title-gradient">{{ userStore.username || '用户' }}</span>
          </h1>
          <p class="page-subtitle">{{ userStore.email }}</p>
          
          <!-- 统计信息 -->
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-icon">📅</div>
              <div class="stat-value">{{ planStore.planList.length }}</div>
              <div class="stat-label">创建的行程</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">💰</div>
              <div class="stat-value">{{ expenseStore.expenseList.length }}</div>
              <div class="stat-label">支出记录</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">🔑</div>
              <div class="stat-value">{{ userStore.hasApiKey ? '已配置' : '未配置' }}</div>
              <div class="stat-label">API 密钥</div>
            </div>
          </div>
        </div>

        <!-- 基本信息区 -->
        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">ℹ️</span>
              基本信息
            </h2>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">用户名</div>
              <div class="info-value">{{ userStore.username || '未设置' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">邮箱地址</div>
              <div class="info-value">{{ userStore.email }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">用户 ID</div>
              <div class="info-value id-value">{{ userStore.id }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">API 密钥状态</div>
              <div class="info-value">
                <span v-if="userStore.hasApiKey" class="status-badge success">
                  ✓ 已配置
                </span>
                <span v-else class="status-badge warning">
                  ⚠ 未配置
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 修改密码区 -->
        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">🔐</span>
              修改密码
            </h2>
          </div>
          
          <p class="section-desc">
            为了您的账户安全，建议定期更换密码。密码长度至少为 6 个字符。
          </p>
          
          <a-form
            :model="passwordForm"
            :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }"
            @finish="handleChangePassword"
            class="password-form"
          >
            <a-form-item
              label="当前密码"
              name="currentPassword"
              :rules="[{ required: true, message: '请输入当前密码' }]"
            >
              <a-input-password
                v-model:value="passwordForm.currentPassword"
                placeholder="请输入当前密码"
                size="large"
                :disabled="isChangingPassword"
              />
            </a-form-item>

            <a-form-item
              label="新密码"
              name="newPassword"
              :rules="[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码至少 6 个字符' }
              ]"
            >
              <a-input-password
                v-model:value="passwordForm.newPassword"
                placeholder="请输入新密码（至少6个字符）"
                size="large"
                :disabled="isChangingPassword"
              />
            </a-form-item>

            <a-form-item
              label="确认新密码"
              name="confirmPassword"
              :rules="[
                { required: true, message: '请确认新密码' },
                { validator: validateConfirmPassword }
              ]"
            >
              <a-input-password
                v-model:value="passwordForm.confirmPassword"
                placeholder="请再次输入新密码"
                size="large"
                :disabled="isChangingPassword"
              />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 24 }">
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                :loading="isChangingPassword"
                class="submit-btn"
              >
                {{ isChangingPassword ? '修改中...' : '修改密码' }}
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- 返回按钮 -->
        <div class="back-section">
          <router-link to="/" class="back-link">
            <span class="back-icon">←</span>
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message, Form as AForm, FormItem as AFormItem, InputPassword as AInputPassword, Button as AButton } from 'ant-design-vue'
import AppHeader from '@/components/common/AppHeader.vue'
import { useUserStore } from '@/stores/user'
import { usePlanStore } from '@/stores/plan'
import { useExpenseStore } from '@/stores/expense'
import { supabase } from '@/utils/supabase'

const userStore = useUserStore()
const planStore = usePlanStore()
const expenseStore = useExpenseStore()

// 加载数据
onMounted(async () => {
  await planStore.fetchPlanList()
})

const userInitial = computed(() => {
  const name = userStore.username || userStore.email || '用'
  return name.charAt(0).toUpperCase()
})

// 密码表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isChangingPassword = ref(false)

// 验证确认密码
const validateConfirmPassword = (_rule: unknown, value: string) => {
  if (value && value !== passwordForm.value.newPassword) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

// 修改密码
const handleChangePassword = async () => {
  isChangingPassword.value = true
  
  try {
    // 先验证当前密码（通过尝试重新登录）
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userStore.email!,
      password: passwordForm.value.currentPassword
    })
    
    if (signInError) {
      message.error('当前密码不正确')
      return
    }
    
    // 更新密码
    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordForm.value.newPassword
    })
    
    if (updateError) {
      throw updateError
    }
    
    message.success('密码修改成功！')
    
    // 清空表单
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('密码修改失败:', error)
    const err = error as Error
    message.error(err.message || '密码修改失败，请重试')
  } finally {
    isChangingPassword.value = false
  }
}
</script>

<style scoped>
/* ==================== 基础布局 ==================== */
.profile-view {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding-top: 64px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 装饰背景球 */
.decor-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--gradient-ocean);
  top: -100px;
  right: -100px;
  animation: float-orb 20s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--gradient-tropical);
  bottom: -100px;
  left: -100px;
  animation: float-orb 25s ease-in-out infinite reverse;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: var(--gradient-sunset);
  top: 40%;
  left: 30%;
  animation: float-orb 30s ease-in-out infinite;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}

.main-container {
  max-width: 900px;
  margin: 40px auto 80px;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.page-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 48px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  /* 使卡片在视窗内可滚动 */
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ==================== Hero 区域 ==================== */
.page-hero {
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 2px solid rgba(30, 136, 229, 0.1);
}

.hero-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.user-avatar-large {
  width: 100px;
  height: 100px;
  background: var(--gradient-ocean);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: 700;
  box-shadow: 
    0 8px 24px rgba(30, 136, 229, 0.3),
    0 0 0 4px rgba(255, 255, 255, 0.5);
  animation: pulse-avatar 3s ease-in-out infinite;
}

@keyframes pulse-avatar {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 8px 24px rgba(30, 136, 229, 0.3),
      0 0 0 4px rgba(255, 255, 255, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 
      0 12px 32px rgba(30, 136, 229, 0.4),
      0 0 0 6px rgba(255, 255, 255, 0.6);
  }
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.title-gradient {
  background: var(--gradient-ocean);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 15px;
  color: #666;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

/* 统计行 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 32px;
}

.stat-item {
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.05) 0%, rgba(38, 198, 218, 0.05) 100%);
  border: 1px solid rgba(30, 136, 229, 0.1);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
}

.stat-item:hover {
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.08) 0%, rgba(38, 198, 218, 0.08) 100%);
  border-color: rgba(30, 136, 229, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(30, 136, 229, 0.1);
}

.stat-item .stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.stat-item .stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat-item .stat-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

/* ==================== 区块容器 ==================== */
.section-wrapper {
  margin-bottom: 40px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  font-size: 24px;
}

.section-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 24px 0;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.05) 0%, rgba(38, 198, 218, 0.05) 100%);
  border-left: 4px solid var(--travel-ocean-blue);
  border-radius: 8px;
}

/* ==================== 信息网格 ==================== */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.info-item {
  background: white;
  border: 2px solid rgba(30, 136, 229, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.info-item:hover {
  border-color: rgba(30, 136, 229, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.08);
}

.info-label {
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.info-value {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 500;
  word-break: break-all;
}

.id-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #666;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.success {
  background: linear-gradient(135deg, rgba(82, 196, 26, 0.15) 0%, rgba(56, 158, 13, 0.15) 100%);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.3);
}

.status-badge.warning {
  background: linear-gradient(135deg, rgba(250, 173, 20, 0.15) 0%, rgba(250, 140, 22, 0.15) 100%);
  color: #fa8c16;
  border: 1px solid rgba(250, 173, 20, 0.3);
}

/* ==================== 表单样式 ==================== */
.password-form :deep(.ant-form-item) {
  margin-bottom: 24px;
}

.password-form :deep(.ant-form-item-label > label) {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.password-form :deep(.ant-input-affix-wrapper),
.password-form :deep(.ant-input) {
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s;
}

.password-form :deep(.ant-input-affix-wrapper:focus),
.password-form :deep(.ant-input-affix-wrapper-focused),
.password-form :deep(.ant-input:focus) {
  border-color: var(--travel-ocean-blue);
  box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.1);
}

.password-form :deep(.ant-input-affix-wrapper:hover),
.password-form :deep(.ant-input:hover) {
  border-color: var(--travel-ocean-blue-light);
}

.submit-btn {
  width: 100%;
  height: 50px;
  background: var(--gradient-ocean);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(30, 136, 229, 0.3);
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(30, 136, 229, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

/* ==================== 返回按钮 ==================== */
.back-section {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 2px solid rgba(30, 136, 229, 0.1);
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: white;
  color: var(--travel-ocean-blue);
  text-decoration: none;
  border: 2px solid rgba(30, 136, 229, 0.2);
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
}

.back-link:hover {
  background: var(--gradient-ocean);
  color: white;
  border-color: transparent;
  transform: translateX(-4px);
  box-shadow: 0 4px 16px rgba(30, 136, 229, 0.3);
}

.back-icon {
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s;
}

.back-link:hover .back-icon {
  transform: translateX(-2px);
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .main-container {
    padding: 0;
    margin: 24px 0 60px;
  }
  
  .page-card {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding: 32px 24px;
  }
  
  .user-avatar-large {
    width: 80px;
    height: 80px;
    font-size: 34px;
  }
  
  .page-title {
    font-size: 26px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-item {
    padding: 16px;
  }
  
  .stat-item .stat-icon {
    font-size: 28px;
  }
  
  .stat-item .stat-value {
    font-size: 20px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .section-icon {
    font-size: 22px;
  }
  
  .back-section {
    margin-top: 32px;
    padding-top: 24px;
  }
}
</style>
