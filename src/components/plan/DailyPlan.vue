<template>
  <div class="daily-plan-wrapper">
    <!-- 行程地图 -->
    <div class="map-container">
      <!-- 高德地图容器 -->
      <div id="amap-container" ref="mapContainer" class="amap-container"></div>
      
      <!-- 地图加载提示 -->
      <div v-if="mapLoading" class="map-loading">
        <div class="loading-spinner"></div>
        <div>加载地图中...</div>
      </div>
      
      <!-- 地图图例 -->
      <div class="map-legend">
        <div class="legend-item">
          <div class="legend-dot start"></div>
          <span>起点</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot middle"></div>
          <span>景点</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot end"></div>
          <span>住宿</span>
        </div>
        <div class="legend-item overlap-hint">
          <div class="legend-dot overlapped">
            <span class="mini-badge">⚠</span>
          </div>
          <span>坐标重叠</span>
          <div class="legend-tooltip">
            <div class="tooltip-icon">ℹ️</div>
            <div class="tooltip-content">
              当多个地点位置相同时，系统会自动将标记点分散显示（约88米间隔），并用黄色边框和警告标记提示。
            </div>
          </div>
        </div>
      </div>
    </div>

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
          <div class="activity-time">{{ formatTime(activity.time) }}</div>
          <div class="activity-dot"></div>
          <div v-if="index < currentDayActivities.length - 1" class="activity-line"></div>
          <div class="activity-content">
            <div class="activity-info">
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
            <div v-if="activity.photo" class="activity-photo-wrapper">
              <img
                :src="activity.photo"
                :alt="activity.title"
                class="activity-photo"
              />
            </div>
          </div>
        </div>

        <div class="day-total">
          当日预计花费: ¥ {{ formatNumber(dayTotalCost) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import type { DailyPlan, Activity, Accommodation } from '@/types/plan'
import { createMap, addMarker, addBezierCurve, fitView, createSmoothPath } from '@/utils/amap'

interface Props {
  dailyPlans: DailyPlan[]
  accommodation?: Accommodation[]
}

const props = defineProps<Props>()

const currentDay = ref(0)
const mapContainer = ref<HTMLElement>()
const mapInstance = ref<any>(null)
const mapLoading = ref(true)
const markers = ref<any[]>([])
const polylines = ref<any[]>([])

// 当前天数的行程
const currentDayPlans = computed(() => {
  if (props.dailyPlans.length === 0) return null
  return props.dailyPlans[currentDay.value] || null
})

const currentDayActivities = computed(() => {
  if (props.dailyPlans.length === 0) return []
  return props.dailyPlans[currentDay.value]?.activities || []
})

const dayTotalCost = computed(() => {
  return currentDayActivities.value.reduce((sum, activity) => {
    return sum + (activity.estimated_cost || 0)
  }, 0)
})

// 初始化地图
const initMap = async () => {
  if (!mapContainer.value) return

  try {
    mapLoading.value = true

    // 创建地图实例
    mapInstance.value = await createMap(mapContainer.value, {
      zoom: 12,
      animateEnable: true, // 开启动画
      jogEnable: false, // 关闭惯性拖拽，让移动更精确
      pitchEnable: false, // 关闭倾斜，提升性能
      rotateEnable: false // 关闭旋转，提升性能
    })

    // 渲染当前天的路线
    await renderDayRoute()

    mapLoading.value = false
  } catch (error) {
    console.error('地图初始化失败:', error)
    message.error('地图加载失败，请刷新页面重试')
    mapLoading.value = false
  }
}

// 清除地图上的标记和路线
const clearMapOverlays = () => {
  // 清除标记
  markers.value.forEach(marker => {
    marker.setMap(null)
  })
  markers.value = []

  // 清除路线
  polylines.value.forEach(polyline => {
    polyline.setMap(null)
  })
  polylines.value = []
}

// 渲染当天的路线
const renderDayRoute = async () => {
  if (!mapInstance.value) return

  // 清除之前的标记和路线
  clearMapOverlays()

  const activities = currentDayActivities.value
  const currentDayNumber = currentDayPlans.value?.day || 1

  // 过滤出有经纬度的活动
  const validActivities = activities.filter(
    (activity) => activity.longitude && activity.latitude
  )

  // 获取当天的住宿信息
  const todayAccommodation = props.accommodation?.find(
    (acc) => acc.day === currentDayNumber
  )

  // 检查是否有数据可显示
  if (validActivities.length === 0 && !todayAccommodation?.longitude) {
    message.warning('当前行程暂无地理位置信息')
    return
  }

  // 用于收集所有点位，用于自适应显示
  const allPoints: Array<[number, number]> = []
  // 用于记录每个活动的实际显示位置（包含偏移）
  const activityPositions: Array<[number, number]> = []
  
  // 用于检测和处理重复坐标的Map
  const positionMap = new Map<string, number>()

  // 1. 添加所有活动标记点
  for (let i = 0; i < validActivities.length; i++) {
    const activity = validActivities[i]!
    const originalPosition: [number, number] = [activity.longitude!, activity.latitude!]
    
    // 生成位置的唯一键
    const posKey = `${activity.longitude},${activity.latitude}`
    
    // 检查是否有重复坐标
    let position: [number, number] = originalPosition
    const duplicateCount = positionMap.get(posKey) || 0
    
    if (duplicateCount > 0) {
      // 使用圆形分布算法，将重复的标记点围绕原点呈圆形分布
      const radius = 0.0008 // 约88米的半径
      const angle = (duplicateCount * (360 / (duplicateCount + 1))) * (Math.PI / 180) // 转换为弧度
      
      position = [
        originalPosition[0] + radius * Math.cos(angle),
        originalPosition[1] + radius * Math.sin(angle)
      ]
    }
    
    // 更新该位置的重复计数
    positionMap.set(posKey, duplicateCount + 1)
    const hasDuplicate = duplicateCount > 0
    
    activityPositions.push(position)
    allPoints.push(position)

    // 创建活动标记内容（起点用绿色，其他用紫色数字）
    // 如果有重复，添加特殊样式和警告标记
    const markerContent = `
      <div class="custom-marker ${i === 0 ? 'start' : 'middle'} ${hasDuplicate ? 'overlapped' : ''}" ${hasDuplicate ? 'title="⚠️ 坐标重叠：此地点与其他地点位置相同，已自动分散显示"' : ''}>
        <div class="marker-number">${i + 1}</div>
        ${hasDuplicate ? '<div class="overlap-badge" title="坐标重叠提示">⚠</div>' : ''}
      </div>
    `

    const marker = await addMarker(mapInstance.value, position, {
      content: markerContent,
      title: activity.location,
      offset: [-15, -15]
    })

    // 点击标记显示活动信息
    marker.on('click', () => {
      // 生成唯一ID用于定位元素
      const contentId = `info-content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const infoContent = `
        <div class="info-window">
          <div class="info-window-content" id="${contentId}">
            ${activity.photo ? `<img src="${activity.photo}" alt="${activity.title}" class="info-photo" />` : ''}
            <h4>${activity.title}</h4>
            <p><strong>时间:</strong> ${formatTime(activity.time)}</p>
            <p><strong>地点:</strong> ${activity.location}</p>
            <p><strong>地址:</strong> ${activity.address}</p>
            <p><strong>时长:</strong> ${activity.duration} 分钟</p>
            <p><strong>费用:</strong> ¥${formatNumber(activity.estimated_cost)}</p>
            ${activity.tips ? `<p class="tips">💡 ${activity.tips}</p>` : ''}
          </div>
        </div>
      `
      const infoWindow = new window.AMap.InfoWindow({
        content: infoContent,
        offset: new window.AMap.Pixel(0, -30),
        isCustom: false, // 使用默认样式，支持点击外部关闭
        closeWhenClickMap: true, // 点击地图时关闭
        autoMove: true, // 自动平移地图以显示信息窗
        avoid: [20, 20, 20, 20] // 设置信息窗与地图边界的最小距离（上右下左）
      })
      
      // 使用平滑动画打开信息窗
      // 先平滑移动地图中心到标记位置
      mapInstance.value.panTo(position, 300) // 300ms 的平滑动画
      
      // 等待地图移动完成后再打开信息窗
      setTimeout(() => {
        infoWindow.open(mapInstance.value, position)
      }, 320)
      
      // 监听信息窗打开事件，添加滚动阻止逻辑
      infoWindow.on('open', () => {
        // 使用 setTimeout 确保 DOM 已渲染
        setTimeout(() => {
          const contentEl = document.getElementById(contentId)
          if (contentEl) {
            // 定义滚动处理函数
            const handleWheel = (e: WheelEvent) => {
              e.stopPropagation()
              // 检查是否到达边界
              const atTop = contentEl.scrollTop === 0
              const atBottom = contentEl.scrollTop + contentEl.clientHeight >= contentEl.scrollHeight
              // 如果在边界且继续滚动，阻止默认行为
              if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
                e.preventDefault()
              }
            }
            
            // 移除可能存在的旧监听器
            contentEl.removeEventListener('wheel', handleWheel)
            // 添加新的监听器
            contentEl.addEventListener('wheel', handleWheel, { passive: false })
            
            // 信息窗关闭时清理监听器
            infoWindow.on('close', () => {
              contentEl.removeEventListener('wheel', handleWheel)
            })
          }
        }, 100)
      })
    })

    markers.value.push(marker)
  }

  // 2. 添加住宿标记（红色，酒店图标）
  if (todayAccommodation?.longitude && todayAccommodation?.latitude) {
    let hotelPosition: [number, number] = [
      todayAccommodation.longitude,
      todayAccommodation.latitude
    ]
    
    // 检查酒店位置是否与活动位置重合
    const hotelPosKey = `${todayAccommodation.longitude},${todayAccommodation.latitude}`
    const duplicateCount = positionMap.get(hotelPosKey) || 0
    
    if (duplicateCount > 0) {
      // 如果与其他标记点重合，使用圆形分布算法偏移
      const radius = 0.0008 // 约88米的半径
      const angle = (duplicateCount * (360 / (duplicateCount + 1))) * (Math.PI / 180)
      
      hotelPosition = [
        todayAccommodation.longitude + radius * Math.cos(angle),
        todayAccommodation.latitude + radius * Math.sin(angle)
      ]
    }
    
    positionMap.set(hotelPosKey, duplicateCount + 1)
    allPoints.push(hotelPosition)

    // 创建住宿标记内容
    const hotelMarkerContent = `
      <div class="custom-marker end ${duplicateCount > 0 ? 'overlapped' : ''}" ${duplicateCount > 0 ? 'title="⚠️ 坐标重叠：酒店位置与其他地点相同，已自动分散显示"' : ''}>
        <div class="marker-number">🏨</div>
        ${duplicateCount > 0 ? '<div class="overlap-badge" title="坐标重叠提示">⚠</div>' : ''}
      </div>
    `

    const hotelMarker = await addMarker(mapInstance.value, hotelPosition, {
      content: hotelMarkerContent,
      title: todayAccommodation.hotel_name,
      offset: [-15, -15]
    })

    // 点击标记显示住宿信息
    hotelMarker.on('click', () => {
      // 生成唯一ID用于定位元素
      const contentId = `info-content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const infoContent = `
        <div class="info-window">
          <div class="info-window-content" id="${contentId}">
            ${todayAccommodation.photo ? `<img src="${todayAccommodation.photo}" alt="${todayAccommodation.hotel_name}" class="info-photo" />` : ''}
            <h4>🏨 ${todayAccommodation.hotel_name}</h4>
            <p><strong>地址:</strong> ${todayAccommodation.address}</p>
            <p><strong>价格:</strong> ${todayAccommodation.price_range}</p>
            <p><strong>评分:</strong> ${todayAccommodation.rating}</p>
            <p><strong>推荐理由:</strong> ${todayAccommodation.reason}</p>
          </div>
        </div>
      `
      const infoWindow = new window.AMap.InfoWindow({
        content: infoContent,
        offset: new window.AMap.Pixel(0, -30),
        isCustom: false, // 使用默认样式，支持点击外部关闭
        closeWhenClickMap: true, // 点击地图时关闭
        autoMove: true, // 自动平移地图以显示信息窗
        avoid: [20, 20, 20, 20] // 设置信息窗与地图边界的最小距离（上右下左）
      })
      
      // 使用平滑动画打开信息窗
      // 先平滑移动地图中心到标记位置
      mapInstance.value.panTo(hotelPosition, 300) // 300ms 的平滑动画
      
      // 等待地图移动完成后再打开信息窗
      setTimeout(() => {
        infoWindow.open(mapInstance.value, hotelPosition)
      }, 320)
      
      // 监听信息窗打开事件，添加滚动阻止逻辑
      infoWindow.on('open', () => {
        // 使用 setTimeout 确保 DOM 已渲染
        setTimeout(() => {
          const contentEl = document.getElementById(contentId)
          if (contentEl) {
            // 定义滚动处理函数
            const handleWheel = (e: WheelEvent) => {
              e.stopPropagation()
              // 检查是否到达边界
              const atTop = contentEl.scrollTop === 0
              const atBottom = contentEl.scrollTop + contentEl.clientHeight >= contentEl.scrollHeight
              // 如果在边界且继续滚动，阻止默认行为
              if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
                e.preventDefault()
              }
            }
            
            // 移除可能存在的旧监听器
            contentEl.removeEventListener('wheel', handleWheel)
            // 添加新的监听器
            contentEl.addEventListener('wheel', handleWheel, { passive: false })
            
            // 信息窗关闭时清理监听器
            infoWindow.on('close', () => {
              contentEl.removeEventListener('wheel', handleWheel)
            })
          }
        }, 100)
      })
    })

    markers.value.push(hotelMarker)
  }

  // 3. 绘制活动之间的平滑曲线路线（不包括到酒店的线）
  if (activityPositions.length > 1) {
    // 创建平滑的贝塞尔曲线路径
    const smoothPath = createSmoothPath(activityPositions)
    
    // 一次性创建所有贝塞尔曲线段
    const bezierCurve = await addBezierCurve(mapInstance.value, smoothPath, {
      strokeColor: '#667eea',
      strokeWeight: 6,
      strokeOpacity: 0.8,
      showDir: true // 显示方向箭头
    })
    polylines.value.push(bezierCurve)
  }

  // 4. 如果有住宿，从最后一个活动到酒店画虚线贝塞尔曲线
  if (activityPositions.length > 0 && todayAccommodation?.longitude && todayAccommodation?.latitude) {
    // 使用最后一个活动的实际位置（包含偏移）
    const lastActivityPosition = activityPositions[activityPositions.length - 1]!
    const pathToHotel = [
      lastActivityPosition,
      [todayAccommodation.longitude, todayAccommodation.latitude] as [number, number]
    ]
    
    // 创建到酒店的平滑曲线
    const smoothPathToHotel = createSmoothPath(pathToHotel)
    
    const dashedBezierCurve = await addBezierCurve(mapInstance.value, smoothPathToHotel, {
      strokeStyle: 'dashed',
      strokeColor: '#FF6F3C',
      strokeWeight: 5,
      strokeOpacity: 0.8
    })
    polylines.value.push(dashedBezierCurve)
  }

  // 5. 自适应显示所有点
  if (allPoints.length > 0) {
    fitView(mapInstance.value, allPoints)
  }
}

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

// 格式化时间，确保显示为 HH:MM 格式
const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  
  // 如果已经是正确的格式，直接返回
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr
  }
  
  // 处理 "09:0" 或 "9:00" 等格式
  const parts = timeStr.split(':')
  if (parts.length === 2 && parts[0] && parts[1]) {
    const hours = parts[0].padStart(2, '0')
    const minutes = parts[1].padStart(2, '0')
    return `${hours}:${minutes}`
  }
  
  // 如果格式不正确，返回原值
  return timeStr
}

