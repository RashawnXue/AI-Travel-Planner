<template>
  <section class="overview-section">
    <div class="overview-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="overview-container">
      <div class="main-card">
        <div class="card-header">
          <div class="destination-badge">
            <span class="destination-icon">📍</span>
            <span class="destination-text">{{ plan.destination }}</span>
          </div>
          <div class="travel-dates">
            <span class="date-icon">🗓️</span>
            <span class="date-text">{{ formatDate(plan.start_date) }}</span>
          </div>
        </div>

        <h1 class="detail-title">{{ plan.title }}</h1>
        <p class="plan-summary">{{ plan.summary }}</p>

        <div class="info-grid">
          <div class="info-card">
            <div class="info-card-icon duration">📅</div>
            <div class="info-card-content">
              <div class="info-card-label">行程天数</div>
              <div class="info-card-value">{{ plan.days }} 天</div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card-icon budget">💰</div>
            <div class="info-card-content">
              <div class="info-card-label">总预算</div>
              <div class="info-card-value highlight">¥ {{ formatNumber(plan.budget) }}</div>
            </div>
      </div>

          <div class="info-card">
            <div class="info-card-icon travelers">👥</div>
            <div class="info-card-content">
              <div class="info-card-label">同行人数</div>
              <div class="info-card-value">{{ plan.travelers }} 人</div>
        </div>
        </div>

          <div class="info-card full-width">
            <div class="info-card-icon preferences">🏷️</div>
            <div class="info-card-content">
              <div class="info-card-label">旅行偏好</div>
              <div class="preferences-tags">
                <span 
                  v-for="(preference, index) in plan.preferences" 
                  :key="index"
                  class="preference-tag"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  {{ preference }}
                </span>
        </div>
        </div>
        </div>
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
  position: relative;
  padding: 48px 24px;
  overflow: hidden;
  background: var(--gradient-adventure);
  min-height: 420px;
}

.overview-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: var(--gradient-sunset);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: var(--gradient-tropical);
  bottom: -100px;
  right: -100px;
  animation-delay: 5s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: var(--gradient-paradise);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.overview-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.main-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
              0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.main-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.2),
              0 10px 20px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.destination-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gradient-ocean);
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 4px 15px rgba(30, 136, 229, 0.4);
  animation: slideInLeft 0.6s ease;
}

.destination-icon {
  font-size: 18px;
}

.destination-text {
  letter-spacing: 0.5px;
}

.travel-dates {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 136, 229, 0.1);
  color: var(--color-primary);
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 500;
  font-size: 14px;
  animation: slideInRight 0.6s ease;
}

.date-icon {
  font-size: 16px;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.detail-title {
  font-size: 36px;
  font-weight: 800;
  background: var(--gradient-ocean);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  line-height: 1.2;
  animation: fadeInUp 0.6s ease 0.2s both;
}

.plan-summary {
  font-size: 16px;
  color: #555;
  line-height: 1.8;
  margin-bottom: 32px;
  animation: fadeInUp 0.6s ease 0.3s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-card {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f3ff 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  animation: scaleIn 0.5s ease both;
}

.info-card:nth-child(1) {
  animation-delay: 0.4s;
}

.info-card:nth-child(2) {
  animation-delay: 0.5s;
}

.info-card:nth-child(3) {
  animation-delay: 0.6s;
}

.info-card:nth-child(4) {
  animation-delay: 0.7s;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.info-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: 0 8px 24px rgba(30, 136, 229, 0.2);
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.info-card-icon {
  font-size: 32px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  flex-shrink: 0;
}

.info-card-icon.duration {
  background: var(--gradient-sky);
  box-shadow: 0 4px 15px rgba(66, 165, 245, 0.4);
}

.info-card-icon.budget {
  background: var(--gradient-sunset);
  box-shadow: 0 4px 15px rgba(255, 111, 60, 0.4);
}

.info-card-icon.travelers {
  background: var(--gradient-tropical);
  box-shadow: 0 4px 15px rgba(38, 198, 218, 0.4);
}

.info-card-icon.preferences {
  background: var(--gradient-paradise);
  box-shadow: 0 4px 15px rgba(255, 123, 156, 0.4);
}

.info-card-content {
  flex: 1;
  min-width: 0;
}

.info-card-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
  font-weight: 600;
}

.info-card-value {
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 700;
}

.info-card-value.highlight {
  background: var(--gradient-sunset);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
}

.preferences-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preference-tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--gradient-ocean);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
  transition: all 0.3s ease;
  animation: tagFadeIn 0.5s ease both;
}

@keyframes tagFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.preference-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 136, 229, 0.4);
}

@media (max-width: 768px) {
  .overview-section {
    padding: 32px 16px;
  }

  .main-card {
    padding: 28px 20px;
  }

  .detail-title {
    font-size: 28px;
  }

  .plan-summary {
    font-size: 14px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .info-card {
    padding: 20px;
  }

  .info-card-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .info-card-value {
    font-size: 18px;
  }

  .info-card-value.highlight {
    font-size: 20px;
  }
}
</style>

