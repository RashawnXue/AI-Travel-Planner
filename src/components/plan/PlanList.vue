<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <h2 class="sidebar-title">我的行程</h2>
      <span class="collapse-btn" @click="$emit('toggle')">◀</span>
    </div>
    <button class="create-btn" @click="goToCreate">+ 创建新行程</button>
    
    <div v-if="loading && planList.length === 0" class="loading-state">
      <a-spin />
      <div class="loading-text">加载中...</div>
    </div>
    
    <EmptyState 
      v-else-if="!loading && planList.length === 0"
      icon="📋"
      text="还没有行程，点击上方按钮创建"
    />
    
    <div v-else class="plan-list" @scroll="handleScroll">
      <PlanCard
        v-for="plan in planList"
        :key="plan.id"
        :plan="plan"
        :is-active="currentPlanId === plan.id"
        @click="handlePlanClick(plan.id)"
        @contextmenu="handleContextMenu(plan.id, $event)"
      />
      
      <div v-if="loadingMore" class="loading-more">
        <a-spin size="small" />
        <span>加载更多...</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Modal, message, Spin as ASpin } from 'ant-design-vue'
import type { PlanListItem } from '@/types/plan'
import { usePlanStore } from '@/stores/plan'
import PlanCard from './PlanCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

interface Props {
  planList: PlanListItem[]
  currentPlanId?: string | null
  collapsed?: boolean
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: []
  selectPlan: [planId: string]
  planDeleted: []  // 新增：行程删除后的事件
}>()

const router = useRouter()
const planStore = usePlanStore()

const loadingMore = ref(false)

const goToCreate = () => {
  router.push('/create')
}

const handlePlanClick = (planId: string) => {
  emit('selectPlan', planId)
}

const handleContextMenu = (planId: string, event: MouseEvent) => {
  event.preventDefault()
  
  // 这里简化处理，直接弹出确认框
  // 在实际项目中可以使用更复杂的右键菜单组件
  showContextMenu(planId)
}

const showContextMenu = (planId: string) => {
  const plan = planStore.planList.find(p => p.id === planId)
  if (!plan) return
  
  Modal.confirm({
    title: '操作',
    content: '请选择要进行的操作',
    okText: '查看详情',
    cancelText: '删除',
    okType: 'default',
    cancelButtonProps: { danger: true },
    onOk() {
      emit('selectPlan', planId)
    },
    onCancel() {
      handleDelete(planId)
    }
  })
}

const handleDelete = async (planId: string) => {
  const plan = planStore.planList.find(p => p.id === planId)
  if (!plan) return
  
  Modal.confirm({
    title: '删除行程',
    content: `确定要删除「${plan.title}」吗？删除后无法恢复。`,
    okText: '删除',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      const success = await planStore.removePlan(planId)
      if (success) {
        message.success('已删除行程')
        // 通知父组件行程已删除，让父组件处理跳转逻辑
        emit('planDeleted')
      } else {
        message.error('删除失败，请重试')
      }
    }
  })
}

const handleScroll = async (e: Event) => {
  const target = e.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight
  
  // 滚动到底部时加载更多
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    if (planStore.hasMore && !loadingMore.value) {
      loadingMore.value = true
      await planStore.loadMorePlans()
      loadingMore.value = false
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e8e8e8;
  padding: 24px;
  overflow: hidden;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  transform: translateX(-100%);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.collapse-btn {
  cursor: pointer;
  color: #666;
  font-size: 20px;
  transition: transform 0.3s;
}

.sidebar.collapsed .collapse-btn {
  transform: rotate(180deg);
}

.create-btn {
  width: 100%;
  height: 40px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.create-btn:hover {
  background: #5568d3;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

/* 自定义滚动条样式 */
.plan-list::-webkit-scrollbar {
  width: 6px;
}

.plan-list::-webkit-scrollbar-track {
  background: transparent;
}

.plan-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  transition: background 0.3s;
}

.plan-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  font-size: 14px;
  color: #999;
}
</style>