const handleNavigation = (activity: Activity) => {
  const name = encodeURIComponent(activity.location)
  
  // 检测是否为移动设备
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  if (isMobile) {
    // 如果有经纬度，使用经纬度导航（更精确）
    if (activity.longitude && activity.latitude) {
      window.open(`https://uri.amap.com/navigation?to=${activity.longitude},${activity.latitude},${name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`)
    } else {
      // 没有经纬度则使用地址
      const address = encodeURIComponent(activity.address)
      window.open(`https://uri.amap.com/marker?address=${address}&name=${name}`)
    }
  } else {
    // PC端显示提示
    if (activity.longitude && activity.latitude) {
      message.info(`坐标: ${activity.latitude}, ${activity.longitude} - 建议在移动设备上使用导航功能`)
    } else {
      message.info('请在移动设备上使用导航功能，或手动搜索地址：' + activity.address)
    }
  }
}

// 组件挂载时初始化地图
onMounted(async () => {
  await nextTick()
  await initMap()
})

// 组件卸载时清理地图资源
onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value.destroy()
    mapInstance.value = null
  }
})

// 监听当前天数变化，重新渲染路线
watch(currentDay, async () => {
  await renderDayRoute()
})
</script>

<style scoped>
/* 地图容器 */
.map-container {
  position: relative;
  height: 533px; /* 原来 400px，提升 1/3 (400 * 4/3 ≈ 533px) */
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.amap-container {
  width: 100%;
  height: 100%;
}

/* 地图加载提示 */
.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 地图图例 */
.map-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 16px;
  z-index: 10;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px currentColor;
}

