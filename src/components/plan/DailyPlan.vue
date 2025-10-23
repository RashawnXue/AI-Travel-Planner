<template>
  <div class="daily-plan-container">
    <div class="day-list">
      <div
        v-for="(dailyPlan, index) in dailyPlans"
        :key="dailyPlan.day"
        class="day-item"
        :class="{ active: currentDay === index }"
        @click="currentDay = index"
      >
        <div class="day-number">第 {{ dailyPlan.day }} 天</div>
        <div class="day-title">{{ dailyPlan.title }}</div>
        <div class="day-count">{{ dailyPlan.activities.length }} 个活动</div>
      </div>
    </div>

    <div class="activity-timeline">
      <div
        v-for="(activity, index) in currentDayActivities"
        :key="index"
        class="activity-card"
      >
        <div class="activity-time">{{ activity.time }}</div>
        <div class="activity-dot"></div>
        <div v-if="index < currentDayActivities.length - 1" class="activity-line"></div>
        <div class="activity-content">
          <h3 class="activity-title">{{ activity.title }}</h3>
          <div class="activity-location">
            <div class="activity-location-text">
              <div class="location-name">📍 {{ activity.location }}</div>
              <div class="location-address">{{ activity.address }}</div>
            </div>
            <button class="nav-btn" @click="handleNavigation(activity)">导航</button>
          </div>
          <div class="activity-meta">
            <span>⏱️ {{ activity.duration }} 分钟</span>
            <span>💴 ¥ {{ formatNumber(activity.estimated_cost) }}</span>
          </div>
          <div class="activity-desc">{{ activity.description }}</div>
          <div v-if="activity.tips" class="activity-tip">
            💡 {{ activity.tips }}
          </div>
        </div>
      </div>

      <div class="day-total">
        当日预计花费: ¥ {{ formatNumber(dayTotalCost) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { DailyPlan, Activity } from '@/types/plan'

interface Props {
  dailyPlans: DailyPlan[]
}

const props = defineProps<Props>()

const currentDay = ref(0)

const currentDayActivities = computed(() => {
  if (props.dailyPlans.length === 0) return []
  return props.dailyPlans[currentDay.value]?.activities || []
})

const dayTotalCost = computed(() => {
  return currentDayActivities.value.reduce((sum, activity) => {
    return sum + (activity.estimated_cost || 0)
  }, 0)
})

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const handleNavigation = (activity: Activity) => {
  // 这里应该调用高德地图API获取坐标，然后打开导航
  // 暂时简化处理
  const address = encodeURIComponent(activity.address)
  const name = encodeURIComponent(activity.location)
  
  // 检测是否为移动设备
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  if (isMobile) {
    // 移动端直接打开高德地图App
    window.open(`https://uri.amap.com/marker?address=${address}&name=${name}`)
  } else {
    // PC端显示提示
    message.info('请在移动设备上使用导航功能，或手动搜索地址：' + activity.address)
  }
}
</script>

<style scoped>
.daily-plan-container {
  display: flex;
  gap: 24px;
}

.day-list {
  width: 160px;
  border-right: 1px solid #e8e8e8;
  padding-right: 16px;
}

.day-item {
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.day-item:hover {
  background: #f5f5f5;
}

.day-item.active {
  background: #e6f7ff;
}

.day-number {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.day-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.day-count {
  font-size: 12px;
  color: #999;
}

.activity-timeline {
  flex: 1;
}

.activity-card {
  position: relative;
  padding-left: 48px;
  margin-bottom: 32px;
}

.activity-time {
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.activity-dot {
  position: absolute;
  left: 32px;
  top: 6px;
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  border: 3px solid #e6f7ff;
}

.activity-line {
  position: absolute;
  left: 37px;
  top: 20px;
  bottom: -32px;
  width: 2px;
  background: #e8e8e8;
}

.activity-content {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.activity-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.activity-location {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.activity-location-text {
  flex: 1;
}

.location-name {
  font-size: 14px;
  color: #1a1a1a;
}

.location-address {
  font-size: 12px;
  color: #999;
}

.nav-btn {
  padding: 4px 12px;
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: #667eea;
  color: white;
}

.activity-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.activity-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 12px;
}

.activity-tip {
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 12px;
  color: #d46b08;
}

.day-total {
  text-align: right;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 24px;
  font-size: 16px;
  color: #ff4d4f;
  font-weight: 600;
}

@media (max-width: 768px) {
  .daily-plan-container {
    flex-direction: column;
  }

  .day-list {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 16px;
    padding-right: 0;
    display: flex;
    overflow-x: auto;
    gap: 8px;
  }

  .day-item {
    min-width: 120px;
    margin-bottom: 0;
  }
}
</style>

