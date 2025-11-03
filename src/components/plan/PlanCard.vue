<template>
  <div 
    class="plan-card" 
    :class="{ active: isActive }"
    @click="$emit('click')"
    @contextmenu.prevent="$emit('contextmenu', $event)"
  >
    <div class="plan-title">{{ plan.title }}</div>
    <div class="plan-meta">{{ plan.destination }} · {{ plan.days }}天</div>
    <div class="plan-date">{{ formatDate(plan.start_date) }} 出发</div>
    <div class="plan-budget">¥{{ formatNumber(plan.budget) }}</div>
    <div class="plan-time">{{ formatCreatedTime(plan.created_at) }}创建</div>
  </div>
</template>

<script setup lang="ts">
import type { PlanListItem } from '@/types/plan'

interface Props {
  plan: PlanListItem
  isActive?: boolean
}

defineProps<Props>()

defineEmits<{
  click: []
  contextmenu: [event: MouseEvent]
}>()

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

// 格式化创建时间
const formatCreatedTime = (dateStr: string) => {
  const now = new Date()
  const created = new Date(dateStr)
  const diff = now.getTime() - created.getTime()
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '1天前'
  } else if (days < 7) {
    return `${days}天前`
  } else if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks}周前`
  } else if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months}个月前`
  } else {
    const years = Math.floor(days / 365)
    return `${years}年前`
  }
}
</script>

<style scoped>
.plan-card {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.plan-card:hover {
  background: rgba(30, 136, 229, 0.03);
  border-left: 3px solid var(--color-primary);
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.1);
}

.plan-card.active {
  background: rgba(30, 136, 229, 0.06);
  border-left: 3px solid var(--color-primary);
  box-shadow: 0 2px 12px rgba(30, 136, 229, 0.15);
}

.plan-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.plan-meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.plan-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.plan-budget {
  font-size: 14px;
  color: var(--color-accent);
  font-weight: 600;
}

.plan-time {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
</style>

