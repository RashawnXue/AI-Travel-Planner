<template>
  <div class="plan-list-view">
    <AppHeader />
    
    <!-- 装饰背景元素 - 增加更多颜色 -->
    <div class="decor-orb orb-1"></div>
    <div class="decor-orb orb-2"></div>
    <div class="decor-orb orb-3"></div>
    <div class="decor-orb orb-4"></div>
    <div class="decor-orb orb-5"></div>
    
    <div class="main-container">
      <!-- 展开按钮 -->
      <div class="expand-btn" :class="{ show: sidebarCollapsed }" @click="toggleSidebar">▶</div>

      <!-- 左侧行程列表 -->
      <PlanList
        :plan-list="planStore.planList"
        :current-plan-id="currentPlanId"
        :collapsed="sidebarCollapsed"
        :loading="planStore.loading"
        @toggle="toggleSidebar"
        @select-plan="handleSelectPlan"
      />

      <!-- 右侧内容区 -->
      <main 
        class="content-area" 
        :class="{ 
          expanded: sidebarCollapsed,
          'welcome-bg': !currentPlanId && planStore.planList.length === 0
        }"
      >
        <!-- 空状态 - 无行程数据 -->
        <div v-if="!currentPlanId && planStore.planList.length === 0" class="welcome-content">
          <!-- 装饰性背景元素 -->
          <div class="floating-elements">
            <div class="float-item" style="top: 15%; left: 10%; animation-delay: 0s;">🏖️</div>
            <div class="float-item" style="top: 25%; right: 15%; animation-delay: 1s;">🗺️</div>
            <div class="float-item" style="bottom: 20%; left: 12%; animation-delay: 2s;">🎒</div>
            <div class="float-item" style="bottom: 30%; right: 18%; animation-delay: 1.5s;">🌍</div>
            <div class="float-item" style="top: 45%; left: 8%; animation-delay: 0.8s;">🏔️</div>
            <div class="float-item" style="top: 60%; right: 10%; animation-delay: 2.2s;">🏝️</div>
          </div>
          
          <div class="welcome-card">
            <div class="welcome-icon"><img class="welcome-icon-img" src="/icon.svg" alt="logo" /></div>
            <h2 class="welcome-title">欢迎使用 AI 旅行规划师</h2>
            <p class="welcome-desc">让 AI 帮您规划完美的旅行，开始探索世界吧！</p>
            <router-link to="/create" class="create-plan-btn">
              <span class="btn-icon">+</span>
              创建行程
            </router-link>
            <div class="feature-tags">
              <span class="feature-tag">🎯 智能规划</span>
              <span class="feature-tag">💰 预算管理</span>
              <span class="feature-tag">🗣️ 语音输入</span>
            </div>
          </div>
        </div>

        <!-- 空状态 - 有行程但未选中 -->
        <EmptyState
          v-else-if="!currentPlanId"
          icon="📋"
        >
          <template #default>
            <div class="empty-text">
              请在左侧选择一个行程查看详情
            </div>
          </template>
        </EmptyState>

        <!-- 行程详情 -->
        <PlanDetailView
          v-else
          :plan-id="currentPlanId"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { usePlanStore } from '@/stores/plan'
import AppHeader from '@/components/common/AppHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PlanList from '@/components/plan/PlanList.vue'
import PlanDetailView from '@/views/plan/PlanDetailView.vue'

const route = useRoute()
const router = useRouter()
const planStore = usePlanStore()

const sidebarCollapsed = ref(false)
const currentPlanId = ref<string | null>(null)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleSelectPlan = (planId: string) => {
  currentPlanId.value = planId
  // 更新URL，但不刷新页面
  router.push({ path: '/', query: { planId } })
}

// 监听路由变化，当从其他页面返回时重新加载行程列表
watch(() => route.query.planId, async (newPlanId) => {
  if (newPlanId && typeof newPlanId === 'string') {
    // 重新加载行程列表以确保包含新创建的行程
    await planStore.fetchPlanList()
    currentPlanId.value = newPlanId
  }
}, { immediate: false }) // 不在初始化时执行，只在变化时执行

// 当组件被激活时（从 keep-alive 缓存中恢复），重新加载数据
onActivated(async () => {
  await planStore.fetchPlanList()
})

onMounted(async () => {
  // 加载行程列表
  const success = await planStore.fetchPlanList()
  
  if (!success) {
    message.error('加载行程列表失败，请刷新页面重试')
    return
  }

  // 如果URL中有planId参数，自动选中
  const planIdFromQuery = route.query.planId as string
  if (planIdFromQuery) {
    currentPlanId.value = planIdFromQuery
  } else if (planStore.planList.length > 0) {
    // 如果没有指定，默认选中第一个
    const firstPlan = planStore.planList[0]
    if (firstPlan) {
      currentPlanId.value = firstPlan.id
      router.replace({ path: '/', query: { planId: currentPlanId.value } })
    }
  }

  // 移动端默认折叠侧边栏
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true
  }
})
</script>

<style scoped>
.plan-list-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f4f8 100%);
  position: relative;
  overflow-x: hidden;
}

/* 装饰背景球 - 增加更多色彩 */
.decor-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #1e88e5 0%, #26c6da 100%);
  top: -100px;
  right: -100px;
  animation: float-orb 20s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #66bb6a 0%, #26a69a 100%);
  bottom: -100px;
  left: -100px;
  animation: float-orb 25s ease-in-out infinite reverse;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #ff7043 0%, #ec407a 100%);
  top: 40%;
  right: 30%;
  animation: float-orb 30s ease-in-out infinite;
}

