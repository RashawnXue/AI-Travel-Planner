<template>
  <section class="overview-section">
    <div class="overview-container">
      <div class="overview-left">
        <h1 class="detail-title">{{ plan.title }}</h1>
        <p class="plan-summary">{{ plan.summary }}</p>
      </div>
      <div class="overview-right">
        <div class="info-item">
          <div class="info-icon">📍</div>
          <div class="info-label">目的地</div>
          <div class="info-value">{{ plan.destination }}</div>
        </div>
        <div class="info-item">
          <div class="info-icon">📅</div>
          <div class="info-label">行程</div>
          <div class="info-value">{{ plan.days }} 天</div>
        </div>
        <div class="info-item">
          <div class="info-icon">🗓️</div>
          <div class="info-label">出发</div>
          <div class="info-value">{{ formatDate(plan.start_date) }}</div>
        </div>
        <div class="info-item">
          <div class="info-icon">💰</div>
          <div class="info-label">预算</div>
          <div class="info-value highlight">¥ {{ formatNumber(plan.budget) }}</div>
        </div>
        <div class="info-item">
          <div class="info-icon">👥</div>
          <div class="info-label">同行</div>
          <div class="info-value">{{ plan.travelers }} 人</div>
        </div>
        <div class="info-item">
          <div class="info-icon">🏷️</div>
          <div class="info-label">偏好</div>
          <div class="info-value">{{ plan.preferences.join(', ') }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TravelPlan } from '@/types/plan'

interface Props {
  plan: TravelPlan
}

defineProps<Props>()

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}
</script>

<style scoped>
.overview-section {
  background: #fafafa;
  padding: 32px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.overview-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 48px;
}

.overview-left {
  flex: 1;
}

.detail-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.plan-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.overview-right {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.info-label {
  font-size: 12px;
  color: #999;
}

.info-value {
  font-size: 16px;
  color: #1a1a1a;
}

.info-value.highlight {
  color: #ff4d4f;
  font-weight: 600;
}

@media (max-width: 768px) {
  .overview-container {
    flex-direction: column;
    gap: 24px;
  }
}
</style>

