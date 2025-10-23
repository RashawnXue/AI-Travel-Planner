<template>
  <div>
    <div class="transport-overview">
      <div class="transport-overview-title">交通概述</div>
      <div class="transport-overview-content">{{ transportation.overview }}</div>
    </div>

    <div class="transport-list">
      <div
        v-for="(item, index) in transportation.details"
        :key="index"
        class="transport-card"
      >
        <div class="transport-type" :class="getTypeClass(item.type)">
          {{ getTypeIcon(item.type) }} {{ item.type }}
        </div>
        <div class="transport-route">{{ item.route }}</div>
        <div class="transport-cost">¥ {{ formatNumber(item.estimated_cost) }}</div>
      </div>
    </div>

    <div class="transport-total">
      交通费用总计: ¥ {{ formatNumber(totalCost) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Transportation } from '@/types/plan'

interface Props {
  transportation: Transportation
}

const props = defineProps<Props>()

const totalCost = computed(() => {
  return props.transportation.details.reduce((sum, item) => {
    return sum + (item.estimated_cost || 0)
  }, 0)
})

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const getTypeIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    '飞机': '✈️',
    '火车': '🚄',
    '地铁': '🚇',
    '公交': '🚌',
    '出租车': '🚕',
    '自驾': '🚗'
  }
  return iconMap[type] || '🚗'
}

const getTypeClass = (type: string) => {
  const classMap: Record<string, string> = {
    '飞机': 'flight',
    '火车': 'train',
    '地铁': 'metro',
    '公交': 'bus'
  }
  return classMap[type] || 'other'
}
</script>

<style scoped>
.transport-overview {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.transport-overview-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.transport-overview-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.transport-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.transport-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.transport-type {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.transport-type.flight {
  background: #e6f7ff;
  color: #1890ff;
}

.transport-type.train {
  background: #f6ffed;
  color: #52c41a;
}

.transport-type.metro {
  background: #fff7e6;
  color: #fa8c16;
}

.transport-type.bus {
  background: #fff1f0;
  color: #f5222d;
}

.transport-type.other {
  background: #f5f5f5;
  color: #666;
}

.transport-route {
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
}

.transport-cost {
  font-size: 16px;
  color: #ff4d4f;
  font-weight: 600;
}

.transport-total {
  text-align: right;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 18px;
  color: #ff4d4f;
  font-weight: 600;
}
</style>