.orb-4 {
  width: 450px;
  height: 450px;
  background: linear-gradient(135deg, #ab47bc 0%, #7e57c2 100%);
  top: 15%;
  left: 15%;
  animation: float-orb 28s ease-in-out infinite;
}

.orb-5 {
  width: 320px;
  height: 320px;
  background: linear-gradient(135deg, #ffa726 0%, #ffca28 100%);
  bottom: 25%;
  right: 15%;
  animation: float-orb 22s ease-in-out infinite reverse;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}

.main-container {
  padding-top: 64px;
  min-height: 100vh;
  position: relative;
}

.expand-btn {
  position: fixed;
  left: 0;
  top: 80px;
  width: 32px;
  height: 48px;
  background: white;
  border: 1px solid #e8e8e8;
  border-left: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99;
  opacity: 0;
  transition: all 0.3s;
  pointer-events: none;
}

.expand-btn.show {
  opacity: 1;
  pointer-events: auto;
}

.expand-btn:hover {
  background: #f5f5f5;
}

.content-area {
  position: fixed;
  left: 320px;
  right: 0;
  top: 64px;
  bottom: 0;
  transition: all 0.3s ease;
  overflow-y: auto;
  background: #f5f5f5;
}

.content-area.expanded {
  left: 0;
}

/* 欢迎页面背景 */
.content-area.welcome-bg {
  background: transparent !important;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.content-area.welcome-bg::before {
  display: none;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 欢迎页面内容 */
.welcome-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 40px;
  background: transparent;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

/* 漂浮装饰元素 */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.float-item {
  position: absolute;
  font-size: 40px;
  opacity: 0.12;
  animation: float-around 8s ease-in-out infinite;
  filter: blur(0.5px);
}

@keyframes float-around {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, -10px) rotate(3deg);
  }
  50% {
    transform: translate(-8px, 8px) rotate(-3deg);
  }
  75% {
    transform: translate(8px, 10px) rotate(2deg);
  }
}

.welcome-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  padding: 60px 80px;
  text-align: center;
  box-shadow: 
    0 20px 60px rgba(30, 136, 229, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  backdrop-filter: blur(20px);
  transform: translateY(0);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  box-sizing: border-box;
}

.welcome-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 30px 80px rgba(30, 136, 229, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.4) inset;
}

.welcome-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 6px 12px rgba(30, 136, 229, 0.25));
}

.welcome-icon-img {
  width: 100px;
  height: 100px;
  display: block;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(-2deg);
  }
  75% {
    transform: translateY(-10px) rotate(2deg);
  }
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  background: var(--gradient-ocean);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.welcome-desc {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
  font-weight: 400;
}

.create-plan-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 48px;
  background: var(--gradient-ocean);
  color: white;
  border-radius: 50px;
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(30, 136, 229, 0.35);
  position: relative;
  overflow: hidden;
}

.create-plan-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.create-plan-btn:hover::before {
  left: 100%;
}

.create-plan-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 32px rgba(30, 136, 229, 0.45);
}

.create-plan-btn:active {
  transform: translateY(-1px) scale(1.02);
}

.btn-icon {
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
}

/* 功能标签 - 添加多彩效果 */
.feature-tags {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 28px;
  flex-wrap: wrap;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s;
}

.feature-tag:nth-child(1) {
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.12) 0%, rgba(38, 198, 218, 0.12) 100%);
  border: 1px solid rgba(30, 136, 229, 0.25);
  color: #1e88e5;
}

.feature-tag:nth-child(2) {
  background: linear-gradient(135deg, rgba(102, 187, 106, 0.12) 0%, rgba(38, 166, 154, 0.12) 100%);
  border: 1px solid rgba(102, 187, 106, 0.25);
  color: #43a047;
}

.feature-tag:nth-child(3) {
  background: linear-gradient(135deg, rgba(255, 167, 38, 0.12) 0%, rgba(255, 202, 40, 0.12) 100%);
  border: 1px solid rgba(255, 167, 38, 0.25);
  color: #fb8c00;
}

.feature-tag:nth-child(1):hover {
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.18) 0%, rgba(38, 198, 218, 0.18) 100%);
  border-color: rgba(30, 136, 229, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.2);
}

.feature-tag:nth-child(2):hover {
  background: linear-gradient(135deg, rgba(102, 187, 106, 0.18) 0%, rgba(38, 166, 154, 0.18) 100%);
  border-color: rgba(102, 187, 106, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.2);
}

.feature-tag:nth-child(3):hover {
  background: linear-gradient(135deg, rgba(255, 167, 38, 0.18) 0%, rgba(255, 202, 40, 0.18) 100%);
  border-color: rgba(255, 167, 38, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.2);
}

@media (max-width: 768px) {
  .content-area {
    margin-left: 0 !important;
  }

  .expand-btn.show {
    z-index: 100;
  }
  
  .floating-elements {
    display: none;
  }

  .welcome-card {
    padding: 40px 28px;
    border-radius: 20px;
  }
  
  .welcome-icon-img { width: 80px; height: 80px; }

  .welcome-title {
    font-size: 24px;
  }

  .welcome-desc {
    font-size: 14px;
    margin-bottom: 32px;
  }

  .create-plan-btn {
    padding: 14px 40px;
    font-size: 16px;
  }
  
  .btn-icon {
    font-size: 22px;
  }
  
  .feature-tags {
    gap: 8px;
    margin-top: 24px;
  }
  
  .feature-tag {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>

