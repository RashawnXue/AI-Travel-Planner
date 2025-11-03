<template>
  <div class="plan-list-view">
    <AppHeader />
    
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
          <div class="welcome-card">
            <div class="welcome-icon">✈️</div>
            <h2 class="welcome-title">欢迎使用 AI 旅行规划师</h2>
            <p class="welcome-desc">开始创建您的第一个旅行计划吧！</p>
            <router-link to="/create" class="create-plan-btn">
              <span class="btn-icon">+</span>
              创建行程
            </router-link>
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
import { ref, onMounted } from 'vue'
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
  background: #f5f5f5;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
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
  height: calc(100vh - 64px);
  padding: 40px;
  background: transparent;
}

.welcome-card {
  background: white;
  border-radius: 16px;
  padding: 60px 80px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
}

.welcome-icon {
  font-size: 100px;
  margin-bottom: 32px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.welcome-desc {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
}

.create-plan-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 48px;
  background: #667eea;
  color: white;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.create-plan-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-icon {
  font-size: 24px;
  font-weight: 300;
}

@media (max-width: 768px) {
  .content-area {
    margin-left: 0 !important;
  }

  .expand-btn.show {
    z-index: 100;
  }

  .welcome-card {
    padding: 40px 30px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .welcome-desc {
    font-size: 14px;
  }

  .create-plan-btn {
    padding: 14px 36px;
    font-size: 16px;
  }
}
</style>

