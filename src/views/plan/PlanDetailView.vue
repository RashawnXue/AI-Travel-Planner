<template>
  <div v-if="loading" class="loading-container">
    <a-spin size="large" />
    <div class="loading-text">加载中...</div>
  </div>

  <div v-else-if="plan" class="plan-detail">
    <!-- 行程概览 -->
    <PlanOverview :plan="plan" />

    <!-- Tab 导航 -->
    <nav class="tab-nav">
      <div class="tab-nav-container">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{ active: currentTab === index }"
          @click="currentTab = index"
        >
          {{ tab }}
        </div>
      </div>
    </nav>

    <!-- 内容区 -->
    <section class="content-section">
      <!-- 每日行程 Tab -->
      <div v-show="currentTab === 0" class="tab-content">
        <DailyPlan 
          :daily-plans="plan.ai_response.daily_plans" 
          :accommodation="plan.ai_response.accommodation"
        />
      </div>

      <!-- 住宿安排 Tab -->
      <div v-show="currentTab === 1" class="tab-content">
        <AccommodationTab :accommodation-list="plan.ai_response.accommodation" />
      </div>

      <!-- 交通信息 Tab -->
      <div v-show="currentTab === 2" class="tab-content">
        <TransportTab :transportation="plan.ai_response.transportation" />
      </div>

      <!-- 费用预算 Tab -->
      <div v-show="currentTab === 3" class="tab-content">
        <BudgetTab
          :budget-breakdown="plan.ai_response.budget_breakdown"
          :total-budget="plan.budget"
          :expense-list="expenseStore.expenseList"
          @add-expense="handleAddExpense"
          @delete-expense="handleDeleteExpense"
        />
      </div>
    </section>

    <!-- 添加支出弹窗 -->
    <a-modal
      v-model:open="showExpenseModal"
      title="添加支出记录"
      :width="500"
      @ok="handleExpenseSubmit"
      @cancel="resetExpenseForm"
    >
      <a-form :model="expenseForm" layout="vertical">
        <a-form-item label="支出分类" required>
          <a-select v-model:value="expenseForm.category" placeholder="请选择支出分类">
            <a-select-option value="交通">交通</a-select-option>
            <a-select-option value="住宿">住宿</a-select-option>
            <a-select-option value="餐饮">餐饮</a-select-option>
            <a-select-option value="活动">活动</a-select-option>
            <a-select-option value="购物">购物</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="支出金额" required>
          <a-input-number
            v-model:value="expenseForm.amount"
            :min="0"
            :precision="2"
            placeholder="请输入金额"
            style="width: 100%"
          >
            <template #addonBefore>¥</template>
          </a-input-number>
        </a-form-item>

        <a-form-item label="支出描述">
          <a-textarea
            v-model:value="expenseForm.description"
            :rows="3"
            :maxlength="200"
            placeholder="请描述这笔支出的详情"
          />
        </a-form-item>

        <a-form-item label="支出日期" required>
          <a-date-picker
            v-model:value="expenseForm.expense_date"
            placeholder="请选择支出日期"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item label="支出时间" required>
          <a-time-picker
            v-model:value="expenseForm.expense_time"
            placeholder="请选择支出时间"
            style="width: 100%"
            format="HH:mm"
            value-format="HH:mm:ss"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

  <EmptyState
    v-else
    icon="😕"
    text="行程不存在或已被删除"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  Spin as ASpin,
  Modal as AModal,
  Form as AForm,
  FormItem as AFormItem,
  Select as ASelect,
  SelectOption as ASelectOption,
  InputNumber as AInputNumber,
  Textarea as ATextarea,
  DatePicker as ADatePicker,
  TimePicker as ATimePicker
} from 'ant-design-vue'
import { usePlanStore } from '@/stores/plan'
import { useExpenseStore } from '@/stores/expense'
import type { ExpenseForm } from '@/types/expense'
import PlanOverview from '@/components/plan/PlanOverview.vue'
import DailyPlan from '@/components/plan/DailyPlan.vue'
import AccommodationTab from '@/components/plan/AccommodationTab.vue'
import TransportTab from '@/components/plan/TransportTab.vue'
import BudgetTab from '@/components/plan/BudgetTab.vue'
import EmptyState from '@/components/common/EmptyState.vue'

interface Props {
  planId: string
}

const props = defineProps<Props>()

const planStore = usePlanStore()
const expenseStore = useExpenseStore()

const loading = ref(false)
const currentTab = ref(0)
const tabs = ['每日行程', '住宿安排', '交通信息', '费用预算']

const plan = ref(planStore.currentPlan)

const showExpenseModal = ref(false)
const expenseForm = ref<ExpenseForm>({
  category: '餐饮',
  amount: 0,
  description: '',
  expense_date: new Date().toISOString().split('T')[0] || '',
  expense_time: new Date().toTimeString().split(' ')[0] || ''
})

const loadPlanDetail = async () => {
  loading.value = true
  try {
    const success = await planStore.fetchPlanDetail(props.planId)
    if (!success) {
      message.error('加载行程详情失败')
      return
    }

    plan.value = planStore.currentPlan

    // 加载支出记录
    if (currentTab.value === 3) {
      await expenseStore.fetchExpenseList(props.planId)
    }
  } finally {
    loading.value = false
  }
}

const handleAddExpense = () => {
  showExpenseModal.value = true
  resetExpenseForm()
}

const handleExpenseSubmit = async () => {
  // 验证表单
  if (!expenseForm.value.category) {
    message.error('请选择支出分类')
    return
  }
  if (!expenseForm.value.amount || expenseForm.value.amount <= 0) {
    message.error('请输入有效的金额')
    return
  }
  if (!expenseForm.value.expense_date) {
    message.error('请选择支出日期')
    return
  }
  if (!expenseForm.value.expense_time) {
    message.error('请选择支出时间')
    return
  }

  const success = await expenseStore.createExpense(props.planId, expenseForm.value)
  
  if (success) {
    message.success('支出记录已添加')
    showExpenseModal.value = false
    resetExpenseForm()
  } else {
    message.error('添加失败，请重试')
  }
}

const handleDeleteExpense = (expenseId: string) => {
  Modal.confirm({
    title: '删除支出记录',
    content: '确定要删除这条支出记录吗？',
    okText: '删除',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      const success = await expenseStore.removeExpense(expenseId)
      if (success) {
        message.success('已删除支出记录')
      } else {
        message.error('删除失败，请重试')
      }
    }
  })
}

const resetExpenseForm = () => {
  expenseForm.value = {
    category: '餐饮',
    amount: 0,
    description: '',
    expense_date: new Date().toISOString().split('T')[0] || '',
    expense_time: new Date().toTimeString().split(' ')[0] || ''
  }
}

// 监听planId变化
watch(() => props.planId, () => {
  if (props.planId) {
    loadPlanDetail()
  }
}, { immediate: true })

// 监听Tab切换，加载支出记录
watch(currentTab, async (newTab) => {
  if (newTab === 3 && props.planId) {
    await expenseStore.fetchExpenseList(props.planId)
  }
})

onMounted(() => {
  if (props.planId) {
    loadPlanDetail()
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  gap: 16px;
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.plan-detail {
  background: white;
}

.tab-nav {
  background: white;
  border-bottom: 1px solid #e8e8e8;
}

.tab-nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 24px;
}

.tab-item {
  padding: 14px 24px;
  cursor: pointer;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-size: 16px;
  transition: all 0.3s;
}

.tab-item.active {
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: 600;
}

.content-section {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
}
</style>

