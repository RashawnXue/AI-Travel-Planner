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
  padding: 60px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}
</style>