.legend-dot.start {
  color: #52c41a;
}

.legend-dot.middle {
  color: var(--color-primary);
}

.legend-dot.end {
  color: var(--color-accent);
}

/* 重叠标记图例样式 */
.legend-dot.overlapped {
  position: relative;
  color: #ffc107;
  animation: pulse-glow-mini 2s ease-in-out infinite;
}

.mini-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
  color: white;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  line-height: 1;
}

@keyframes pulse-glow-mini {
  0%, 100% {
    box-shadow: 0 0 0 2px #ffc107;
  }
  50% {
    box-shadow: 0 0 0 2px #ffc107, 0 0 8px rgba(255, 193, 7, 0.5);
  }
}

/* 重叠提示项 */
.legend-item.overlap-hint {
  position: relative;
  cursor: help;
}

.legend-tooltip {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.6;
  width: 280px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 20;
}

.legend-tooltip::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.85);
}

.legend-item.overlap-hint:hover .legend-tooltip {
  opacity: 1;
  visibility: visible;
}

.tooltip-icon {
  display: inline-block;
  margin-left: 4px;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.legend-item.overlap-hint:hover .tooltip-icon {
  opacity: 1;
}

.tooltip-content {
  margin: 0;
}

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
  padding-left: 56px;
  margin-bottom: 32px;
}

