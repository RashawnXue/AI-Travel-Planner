<template>
  <div class="accommodation-list">
    <div
      v-for="hotel in accommodationList"
      :key="hotel.day"
      class="accommodation-card"
    >
      <div class="accommodation-day">第 {{ hotel.day }} 天住宿</div>
      <div class="hotel-name">{{ hotel.hotel_name }}</div>
      <div class="hotel-address">
        📍 {{ hotel.address }}
        <button class="nav-btn" @click="handleViewMap(hotel)">查看地图</button>
      </div>
      <div class="hotel-meta">
        <div class="hotel-price">{{ hotel.price_range }}</div>
        <div class="hotel-rating">⭐ {{ hotel.rating }}</div>
      </div>
      <div class="hotel-reason">{{ hotel.reason }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import type { Accommodation } from '@/types/plan'

interface Props {
  accommodationList: Accommodation[]
}

defineProps<Props>()

const handleViewMap = (hotel: Accommodation) => {
  const name = encodeURIComponent(hotel.hotel_name)
  
  // 检测是否为移动设备
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  if (isMobile) {
    // 如果有经纬度，使用经纬度显示位置（更精确）
    if (hotel.longitude && hotel.latitude) {
      window.open(`https://uri.amap.com/marker?position=${hotel.longitude},${hotel.latitude}&name=${name}&src=mypage&coordinate=gaode&callnative=0`)
    } else {
      // 没有经纬度则使用地址
      const address = encodeURIComponent(hotel.address)
      window.open(`https://uri.amap.com/marker?address=${address}&name=${name}`)
    }
  } else {
    // PC端显示提示
    if (hotel.longitude && hotel.latitude) {
      message.info(`坐标: ${hotel.latitude}, ${hotel.longitude} - 建议在移动设备上使用地图功能`)
    } else {
      message.info('请在移动设备上使用地图功能，或手动搜索地址：' + hotel.address)
    }
  }
}
</script>

<style scoped>
.accommodation-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.accommodation-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
}

.accommodation-day {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.hotel-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.hotel-address {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.nav-btn {
  padding: 4px 12px;
  background: white;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: var(--color-primary);
  color: white;
}

.hotel-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.hotel-price {
  font-size: 16px;
  color: var(--color-accent);
  font-weight: 600;
}

.hotel-rating {
  font-size: 14px;
  color: #faad14;
}

.hotel-reason {
  background: #f0f5ff;
  border: 1px solid #adc6ff;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #1a1a1a;
}
</style>

