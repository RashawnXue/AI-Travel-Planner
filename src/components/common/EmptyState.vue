<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <div class="empty-text">{{ text }}</div>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  text?: string
}

withDefaults(defineProps<Props>(), {
  icon: '📋',
  text: '暂无数据'
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 96px;
  margin-bottom: 24px;
  opacity: 0.9;
  filter: grayscale(0.2);
  animation: gentle-bounce 2s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.empty-text {
  font-size: 15px;
  color: #999;
  margin-bottom: 16px;
  font-weight: 400;
  letter-spacing: 0.3px;
}
</style>