.activity-time {
  position: absolute;
  left: 0;
  top: 0;
  width: 44px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  z-index: 1;
  background: white;
  padding-right: 4px;
}

.activity-dot {
  position: absolute;
  left: 44px;
  top: 6px;
  width: 12px;
  height: 12px;
  background: var(--color-primary);
  border-radius: 50%;
  border: 3px solid rgba(30, 136, 229, 0.1);
  z-index: 2;
}

.activity-line {
  position: absolute;
  left: 49px;
  top: 20px;
  bottom: -32px;
  width: 2px;
  background: #e8e8e8;
  z-index: 0;
}

.activity-content {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.activity-info {
  flex: 1;
  min-width: 0;
}

.activity-photo-wrapper {
  flex-shrink: 0;
  width: 280px;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.activity-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.activity-photo:hover {
  transform: scale(1.05);
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
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: var(--color-primary);
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
  color: var(--color-accent);
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

<style>
/* 自定义地图标记样式（全局样式，因为标记是动态插入的） */
.custom-marker {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.custom-marker:hover {
  transform: scale(1.2);
}

/* 重叠标记的特殊样式 - 使用更明显的黄色边框和脉冲效果 */
.custom-marker.overlapped {
  animation: pulse-glow 2s ease-in-out infinite;
  box-shadow: 
    0 0 0 3px rgba(255, 193, 7, 0.4),
    0 0 0 6px rgba(255, 193, 7, 0.2),
    0 0 10px rgba(255, 193, 7, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid #ffc107;
}

.custom-marker.overlapped:hover {
  animation: none;
  transform: scale(1.3);
  box-shadow: 
    0 0 0 4px rgba(255, 193, 7, 0.5),
    0 0 0 8px rgba(255, 193, 7, 0.3),
    0 0 15px rgba(255, 193, 7, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 重叠标记的警告徽章 - 更大更明显 */
.overlap-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: white;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(255, 77, 79, 0.5);
  animation: bounce-alert 1.5s ease-in-out infinite;
  z-index: 10;
}

/* 脉冲发光动画 */
@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 0 0 3px rgba(255, 193, 7, 0.4),
      0 0 0 6px rgba(255, 193, 7, 0.2),
      0 0 10px rgba(255, 193, 7, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 
      0 0 0 5px rgba(255, 193, 7, 0.5),
      0 0 0 10px rgba(255, 193, 7, 0.3),
      0 0 20px rgba(255, 193, 7, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

/* 弹跳警告动画 */
@keyframes bounce-alert {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.1);
  }
}

.custom-marker.start {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.custom-marker.middle {
  background: var(--gradient-ocean);
}

.custom-marker.end {
  background: var(--gradient-sunset);
}

.marker-number {
  font-size: 14px;
}

/* 信息窗体样式 */
.info-window {
  min-width: 200px;
  max-width: 320px;
  overflow: hidden;
}

.info-window-content {
  max-height: 450px; /* 固定最大高度，地图高度已提升 1/3 */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  /* 阻止滚动事件传播到地图 */
  overscroll-behavior: contain;
}

/* 自定义滚动条样式 */
.info-window-content::-webkit-scrollbar {
  width: 6px;
}

.info-window-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.info-window-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.info-window-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.info-window .info-photo {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
  background: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 12px;
  display: block;
}

.info-window h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #1a1a1a;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 8px;
}

.info-window p {
  margin: 6px 0;
  font-size: 14px;
  color: #666;
}

.info-window strong {
  color: #1a1a1a;
  font-weight: 600;
}

.info-window .tips {
  background: #fff7e6;
  border-left: 3px solid #faad14;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: #d46b08;
}
</style>

