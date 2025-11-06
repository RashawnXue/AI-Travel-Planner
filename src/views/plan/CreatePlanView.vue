<template>
  <div class="create-plan-view">
    <AppHeader />
    
    <!-- 装饰背景元素 -->
    <div class="decor-orb orb-1"></div>
    <div class="decor-orb orb-2"></div>
    <div class="decor-orb orb-3"></div>
    <div class="decor-orb orb-4"></div>

    <div class="main-container">
      <div class="page-card">
        <!-- 顶部 Hero 信息区 -->
        <div class="page-hero">
          <div class="hero-icon-wrapper">
            <div class="hero-icon">✈️</div>
            <div class="hero-sparkles">
              <span class="sparkle sparkle-1">✨</span>
              <span class="sparkle sparkle-2">✨</span>
              <span class="sparkle sparkle-3">✨</span>
            </div>
          </div>
          <div class="hero-badge">
            <span class="badge-icon">🤖</span>
            <span>AI 智能规划</span>
            <span class="badge-dot"></span>
            <span>分钟级响应</span>
          </div>
          <h1 class="page-title">
            <span class="title-gradient">创建梦想旅程</span>
          </h1>
          <p class="page-subtitle">
            描述你的旅行愿景，让 AI 为你定制专属行程<br/>
            <span class="subtitle-highlight">智能、高效、个性化</span>
          </p>
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">🎤</div>
              <div class="feature-text">
                <div class="feature-title">语音输入</div>
                <div class="feature-desc">说出你的想法</div>
              </div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🧭</div>
              <div class="feature-text">
                <div class="feature-title">智能路线</div>
                <div class="feature-desc">优化每一步</div>
              </div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <div class="feature-text">
                <div class="feature-title">预算优化</div>
                <div class="feature-desc">精打细算</div>
              </div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📅</div>
              <div class="feature-text">
                <div class="feature-title">日程细化</div>
                <div class="feature-desc">安排妥当</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 切换 -->
        <div class="input-section-wrapper">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">💬</span>
              告诉我你的计划
            </h2>
          </div>
          
          <div class="tab-container">
            <div 
              class="tab-item" 
              :class="{ active: activeTab === 'voice' }"
              @click="activeTab = 'voice'"
            >
              <span class="tab-icon">🎤</span>
              <div class="tab-content">
                <span class="tab-label">语音输入</span>
                <span class="tab-hint">更快更便捷</span>
              </div>
            </div>
            <div 
              class="tab-item" 
              :class="{ active: activeTab === 'text' }"
              @click="activeTab = 'text'"
            >
              <span class="tab-icon">⌨️</span>
              <div class="tab-content">
                <span class="tab-label">文字输入</span>
                <span class="tab-hint">详细描述</span>
              </div>
            </div>
          </div>


        <!-- 语音输入区域 -->
        <div v-show="activeTab === 'voice'" class="voice-input-area">
          <div class="voice-stage">
            <button 
              class="mic-button" 
              :class="{ recording: isRecording }"
              @click="toggleRecording"
            >
              <span class="mic-icon">🎤</span>
              <div class="mic-ripple"></div>
              <div class="mic-ripple ripple-2"></div>
            </button>
            <div 
              class="voice-tip" 
              :class="{ recording: isRecording, recognizing: isRecognizing }"
            >
              <span class="tip-icon">{{ isRecording ? '🔴' : isRecognizing ? '⏳' : '👆' }}</span>
              <span class="tip-text">{{ voiceTip }}</span>
            </div>
          </div>

          <div v-show="recognizedText" class="text-preview">
            <div class="preview-header">
              <div class="preview-title">
                <span class="preview-icon">✅</span>
                <span class="preview-label">识别结果（可编辑）</span>
              </div>
              <div class="preview-actions">
                <span class="copy-link" @click="copyRecognizedText">
                  <span class="copy-icon">📋</span>
                  复制
                </span>
                <span class="retry-link" @click="retryVoice">
                  <span class="retry-icon">🔄</span>
                  重新录音
                </span>
              </div>
            </div>
            <div 
              class="preview-content" 
              contenteditable="true"
              @blur="onPreviewBlur"
              ref="previewContentRef"
              placeholder="点击编辑识别结果..."
            >
              {{ recognizedText }}
            </div>
            <div class="preview-footer">
              <span class="preview-hint">💡 可直接编辑修改识别结果</span>
            </div>
          </div>
        </div>

        <!-- 文字输入区域 -->
        <div v-show="activeTab === 'text'" class="text-input-area">
          <div class="input-wrapper">
            <a-textarea
              v-model:value="textInput"
              :maxlength="500"
              :rows="10"
              placeholder="💭 描述你的旅行计划，例如：&#10;&#10;我想去日本旅行 5 天，预算 1 万元，喜欢美食和动漫，带孩子，希望行程轻松一些。想体验地道的拉面和寿司，参观吉卜力博物馆，也想去浅草寺感受传统文化..."
              class="text-input"
            />
            <div class="input-decoration">
              <div class="input-glow"></div>
            </div>
          </div>
          <div class="input-footer">
            <div class="char-count">
              <span class="count-current">{{ textInput.length }}</span>
              <span class="count-separator">/</span>
              <span class="count-max">500</span>
            </div>
            <div class="input-tips">
              <span class="tip-item">💡 可以包含：目的地、天数、预算、偏好等</span>
            </div>
          </div>
        </div>
        </div>

        <!-- 补充信息 -->
        <div class="additional-info">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">📝</span>
              详细信息
              <span class="optional-badge">可选</span>
            </h2>
          </div>

          <div class="collapse-header" @click="toggleCollapse">
            <div class="collapse-left">
              <span class="collapse-icon" :class="{ open: isCollapseOpen }">▶</span>
              <span class="collapse-title">{{ isCollapseOpen ? '收起' : '展开' }}补充信息</span>
            </div>
            <span class="collapse-hint">如已在上方描述，可跳过</span>
          </div>
          
          <div v-show="isCollapseOpen" class="collapse-content">
            <div class="form-grid">
              <!-- 第一行：目的地和天数 -->
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🎯</span>
                  <span>旅行目的地</span>
                </label>
                <a-input 
                  v-model:value="formData.destination"
                  placeholder="例如：日本东京"
                  class="form-input modern-input"
                  size="large"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">📆</span>
                  <span>旅行天数</span>
                </label>
                <div class="input-with-suffix">
                  <a-input-number 
                    v-model:value="formData.days"
                    :min="1"
                    :max="30"
                    placeholder="5"
                    class="form-input-number modern-input"
                    size="large"
                  />
                  <span class="input-suffix">天</span>
                </div>
              </div>

              <!-- 第二行：预算和人数 -->
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">💰</span>
                  <span>预算范围</span>
                </label>
                <div class="input-with-suffix">
                  <a-input-number 
                    v-model:value="formData.budget"
                    :min="0"
                    :step="100"
                    placeholder="10000"
                    class="form-input-number modern-input"
                    size="large"
                  />
                  <span class="input-suffix">元</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">👥</span>
                  <span>同行人数</span>
                </label>
                <div class="input-with-suffix">
                  <a-input-number 
                    v-model:value="formData.travelers"
                    :min="1"
                    :max="20"
                    placeholder="2"
                    class="form-input-number modern-input"
                    size="large"
                  />
                  <span class="input-suffix">人</span>
                </div>
              </div>

              <!-- 出发日期 -->
              <div class="form-group full-width">
                <label class="form-label">
                  <span class="label-icon">🗓️</span>
                  <span>出发日期</span>
                </label>
                <a-date-picker 
                  v-model:value="formData.startDate"
                  placeholder="选择出发日期"
                  class="form-input-date modern-input"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  size="large"
                />
              </div>

              <!-- 旅行偏好 -->
              <div class="form-group full-width">
                <label class="form-label">
                  <span class="label-icon">❤️</span>
                  <span>旅行偏好</span>
                  <span class="label-hint">（可多选）</span>
                </label>
                <div class="preference-grid">
                  <div 
                    v-for="preference in preferenceOptions"
                    :key="preference"
                    class="preference-chip"
                    :class="{ selected: formData.preferences.includes(preference) }"
                    @click="togglePreference(preference)"
                  >
                    <span class="chip-check">✓</span>
                    <span class="chip-text">{{ preference }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成按钮（底部粘性操作区） -->
        <div class="generate-section">
          <div class="generate-card">
            <!-- 进度条 -->
            <div v-show="isGenerating" class="progress-wrapper">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${generateProgress}%` }"></div>
              </div>
              <div class="progress-text">
                <span class="progress-icon">{{ progressIcon }}</span>
                <span class="progress-label">{{ progressText }}</span>
                <span class="progress-percent">{{ generateProgress }}%</span>
              </div>
              <div class="progress-hint">
                💡 AI 正在为您精心规划行程，可能需要 1-2 分钟，请耐心等待...
              </div>
            </div>

            <a-button 
              type="primary" 
              size="large"
              :loading="isGenerating"
              :disabled="!canGenerate"
              @click="generatePlan"
              class="generate-btn"
            >
              <template #icon>
                <span class="btn-icon">{{ isGenerating ? '⏳' : '✨' }}</span>
              </template>
              <span class="btn-text">{{ isGenerating ? '正在生成中...' : '生成梦想行程' }}</span>
            </a-button>
            <div class="generate-footer">
              <div class="footer-features">
                <span class="footer-item">
                  <span class="item-icon">⚡</span>
                  <span>AI 智能规划</span>
                </span>
                <span class="footer-separator">·</span>
                <span class="footer-item">
                  <span class="item-icon">🎯</span>
                  <span>可编辑优化</span>
                </span>
                <span class="footer-separator">·</span>
                <span class="footer-item">
                  <span class="item-icon">🗺️</span>
                  <span>一键导航</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import AppHeader from '@/components/common/AppHeader.vue'
import { invokeBailianApp, extractBailianText, parsePlanJsonFromText } from '@/api/ai'
import { createWavRecorder } from '@/utils/audio'
import { recognizeAudioBlob } from '@/api/asr'
import { createPlanFromAI } from '@/api/plan'
import { supabase } from '@/utils/supabase'
import { useUserStore } from '@/stores/user'
import type { AIResponse } from '@/types/plan'

const router = useRouter()
const userStore = useUserStore()

// Tab 切换
const activeTab = ref<'voice' | 'text'>('text')

// 语音输入相关
const isRecording = ref(false)
const isRecognizing = ref(false)
const recognizedText = ref('')
const voiceTip = computed(() => {
  if (isRecording.value) return '正在录音中，再次点击结束...'
  if (isRecognizing.value) return '正在识别中，请稍候...'
  return '点击开始语音输入'
})

// 文字输入
const textInput = ref('')

// 补充信息表单
const formData = ref({
  destination: '',
  days: undefined as number | undefined,
  budget: undefined as number | undefined,
  travelers: undefined as number | undefined,
  preferences: [] as string[],
  startDate: ''
})

const preferenceOptions = ['美食', '自然风光', '历史文化', '购物', '亲子', '摄影', '冒险', '放松']
const isCollapseOpen = ref(false)

// 生成按钮状态
const isGenerating = ref(false)
const canGenerate = computed(() => {
  const hasInput = activeTab.value === 'voice' 
    ? recognizedText.value.trim().length > 0
    : textInput.value.trim().length > 0
  return hasInput && !isGenerating.value
})

// 生成进度
const generateProgress = ref(0)
const progressText = ref('')
const progressIcon = ref('🚀')

const progressSteps = [
  { percent: 20, text: '正在分析需求...', icon: '🔍' },
  { percent: 40, text: '正在规划路线...', icon: '🗺️' },
  { percent: 60, text: '正在优化行程...', icon: '⚙️' },
  { percent: 80, text: '正在生成详情...', icon: '📝' },
  { percent: 95, text: '即将完成...', icon: '✨' }
]

function startProgress() {
  generateProgress.value = 0
  let currentStep = 0
  
  const interval = setInterval(() => {
    if (currentStep < progressSteps.length) {
      const step = progressSteps[currentStep]!
      generateProgress.value = step.percent
      progressText.value = step.text
      progressIcon.value = step.icon
      currentStep++
    } else {
      clearInterval(interval)
    }
  }, 3000) // 每3秒更新一次进度
  
  return interval
}

function completeProgress() {
  generateProgress.value = 100
  progressText.value = '生成完成！'
  progressIcon.value = '✅'
}

// 语音录音相关
const recorder = createWavRecorder()
let recordedBlob: Blob | null = null

async function startRecording() {
  if (isRecording.value) return
  isRecognizing.value = false
  recognizedText.value = ''
  recordedBlob = null

  if (!import.meta.env.VITE_PF_API_KEY) {
    message.error('语音配置缺失：请在 .env 配置 VITE_PF_API_KEY 后重启服务')
    console.error('[ASR] Missing env var: VITE_PF_API_KEY')
    return
  }

  try {
    await recorder.start()
    isRecording.value = true
  } catch (e) {
    console.error('[ASR] mic start failed:', e)
    message.error('无法访问麦克风，请允许浏览器麦克风权限')
  }
}

async function stopRecording() {
  if (!isRecording.value) return
  isRecording.value = false
  isRecognizing.value = true

  try {
    // 停止录音并获取音频 Blob
    recordedBlob = await recorder.stop()
    
    if (!recordedBlob || recordedBlob.size === 0) {
      throw new Error('录音数据为空')
    }

    // 调用录音文件识别 API
    const text = await recognizeAudioBlob(recordedBlob)
    
    // 检查识别结果是否为空
    if (!text || text.trim().length === 0) {
      message.warning({
        content: '未识别到语音内容，请重新录音',
        duration: 3
      })
      recognizedText.value = ''
      recordedBlob = null
      return
    }
    
    recognizedText.value = text.trim()

    // 识别成功后，临时文件会在 recognizeAudioBlob 内部删除
    recordedBlob = null
  } catch (e) {
    console.error('[ASR] recognition failed:', e)
    const error = e as Error
    message.error(`语音识别失败：${error.message}`)
    recordedBlob = null
  } finally {
    isRecognizing.value = false
  }
}

const toggleRecording = () => {
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
  
  if (!isRecording.value) {
    startRecording()
  } else {
    stopRecording()
  }
}

const retryVoice = () => {
  recognizedText.value = ''
  isRecording.value = false
  isRecognizing.value = false
}

const onPreviewBlur = (e: Event) => {
  recognizedText.value = (e.target as HTMLElement).innerText.trim()
}

const copyRecognizedText = async () => {
  try {
    await navigator.clipboard.writeText(recognizedText.value)
    message.success('已复制到剪贴板')
  } catch {
    message.error('复制失败')
  }
}

const previewContentRef = ref<HTMLElement | null>(null)

const toggleCollapse = () => {
  isCollapseOpen.value = !isCollapseOpen.value
}

const togglePreference = (preference: string) => {
  const index = formData.value.preferences.indexOf(preference)
  if (index > -1) {
    formData.value.preferences.splice(index, 1)
  } else {
    formData.value.preferences.push(preference)
  }
}

/**
 * 生成行程
 */
async function generatePlan() {
  if (!canGenerate.value) return
  
  // 检查 API Key
  if (!userStore.hasApiKey) {
    Modal.confirm({
      title: '需要配置 API 密钥',
      content: '使用 AI 生成行程需要先配置百炼 API 密钥，是否现在前往配置？',
      okText: '去配置',
      cancelText: '取消',
      onOk() {
        // 触发 header 中的 API key 配置弹窗
        message.info('请点击顶部导航栏右侧的 "配置API密钥" 按钮')
      }
    })
    return
  }

  isGenerating.value = true
  const progressInterval = startProgress()
  let userId: string | null = null

  try {
    // 1. 首先检查用户是否已登录并立即获取 user_id
    const { data: userSession, error: userError } = await supabase.auth.getSession()

    if (userError || !userSession?.session?.user?.id) {
      message.error('请先登录后再生成行程')
      router.push('/auth/login')
      return
    }

    // 立即保存用户 ID，后续使用此 ID 而不是重新获取
    userId = userSession.session.user.id

    const userPrompt = activeTab.value === 'voice' ? recognizedText.value : textInput.value

    // 构建给 AI 的完整提示，包含补充表单信息
    const promptParts: string[] = []
    promptParts.push(userPrompt.trim())
    if (formData.value.destination) promptParts.push(`目的地：${formData.value.destination}`)
    if (formData.value.days) promptParts.push(`天数：${formData.value.days}`)
    if (formData.value.budget) promptParts.push(`预算：${formData.value.budget}`)
    if (formData.value.travelers) promptParts.push(`同行人数：${formData.value.travelers}`)
    if (formData.value.preferences?.length) promptParts.push(`偏好：${formData.value.preferences.join('、')}`)
    if (formData.value.startDate) promptParts.push(`出发日期：${formData.value.startDate}`)

    const prompt = promptParts.join('\n')

    const res = await invokeBailianApp({ prompt })

    if (res.error || !res.data) {
      throw new Error(res.error?.message || '调用 AI 接口失败')
    }

    // 从返回中提取文本并尝试解析为 JSON
    const raw = res.data
    const text = extractBailianText(raw) ?? (typeof raw === 'string' ? raw : JSON.stringify(raw))

    const aiObj = parsePlanJsonFromText<AIResponse>(text)
    if (!aiObj) {
      console.error('AI 返回的内容无法解析为 JSON:', text)
      message.warning({
        content: '出现了点小差错，请您重试一下，下次一定成功！ 🙏',
        duration: 3
      })
      return // 直接返回，不抛出错误，保持表单状态以便重试
    }

    // 使用之前保存的 userId 而不是重新获取
    const createRes = await createPlanFromAI(aiObj, userId)

    if (createRes.error || !createRes.data) {
      throw new Error(createRes.error?.message || '持久化行程失败')
    }

    completeProgress()
    await new Promise(resolve => setTimeout(resolve, 500)) // 显示完成状态
    
    message.success('行程生成并保存成功！')
    // 返回首页并展示新创建的行程
    router.push({ path: '/', query: { planId: createRes.data.id } })
  } catch (err) {
    const e = err as Error
    message.error(e.message || '生成行程失败')
  } finally {
    clearInterval(progressInterval)
    isGenerating.value = false
    setTimeout(() => {
      generateProgress.value = 0
    }, 500)
  }
}
</script>

<style scoped>
.create-plan-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f4f8 100%);
  padding-top: 64px;
  position: relative;
  overflow-x: hidden;
  /* 仅隐藏外层页面滚动，保留卡片内滚动 */
  overflow-y: hidden;
}

/* ==================== 装饰背景 ==================== */
.decor-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  z-index: 0;
  pointer-events: none;
  animation: float-orb 25s ease-in-out infinite;
}

.orb-1 { 
  width: 500px; 
  height: 500px; 
  background: linear-gradient(135deg, #1E88E5, #26C6DA); 
  top: -180px; 
  left: -150px; 
  animation-delay: 0s; 
}

.orb-2 { 
  width: 400px; 
  height: 400px; 
  background: linear-gradient(135deg, #FF6F3C, #FFB74D); 
  bottom: -100px; 
  right: -120px; 
  animation-delay: 8s; 
}

.orb-3 { 
  width: 350px; 
  height: 350px; 
  background: linear-gradient(135deg, #26C6DA, #4DB6AC); 
  top: 50%; 
  right: 10%; 
  animation-delay: 16s; 
}

.orb-4 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #FF7B9C, #FFB3C6);
  top: 20%;
  left: 15%;
  animation-delay: 12s;
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(30px, -25px) scale(1.1) rotate(90deg); }
  50% { transform: translate(-20px, 20px) scale(0.9) rotate(180deg); }
  75% { transform: translate(25px, 30px) scale(1.05) rotate(270deg); }
}

/* ==================== 容器布局 ==================== */
:global(#app) {
  max-width: none;
  margin: 0;
  padding: 0;
}

@media (min-width: 1024px) {
  :global(body) {
    display: block;
  }
  :global(#app) {
    display: block;
    grid-template-columns: none;
    padding: 0;
  }
}

.main-container {
  max-width: 900px;
  margin: 40px auto 80px;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.page-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 48px;
  padding-bottom: 120px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  /* 使卡片在视窗内可滚动 */
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ==================== Hero 区域 ==================== */
.page-hero {
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 2px solid rgba(30, 136, 229, 0.1);
  position: relative;
}

.hero-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.hero-icon {
  font-size: 64px;
  display: inline-block;
  animation: bounce-gentle 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(30, 136, 229, 0.3));
}

@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.hero-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 20px;
  opacity: 0;
  animation: sparkle 2s ease-in-out infinite;
}

.sparkle-1 {
  top: 0;
  right: 0;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 50%;
  left: -10px;
  animation-delay: 0.7s;
}

.sparkle-3 {
  bottom: 0;
  right: -10px;
  animation-delay: 1.4s;
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.1), rgba(38, 198, 218, 0.1));
  border: 1.5px solid rgba(30, 136, 229, 0.2);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.15);
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.hero-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 136, 229, 0.25);
}

.badge-icon {
  font-size: 16px;
  animation: rotate-gentle 4s linear infinite;
}

@keyframes rotate-gentle {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 0.5; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.page-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.title-gradient {
  background: linear-gradient(135deg, #1E88E5 0%, #26C6DA 50%, #FF6F3C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% auto;
  animation: gradient-shift 5s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 32px;
}

.subtitle-highlight {
  color: var(--color-primary);
  font-weight: 600;
  padding: 2px 8px;
  background: rgba(30, 136, 229, 0.08);
  border-radius: 4px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.feature-card {
  background: white;
  border: 1.5px solid rgba(30, 136, 229, 0.15);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(30, 136, 229, 0.2);
  border-color: var(--color-primary);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
  display: inline-block;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.2) rotate(5deg);
}

.feature-text {
  text-align: center;
}

.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 12px;
  color: #999;
}

/* ==================== 输入区域包装器 ==================== */
.input-section-wrapper {
  margin-bottom: 32px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  font-size: 24px;
}

.optional-badge {
  font-size: 12px;
  font-weight: 500;
  color: #999;
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 999px;
  margin-left: 8px;
}

/* ==================== Tab 切换 ==================== */
.tab-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
  padding: 6px;
  background: rgba(30, 136, 229, 0.05);
  border-radius: 16px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tab-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.tab-item:hover::before {
  opacity: 0.5;
}

.tab-item.active {
  background: white;
  border-color: var(--color-primary);
  box-shadow: 
    0 4px 12px rgba(30, 136, 229, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-item.active::before {
  opacity: 1;
}

.tab-icon {
  font-size: 28px;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.tab-item:hover .tab-icon,
.tab-item.active .tab-icon {
  transform: scale(1.1);
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  z-index: 1;
  flex: 1;
}

.tab-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
}

.tab-item.active .tab-label {
  color: var(--color-primary);
}

.tab-hint {
  font-size: 12px;
  color: #999;
  transition: color 0.3s ease;
}

.tab-item.active .tab-hint {
  color: var(--color-primary);
  opacity: 0.7;
}


/* ==================== 语音输入区域 ==================== */
.voice-input-area {
  padding: 48px 0;
}

.voice-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.mic-button {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1E88E5 0%, #26C6DA 100%);
  border: none;
  color: white;
  font-size: 64px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 12px 40px rgba(30, 136, 229, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
}

.mic-button::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.3), rgba(38, 198, 218, 0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.mic-button:hover {
  transform: scale(1.08);
  box-shadow: 
    0 16px 48px rgba(30, 136, 229, 0.5),
    0 8px 16px rgba(0, 0, 0, 0.15);
}

.mic-button:hover::before {
  opacity: 1;
}

.mic-button:active {
  transform: scale(0.98);
}

.mic-icon {
  font-size: 56px;
  position: relative;
  z-index: 2;
}

.mic-button.recording {
  background: linear-gradient(135deg, #FF6F3C 0%, #FFB74D 100%);
  animation: pulse-mic 1.5s ease-in-out infinite;
}

.mic-ripple {
  position: absolute;
  inset: -20px;
  border: 3px solid rgba(255, 111, 60, 0.5);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
}

.mic-button.recording .mic-ripple {
  animation: ripple-wave 2s ease-out infinite;
}

.mic-button.recording .mic-ripple.ripple-2 {
  animation-delay: 1s;
}

@keyframes pulse-mic {
  0%, 100% {
    box-shadow: 
      0 0 0 0 rgba(255, 111, 60, 0.7),
      0 12px 40px rgba(255, 111, 60, 0.4),
      0 4px 12px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 
      0 0 0 30px rgba(255, 111, 60, 0),
      0 16px 48px rgba(255, 111, 60, 0.5),
      0 8px 16px rgba(0, 0, 0, 0.15);
  }
}

@keyframes ripple-wave {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
}

.voice-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 12px 24px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.tip-icon {
  font-size: 20px;
}

.voice-tip.recording {
  color: var(--color-accent);
  background: rgba(255, 111, 60, 0.1);
  border: 2px solid rgba(255, 111, 60, 0.3);
}

.voice-tip.recognizing {
  color: var(--color-primary);
  background: rgba(30, 136, 229, 0.1);
  border: 2px solid rgba(30, 136, 229, 0.3);
}

.text-preview {
  margin-top: 40px;
  width: 100%;
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.03), rgba(38, 198, 218, 0.03));
  border-radius: 16px;
  padding: 24px;
  min-height: 140px;
  border: 2px solid rgba(30, 136, 229, 0.15);
  transition: all 0.3s ease;
}

.text-preview:hover {
  border-color: var(--color-primary);
  box-shadow: 0 8px 24px rgba(30, 136, 229, 0.15);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid rgba(30, 136, 229, 0.1);
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1a1a1a;
}

.preview-icon {
  font-size: 18px;
}

.preview-label {
  font-size: 15px;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.copy-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.copy-link:hover {
  background: rgba(30, 136, 229, 0.1);
}

.copy-icon {
  font-size: 16px;
}

.preview-content {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  outline: none;
  min-height: 80px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: text;
}

.preview-content:empty:before {
  content: attr(placeholder);
  color: #999;
}

.preview-content:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(30, 136, 229, 0.1);
}

.preview-content:focus {
  background: rgba(255, 255, 255, 0.8);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
}

.preview-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1.5px solid rgba(30, 136, 229, 0.1);
}

.preview-hint {
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 6px;
}

.retry-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.retry-link:hover {
  background: rgba(30, 136, 229, 0.1);
  transform: translateX(-2px);
}

.retry-icon {
  font-size: 16px;
  display: inline-block;
  transition: transform 0.3s ease;
}

.retry-link:hover .retry-icon {
  transform: rotate(180deg);
}

/* ==================== 文字输入区域 ==================== */
.text-input-area {
  position: relative;
}

.input-wrapper {
  position: relative;
}

.text-input {
  width: 100%;
  border: 2px solid rgba(30, 136, 229, 0.15);
  border-radius: 16px;
  padding: 20px;
  font-size: 15px;
  line-height: 1.8;
  resize: none;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  z-index: 1;
}

.text-input::placeholder {
  color: #999;
  line-height: 1.8;
}

.text-input:hover {
  border-color: rgba(30, 136, 229, 0.3);
}

.text-input:focus {
  border-color: var(--color-primary);
  box-shadow: 
    0 0 0 4px rgba(30, 136, 229, 0.1),
    0 8px 24px rgba(30, 136, 229, 0.15);
  outline: none;
}

.input-decoration {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  pointer-events: none;
  z-index: 0;
}

.input-glow {
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1E88E5, #26C6DA);
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(8px);
}

.text-input:focus ~ .input-decoration .input-glow {
  opacity: 0.2;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 0 4px;
}

.char-count {
  font-size: 13px;
  color: #999;
  font-weight: 500;
}

.count-current {
  color: var(--color-primary);
  font-weight: 600;
}

.count-separator {
  margin: 0 2px;
}

.input-tips {
  display: flex;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
  padding: 4px 10px;
  background: rgba(30, 136, 229, 0.05);
  border-radius: 999px;
}

.item-icon {
  font-size: 14px;
}


/* ==================== 补充信息区域 ==================== */
.additional-info {
  margin-top: 48px;
}

.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.05), rgba(38, 198, 218, 0.05));
  border: 2px solid rgba(30, 136, 229, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.collapse-header:hover {
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.08), rgba(38, 198, 218, 0.08));
  border-color: rgba(30, 136, 229, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.1);
}

.collapse-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-icon {
  font-size: 14px;
  color: var(--color-primary);
  transition: transform 0.3s ease;
  font-weight: bold;
}

.collapse-icon.open {
  transform: rotate(90deg);
}

.collapse-title {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 600;
}

.collapse-hint {
  font-size: 13px;
  color: #999;
}

.collapse-content {
  padding: 32px 24px;
  background: white;
  border: 2px solid rgba(30, 136, 229, 0.1);
  border-top: none;
  border-radius: 0 0 16px 16px;
  margin-top: -4px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.label-icon {
  font-size: 18px;
}

.label-hint {
  font-size: 12px;
  font-weight: 400;
  color: #999;
  margin-left: 4px;
}

.modern-input {
  border-radius: 12px !important;
  border: 2px solid rgba(30, 136, 229, 0.15) !important;
  transition: all 0.3s ease !important;
}

.modern-input:hover {
  border-color: rgba(30, 136, 229, 0.3) !important;
}

.modern-input:focus,
.modern-input.ant-input-focused {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.1) !important;
}

.input-with-suffix {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-input-number {
  flex: 1;
  width: 100% !important;
}

.input-suffix {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  padding: 8px 12px;
  background: rgba(30, 136, 229, 0.08);
  border-radius: 8px;
}

.preference-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.preference-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  border: 2px solid rgba(30, 136, 229, 0.15);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: white;
  position: relative;
  overflow: hidden;
}

.preference-chip::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.1), rgba(38, 198, 218, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preference-chip:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.2);
}

.preference-chip:hover::before {
  opacity: 0.5;
}

.chip-check {
  font-size: 16px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  color: var(--color-primary);
  font-weight: bold;
}

.preference-chip.selected {
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.1), rgba(38, 198, 218, 0.1));
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(30, 136, 229, 0.25);
}

.preference-chip.selected .chip-check {
  opacity: 1;
  transform: scale(1);
}

.chip-text {
  position: relative;
  z-index: 1;
}

/* ==================== 生成按钮区域 ==================== */
.generate-section {
  position: relative;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 20%, rgba(255,255,255,1) 100%);
  backdrop-filter: blur(10px);
  padding: 40px 0 24px;
  margin-top: 48px;
  z-index: 10;
}

.generate-card {
  text-align: center;
  padding: 24px;
  background: white;
  border-radius: 20px;
  border: 2px solid rgba(30, 136, 229, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* 进度条 */
.progress-wrapper {
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(30, 136, 229, 0.1);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1E88E5 0%, #26C6DA 100%);
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 500;
}

.progress-icon {
  font-size: 18px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.progress-label {
  flex: 1;
}

.progress-percent {
  font-weight: 600;
  color: #1a1a1a;
}

.progress-hint {
  margin-top: 12px;
  font-size: 13px;
  color: #666;
  text-align: center;
  line-height: 1.5;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #1E88E5;
}

.generate-btn {
  height: 56px !important;
  padding: 0 48px !important;
  background: linear-gradient(135deg, #1E88E5 0%, #26C6DA 100%) !important;
  border: none !important;
  border-radius: 28px !important;
  font-size: 17px !important;
  font-weight: 700 !important;
  box-shadow: 
    0 8px 24px rgba(30, 136, 229, 0.35),
    0 2px 8px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  position: relative;
  overflow: hidden;
}

.generate-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.02) !important;
  box-shadow: 
    0 12px 32px rgba(30, 136, 229, 0.45),
    0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.generate-btn:hover::before {
  opacity: 1;
}

.generate-btn:active:not(:disabled) {
  transform: translateY(-2px) scale(0.98) !important;
}

.generate-btn:disabled {
  background: linear-gradient(135deg, #ccc, #ddd) !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  transform: none !important;
}

.btn-icon {
  font-size: 20px;
  margin-right: 8px;
  display: inline-block;
  animation: icon-pulse 2s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.generate-btn:disabled .btn-icon {
  animation: icon-spin 1s linear infinite;
}

@keyframes icon-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-text {
  position: relative;
  z-index: 1;
}

.generate-footer {
  margin-top: 16px;
}

.footer-features {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 13px;
  color: #666;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-separator {
  color: #ddd;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 768px) {
  .main-container {
    margin: 24px auto 60px;
    padding: 0 16px;
  }

  .page-card {
    padding: 32px 24px;
    padding-bottom: 100px;
    border-radius: 20px;
    max-height: calc(100vh - 100px);
  }

  .page-title {
    font-size: 32px;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .feature-card {
    padding: 16px 12px;
  }

  .feature-icon {
    font-size: 28px;
  }

  .feature-title {
    font-size: 13px;
  }

  .mic-button {
    width: 120px;
    height: 120px;
    font-size: 52px;
  }

  .mic-icon {
    font-size: 48px;
  }

  .tab-container {
    gap: 12px;
  }

  .tab-item {
    padding: 14px 16px;
  }

  .tab-icon {
    font-size: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .preference-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .generate-btn {
    width: 100%;
    padding: 0 32px !important;
  }

  .footer-features {
    flex-direction: column;
    gap: 8px;
  }

  .footer-separator {
    display: none;
  }
}

@media (max-width: 480px) {
  .page-card {
    padding: 24px 16px;
    padding-bottom: 80px;
    max-height: calc(100vh - 90px);
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .hero-badge {
    font-size: 11px;
    padding: 8px 14px;
    flex-wrap: wrap;
  }

  .feature-grid {
    gap: 10px;
  }

  .mic-button {
    width: 100px;
    height: 100px;
  }

  .mic-icon {
    font-size: 40px;
  }

  .preference-grid {
    gap: 10px;
  }

  .preference-chip {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
