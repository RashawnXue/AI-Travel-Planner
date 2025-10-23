<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo">✈️</div>
      <div class="header-title">AI 旅行规划师</div>
      <nav class="header-nav">
        <router-link to="/" class="nav-link" active-class="active">我的行程</router-link>
        <router-link to="/create" class="nav-link" active-class="active">创建行程</router-link>
      </nav>
    </div>
    <div class="header-right">
      <div class="user-avatar" @click="toggleDropdown">{{ userInitial }}</div>
      <div class="user-name" @click="toggleDropdown">{{ username }}</div>
      <div v-show="showDropdown" class="user-dropdown">
        <div class="dropdown-item" @click="goToProfile">个人中心</div>
        <div class="dropdown-item danger" @click="handleLogout">退出登录</div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { logout as logoutApi } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()

const showDropdown = ref(false)

const username = computed(() => userStore.username || '用户')
const userInitial = computed(() => {
  const name = userStore.username || '用'
  return name.charAt(0).toUpperCase()
})

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
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
  color: #667eea;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
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

@media (max-width: 768px) {
  .header-nav {
    display: none;
  }
}
</style>

