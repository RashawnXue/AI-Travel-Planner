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
      :width="600"
      ok-text="确认"
      cancel-text="取消"
      @ok="handleExpenseSubmit"
      @cancel="resetExpenseForm"
    >
      <!-- 语音输入区域 -->
      <div class="voice-input-section">
        <div class="voice-tip">
          💡 试试语音输入：说出"<strong>餐饮消费128元</strong>"或"<strong>交通花费50元</strong>"
        </div>
        <div class="voice-input-container">
          <button
            class="voice-btn"
            :class="{ recording: isRecording }"
            @click="toggleRecording"
            :disabled="isProcessingVoice"
          >
            <span v-if="!isRecording && !isProcessingVoice" class="voice-icon">🎤</span>
            <span v-else-if="isRecording" class="voice-icon pulse">⏺️</span>
            <span v-else class="voice-icon">⏳</span>
            <span class="voice-text">
              {{ isRecording ? '录音中...' : isProcessingVoice ? '识别中...' : '点击语音输入' }}
            </span>
          </button>
          <div v-if="voiceText" class="voice-result">
            识别结果：{{ voiceText }}
          </div>
        </div>
      </div>

      <a-divider>或手动填写</a-divider>

      <a-form :model="expenseForm" layout="vertical">
        <a-form-item label="支出分类" required>
          <a-select v-model:value="expenseForm.category" placeholder="请选择支出分类" size="large">
            <a-select-option value="交通">🚗 交通</a-select-option>
            <a-select-option value="住宿">🏨 住宿</a-select-option>
            <a-select-option value="餐饮">🍜 餐饮</a-select-option>
            <a-select-option value="活动">🎫 活动</a-select-option>
            <a-select-option value="购物">🛍️ 购物</a-select-option>
            <a-select-option value="其他">💼 其他</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="支出金额" required>
          <a-input-number
            v-model:value="expenseForm.amount"
            :min="0"
            :precision="2"
            placeholder="请输入金额"
            style="width: 100%"
            size="large"
          >
            <template #addonBefore>¥</template>
          </a-input-number>
        </a-form-item>

        <a-form-item label="支出描述">
          <a-textarea
            v-model:value="expenseForm.description"
            :rows="3"
            :maxlength="200"
            placeholder="请描述这笔支出的详情（选填）"
            size="large"
          />
        </a-form-item>

        <div class="form-row">
          <a-form-item label="支出日期" required class="form-col">
            <a-date-picker
              v-model:value="expenseForm.expense_date"
              placeholder="请选择支出日期"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              size="large"
            />
          </a-form-item>

          <a-form-item label="支出时间" required class="form-col">
            <a-time-picker
              v-model:value="expenseForm.expense_time"
              placeholder="请选择支出时间"
              style="width: 100%"
              format="HH:mm"
              value-format="HH:mm:ss"
              size="large"
            />
          </a-form-item>
        </div>
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
import { ref, watch } from 'vue'
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
  TimePicker as ATimePicker,
  Divider as ADivider
} from 'ant-design-vue'
import { usePlanStore } from '@/stores/plan'
import { useExpenseStore } from '@/stores/expense'
import { useUserStore } from '@/stores/user'
import type { ExpenseForm, ExpenseCategory } from '@/types/expense'
import { createWavRecorder } from '@/utils/audio'
import { recognizeAudioBlob } from '@/api/asr'
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
const userStore = useUserStore()

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

// 语音识别相关
const isRecording = ref(false)
const isProcessingVoice = ref(false)
const voiceText = ref('')
const audioRecorder = createWavRecorder()

