<template>
  <div class="create-plan-view">
    <AppHeader />
    
    <div class="content">
      <div class="placeholder">
        <div class="placeholder-icon">🚧</div>
        <h2 class="placeholder-title">创建行程功能开发中</h2>
        <p class="placeholder-text">该功能将在后续版本中实现，敬请期待</p>
        <a-button type="primary" size="large" @click="goBack">返回我的行程</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button as AButton } from 'ant-design-vue'
import AppHeader from '@/components/common/AppHeader.vue'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.create-plan-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  padding-top: 64px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  background: white;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-width: 500px;
}

.placeholder-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.placeholder-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.placeholder-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}
</style>

