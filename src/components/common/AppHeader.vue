<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo"><img class="logo-img" src="/icon.svg" alt="logo" /></div>
      <div class="header-title">AI 旅行规划师</div>
      <nav class="header-nav">
        <router-link to="/" class="nav-link" active-class="active">我的行程</router-link>
        <router-link to="/create" class="nav-link" active-class="active">创建行程</router-link>
      </nav>
    </div>
    <div class="header-right">
      <button class="api-key-btn" @click="openApiKeyModal" :class="{ 'has-key': hasApiKey }">
        <span class="btn-icon">🔑</span>
        <span class="btn-text">{{ hasApiKey ? 'API密钥已配置' : '配置API密钥' }}</span>
      </button>
      <div class="user-avatar" @click="toggleDropdown">{{ userInitial }}</div>
      <div class="user-name" @click="toggleDropdown">{{ username }}</div>
      <div v-show="showDropdown" class="user-dropdown">
        <div class="dropdown-item" @click="goToProfile">个人中心</div>
        <div class="dropdown-item danger" @click="handleLogout">退出登录</div>
      </div>
    </div>
  </header>
  
  <!-- API Key 配置弹窗 -->
  <Modal
    v-model:open="showApiKeyModal"
    title="配置百炼 API 密钥"
    ok-text="保存"
    cancel-text="取消"
    @ok="handleSaveApiKey"
  >
    <div class="api-key-modal-content">
      <p class="modal-description">
        💡 请输入您的阿里云百炼 API Key，用于 AI 行程规划和语音识别功能。
      </p>
      <a-input
        v-model:value="apiKeyInput"
        placeholder="请输入 API Key（例如：sk-xxxxxxxxxxxxxxxx）"
        size="large"
        :status="apiKeyError ? 'error' : ''"
      />
      <p v-if="apiKeyError" class="error-message">{{ apiKeyError }}</p>
      <div class="modal-tips">
        <p class="tip-title">📌 如何获取 API Key：</p>
        <ol class="tip-list">
          <li>访问阿里云百炼控制台</li>
          <li>进入 API Key 管理页面</li>
          <li>创建或复制您的 API Key</li>
        </ol>
        <p class="tip-note">
          <strong>注意：</strong>API Key 将存储在本地浏览器中，请勿泄露给他人。
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal, Input as AInput } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { logout as logoutApi } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()

const showDropdown = ref(false)
const showApiKeyModal = ref(false)
const apiKeyInput = ref('')
const apiKeyError = ref('')

const username = computed(() => userStore.username || '用户')
const userInitial = computed(() => {
  const name = userStore.username || '用'
  return name.charAt(0).toUpperCase()
})
const hasApiKey = computed(() => userStore.hasApiKey)

// 打开弹窗时加载已有的 API Key
const openApiKeyModal = () => {
  apiKeyInput.value = userStore.apiKey || ''
  apiKeyError.value = ''
  showApiKeyModal.value = true
}

const handleSaveApiKey = () => {
  const key = apiKeyInput.value.trim()
  
  if (!key) {
    apiKeyError.value = '请输入 API Key'
    return
  }
  
  if (key.length < 10) {
    apiKeyError.value = 'API Key 格式不正确，请检查后重新输入'
    return
  }
  
  userStore.setApiKey(key)
  message.success('API Key 配置成功')
  showApiKeyModal.value = false
  apiKeyInput.value = ''
  apiKeyError.value = ''
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const goToProfile = () => {
  showDropdown.value = false
  message.info('个人中心功能即将开放')
}

const handleLogout = () => {
  showDropdown.value = false
  
  Modal.confirm({
    title: '提示',
    content: '确定要退出登录吗？',
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      const { error } = await logoutApi()
      
      if (error) {
        message.error('退出失败，请重试')
        return
      }
      
      userStore.clearUser()
      message.success('已退出登录')
      router.push('/login')
    }
  })
}

// 点击其他地方关闭下拉菜单
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.header-right')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  height: 64px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  width: 32px;
  height: 32px;
  background: var(--gradient-ocean);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.3);
}

.logo-img {
  width: 20px;
  height: 20px;
  display: block;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.header-nav {
  display: flex;
  gap: 32px;
  margin-left: 48px;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  padding: 4px 8px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-primary);
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.api-key-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.api-key-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.api-key-btn.has-key {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  box-shadow: 0 2px 6px rgba(82, 196, 26, 0.3);
}

.api-key-btn.has-key:hover {
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.4);
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  white-space: nowrap;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: var(--gradient-ocean);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.4);
}

.user-name {
  color: #1a1a1a;
  font-size: 14px;
  cursor: pointer;
}

.user-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.danger {
  color: #ff4d4f;
}

.api-key-modal-content {
  padding: 8px 0;
}

.modal-description {
  margin-bottom: 16px;
  color: #666;
  line-height: 1.6;
  background: #f0f5ff;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
}

.error-message {
  color: #ff4d4f;
  font-size: 13px;
  margin-top: 8px;
  margin-bottom: 0;
}

.modal-tips {
  margin-top: 20px;
  padding: 12px;
  background: #fffbe6;
  border-radius: 6px;
  border-left: 3px solid #faad14;
}

.tip-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.tip-list {
  margin: 8px 0 12px 20px;
  color: #666;
  line-height: 1.8;
}

.tip-list li {
  margin-bottom: 4px;
}

.tip-note {
  color: #666;
  font-size: 13px;
  margin-bottom: 0;
  line-height: 1.6;
}

.tip-note strong {
  color: #d4380d;
}

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }
}
</style>