// 解析语音文本，支持格式：
// "餐饮消费128元"
// "交通花费50元"
// "住宿支出500元"
const parseVoiceExpense = (text: string): { category?: ExpenseCategory; amount?: number } => {
  const categoryMap: Record<string, ExpenseCategory> = {
    '交通': '交通',
    '住宿': '住宿',
    '餐饮': '餐饮',
    '活动': '活动',
    '购物': '购物',
    '其他': '其他'
  }
  
  // 匹配分类
  let category: ExpenseCategory | undefined
  for (const key of Object.keys(categoryMap)) {
    if (text.includes(key)) {
      category = categoryMap[key]
      break
    }
  }
  
  // 匹配金额（支持：128元、50块、￥100、¥200）
  const amountMatch = text.match(/(\d+\.?\d*)\s*[元块圆]|[￥¥]\s*(\d+\.?\d*)/)
  const amount = amountMatch ? parseFloat(amountMatch[1] || amountMatch[2] || '0') : undefined
  
  return { category, amount }
}

// 切换录音状态
const toggleRecording = async () => {
  // 检查 API Key
  if (!userStore.hasApiKey) {
    Modal.confirm({
      title: '需要配置 API 密钥',
      content: '使用语音识别功能需要先配置百炼 API 密钥，是否现在前往配置？',
      okText: '去配置',
      cancelText: '取消',
      onOk() {
        message.info('请点击顶部导航栏右侧的 "配置API密钥" 按钮')
      }
    })
    return
  }
  
  if (isRecording.value) {
    // 停止录音
    isRecording.value = false
    isProcessingVoice.value = true
    
    try {
      const audioBlob = await audioRecorder.stop()
      
      if (audioBlob.size === 0) {
        message.warning('未录制到音频，请重试')
        return
      }
      
      // 调用语音识别
      const result = await recognizeAudioBlob(audioBlob)
      
      if (!result) {
        message.error('语音识别失败，请重试')
        return
      }
      
      voiceText.value = result
      
      // 解析结果
      const parsed = parseVoiceExpense(result)
      
      if (parsed.category) {
        expenseForm.value.category = parsed.category
      }
      if (parsed.amount) {
        expenseForm.value.amount = parsed.amount
      }
      
      if (!parsed.category || !parsed.amount) {
        message.warning('未能识别完整信息，请补充或手动填写')
      } else {
        message.success('语音识别成功！')
      }
    } catch (error) {
      console.error('语音识别异常:', error)
      message.error('语音识别出错，请重试')
    } finally {
      isProcessingVoice.value = false
    }
  } else {
    // 开始录音
    try {
      await audioRecorder.start()
      isRecording.value = true
      voiceText.value = ''
      message.info('开始录音...')
    } catch (error) {
      console.error('启动录音失败:', error)
      message.error('启动录音失败，请检查麦克风权限')
    }
  }
}

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
  voiceText.value = ''
  isRecording.value = false
  isProcessingVoice.value = false
}

// 监听planId变化
watch(() => props.planId, (newId, oldId) => {
  // 只有当 planId 真正变化时才重新加载
  if (newId && newId !== oldId) {
    loadPlanDetail()
  }
}, { immediate: true })

// 监听Tab切换，加载支出记录
watch(currentTab, async (newTab, oldTab) => {
  // 只有切换到费用预算tab时才加载，避免重复加载
  if (newTab === 3 && oldTab !== 3 && props.planId) {
    await expenseStore.fetchExpenseList(props.planId)
  }
})

// 移除 onMounted，使用 watch immediate 已足够

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

/* 语音输入样式 */
.voice-input-section {
  margin-bottom: 24px;
}

.voice-tip {
  background: #f0f5ff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.6;
}

.voice-tip strong {
  color: #667eea;
  font-weight: 600;
}

.voice-input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voice-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.voice-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.voice-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.voice-btn.recording {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  animation: pulse-recording 1.5s infinite;
}

@keyframes pulse-recording {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
  }
  50% {
    box-shadow: 0 4px 24px rgba(245, 87, 108, 0.6);
  }
}

.voice-icon {
  font-size: 20px;
}

.voice-icon.pulse {
  animation: pulse-icon 1s infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.voice-text {
  font-size: 15px;
}

.voice-result {
  background: #f6f8fa;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  border-left: 3px solid #52c41a;
}

/* 表单行布局 */
.form-row {
  display: flex;
  gap: 16px;
}

.form-col {
  flex: 1;
}

</style>

