<template>
  <div class="create-plan-view">
    <AppHeader />
    
    <!-- 装饰背景元素 -->
    <div class="decor-orb orb-1"></div>
    <div class="decor-orb orb-2"></div>
    <div class="decor-orb orb-3"></div>

    <div class="main-container">
      <div class="page-card">
        <!-- 顶部 Hero 信息区 -->
        <div class="page-hero">
          <div class="hero-badge">✨ 智能生成 · 分钟级出片</div>
          <h1 class="page-title">创建新行程</h1>
          <p class="page-subtitle">告诉 AI 你的旅行需求，让我们为你规划完美行程</p>
          <div class="feature-list">
            <span class="feature-chip">🎤 语音输入</span>
            <span class="feature-chip">🧭 智能路线</span>
            <span class="feature-chip">💰 预算均衡</span>
            <span class="feature-chip">📅 日程细化</span>
          </div>
        </div>

        <!-- Tab 切换 -->
        <div class="tab-container">
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'voice' }"
            @click="activeTab = 'voice'"
          >
            <span class="tab-icon">🎤</span>
            <span>语音输入</span>
          </div>
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'text' }"
            @click="activeTab = 'text'"
          >
            <span class="tab-icon">⌨️</span>
            <span>文字输入</span>
          </div>
        </div>

        <!-- 语音输入区域 -->
        <div v-show="activeTab === 'voice'" class="voice-input-area">
          <button 
            class="mic-button" 
            :class="{ recording: isRecording }"
            @click="toggleRecording"
          >
            🎤
          </button>
          <div 
            class="voice-tip" 
            :class="{ recording: isRecording, recognizing: isRecognizing }"
          >
            {{ voiceTip }}
          </div>
          
          <div v-show="recognizedText" class="text-preview">
            <div class="preview-header">
              <span style="font-weight: 600;">识别结果：</span>
              <span class="retry-link" @click="retryVoice">重新录音</span>
            </div>
            <div 
              class="preview-content" 
              contenteditable="true"
              @input="onPreviewInput"
            >
              {{ recognizedText }}
            </div>
          </div>
        </div>

        <!-- 文字输入区域 -->
        <div v-show="activeTab === 'text'" class="text-input-area">
          <a-textarea
            v-model:value="textInput"
            :maxlength="500"
            :rows="10"
            placeholder="请描述你的旅行需求，例如：我想去日本旅行 5 天，预算 1 万元，喜欢美食和动漫，带孩子，希望行程轻松一些"
            class="text-input"
          />
          <div class="char-count">{{ textInput.length }}/500</div>
        </div>

        <!-- 补充信息 -->
        <div class="additional-info">
          <div class="collapse-header" @click="toggleCollapse">
            <span class="collapse-title">补充详细信息（可选）</span>
            <span class="collapse-arrow" :class="{ open: isCollapseOpen }">▼</span>
          </div>
          <div v-show="isCollapseOpen" class="collapse-content">
            <div class="collapse-hint">如果已在上方描述中包含这些信息，可以跳过此部分</div>
            
            <div class="form-row">
              <label class="form-label">旅行目的地</label>
              <a-input 
                v-model:value="formData.destination"
                placeholder="例如：日本东京"
                class="form-input"
              />
            </div>

            <div class="form-row">
              <label class="form-label">旅行天数</label>
              <a-input-number 
                v-model:value="formData.days"
                :min="1"
                :max="30"
                placeholder="例如：5"
                class="form-input-number"
              />
              <span class="input-suffix">天</span>
            </div>

            <div class="form-row">
              <label class="form-label">预算范围</label>
              <a-input-number 
                v-model:value="formData.budget"
                :min="0"
                :step="100"
                placeholder="例如：10000"
                class="form-input-number"
              />
              <span class="input-suffix">元</span>
            </div>

            <div class="form-row">
              <label class="form-label">同行人数</label>
              <a-input-number 
                v-model:value="formData.travelers"
                :min="1"
                :max="20"
                placeholder="例如：2"
                class="form-input-number"
              />
              <span class="input-suffix">人</span>
            </div>

            <div class="form-row">
              <label class="form-label">旅行偏好</label>
              <div class="checkbox-group">
                <div 
                  v-for="preference in preferenceOptions"
                  :key="preference"
                  class="checkbox-item"
                  :class="{ selected: formData.preferences.includes(preference) }"
                  @click="togglePreference(preference)"
                >
                  {{ preference }}
                </div>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label">出发日期</label>
              <a-date-picker 
                v-model:value="formData.startDate"
                placeholder="选择出发日期"
                class="form-input-date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </div>

        <!-- 生成按钮（底部粘性操作区） -->
        <div class="generate-section">
          <a-button 
            type="primary" 
            size="large"
            :loading="isGenerating"
            :disabled="!canGenerate"
            @click="generatePlan"
            class="generate-btn"
          >
            <template #icon>
              <span>✨</span>
            </template>
            生成行程
          </a-button>
          <div class="generate-hint">生成后可在详情页微调行程并一键导航</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { 
  Textarea as ATextarea,
  Input as AInput,
  InputNumber as AInputNumber,
  DatePicker as ADatePicker,
  Button as AButton
} from 'ant-design-vue'
import { supabase } from '@/utils/supabase'
import AppHeader from '@/components/common/AppHeader.vue'
import { invokeBailianApp, extractBailianText, parsePlanJsonFromText } from '@/api/ai'
import { createPlanFromAI } from '@/api/plan'
import type { AIResponse } from '@/types/plan'

const router = useRouter()

// Tab 状态
const activeTab = ref<'voice' | 'text'>('voice')

// 语音输入状态
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

// 折叠面板
const isCollapseOpen = ref(false)

// 表单数据
const formData = ref({
  destination: '',
  days: undefined as number | undefined,
  budget: undefined as number | undefined,
  travelers: undefined as number | undefined,
  preferences: [] as string[],
  startDate: undefined as string | undefined
})

// 偏好选项
const preferenceOptions = [
  '美食', '景点', '购物', '文化',
  '自然', '历史', '艺术', '运动',
  '亲子', '休闲', '冒险', '摄影'
]

// 生成状态
const isGenerating = ref(false)

// 是否可以生成
const canGenerate = computed(() => {
  if (activeTab.value === 'voice') {
    return recognizedText.value.trim().length > 0
  } else {
    return textInput.value.trim().length > 0
  }
})

// 切换录音
const toggleRecording = () => {
  if (!isRecording.value) {
    isRecording.value = true
    // TODO: 实际录音逻辑
  } else {
    isRecording.value = false
    isRecognizing.value = true
    
    // 模拟识别过程
    setTimeout(() => {
      isRecognizing.value = false
      recognizedText.value = '我想去日本旅行5天，预算1万元，喜欢美食和动漫，带孩子，希望行程轻松一些'
    }, 1500)
  }
}

// 重新录音
const retryVoice = () => {
  recognizedText.value = ''
}

// 预览内容输入
const onPreviewInput = (e: Event) => {
  const target = e.target as HTMLElement
  recognizedText.value = target.innerText
}

// 切换折叠
const toggleCollapse = () => {
  isCollapseOpen.value = !isCollapseOpen.value
}

// 切换偏好
const togglePreference = (preference: string) => {
  const index = formData.value.preferences.indexOf(preference)
  if (index > -1) {
    formData.value.preferences.splice(index, 1)
  } else {
    formData.value.preferences.push(preference)
  }
}

// 生成行程
const generatePlan = async () => {
  if (!canGenerate.value) return
  
  isGenerating.value = true
  try {
    // 1. 首先检查用户是否已登录
    const { data: userSession, error: userError } = await supabase.auth.getSession()
    console.log('Current user session:', userSession)
    
    if (userError || !userSession?.session?.user?.id) {
      message.error('请先登录后再生成行程')
      router.push('/auth/login')
      return
    }

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
    console.log('Sending prompt to AI:', prompt) // debug log

    // const res = await invokeBailianApp({ prompt })
    // console.log('AI response:', res) // debug log
    
    // if (res.error || !res.data) {
    //   throw new Error(res.error?.message || '调用 AI 接口失败')
    // }

    // // 从返回中提取文本并尝试解析为 JSON
    // const raw = res.data
    // const text = extractBailianText(raw) ?? (typeof raw === 'string' ? raw : JSON.stringify(raw))
    
    const text = `
{\n  \"title\": \"上海亲子动漫主题3日游\",\n  \"destination\": \"上海\",\n  \"days\": 3,\n  \"budget\": 8000,\n  \"travelers\": 2,\n  \"preferences\": [\"亲子\", \"动漫\", \"文化\"],\n  \"start_date\": \"2025-11-04\",\n  \"summary\": \"这是一次专为亲子家庭打造的上海动漫文化探索之旅。从外滩的经典地标到科技馆的互动体验，再到多家高品质亲子餐厅与动漫主题空间，行程兼顾趣味性、教育性和舒适度，让孩子在玩乐中感受科技与文化的魅力。\",\n\n  \"daily_plans\": [\n    {\n      \"day\": 1,\n      \"title\": \"外滩初印象 + 动漫探秘\",\n      \"activities\": [\n        {\n          \"time\": \"09:30\",\n          \"title\": \"外滩晨游\",\n          \"location\": \"外滩\",\n          \"address\": \"黄浦区中山东一路\",\n          \"longitude\": 121.4903,\n          \"latitude\": 31.2362,\n          \"duration\": 90,\n          \"description\": \"漫步外滩，欣赏万国建筑群与浦东天际线，感受上海的历史与现代交融。\",\n          \"estimated_cost\": 0,\n          \"tips\": \"清晨人少适合拍照，注意孩子安全，避免靠近车流\",\n          \"photo\": \"http://store.is.autonavi.com/showpic/b9c402b7d34ea98654cc915e567761dd\"\n        },\n        {\n          \"time\": \"11:30\",\n          \"title\": \"午餐：Maggie&Rose亲子餐厅\",\n          \"location\": \"Maggie&Rose亲子餐厅(南丰城店)\",\n          \"address\": \"遵义路100号南丰城2层\",\n          \"longitude\": 121.4217,\n          \"latitude\": 31.2174,\n          \"duration\": 120,\n          \"description\": \"在温馨的亲子餐厅享用健康美味的儿童餐与成人料理，孩子可在游乐区玩耍。\",\n          \"estimated_cost\": 400,\n          \"tips\": \"建议提前预约靠窗座位，餐厅玩具较丰富\",\n          \"photo\": \"http://store.is.autonavi.com/showpic/3b7b4db3057686060e055a6dee745f91\"\n        },\n        {\n          \"time\": \"14:00\",\n          \"title\": \"秋叶原动漫中心探秘\",\n          \"location\": \"秋叶原\",\n          \"address\": \"南京东路340百联ZX创趣场F4层\",\n          \"longitude\": 121.4805,\n          \"latitude\": 31.2361,\n          \"duration\": 150,\n          \"description\": \"探访上海版秋叶原，体验动漫手办、周边商品与沉浸式二次元文化。\",\n          \"estimated_cost\": 300,\n          \"tips\": \"适合拍照打卡，可购买限量小礼品给孩子作为纪念\",\n          \"photo\": \"http://store.is.autonavi.com/showpic/4266f4f5e9fd19ea1994871f909c850b\"\n        },\n        {\n          \"time\": \"17:00\",\n          \"title\": \"樱动漫手办探店\",\n          \"location\": \"樱动漫手办\",\n          \"address\": \"百米香榭1层125号\",\n          \"longitude\": 121.4785,\n          \"latitude\": 31.2336,\n          \"duration\": 60,\n          \"description\": \"参观精品动漫手办店，欣赏高精度模型，了解动漫收藏文化。\",\n          \"estimated_cost\": 200,\n          \"tips\": \"店内禁止触摸展品，可咨询店主了解动漫制作背后的故事\",\n          \"photo\": \"https://aos-comment.amap.com/B0JBUZ7A5P/headerImg/1883d869e1e1190f19ee1e79594ad9f6_2048_2048_80.jpg\"\n        }\n      ]\n    },\n    {\n      \"day\": 2,\n      \"title\": \"科技启蒙 + 亲子时光\",\n      \"activities\": [\n        {\n          \"time\": \"10:00\",\n          \"title\": \"上海科技馆特展参观\",\n          \"location\": \"上海科技馆特展厅\",\n          \"address\": \"世纪大道2000号上海科技馆2层\",\n          \"longitude\": 121.5393,\n          \"latitude\": 31.2262,\n          \"duration\": 180,\n          \"description\": \"参观正在开放的特展厅，体验互动科技项目，激发孩子对科学的兴趣。\",\n          \"estimated_cost\": 200,\n          \"tips\": \"主馆装修中，请提前确认特展内容；建议携带水壶和小零食\",\n          \"photo\": \"http://store.is.autonavi.com/showpic/8671fa82afbaaab85ec4dbace971f735\"\n        },\n        {\n          \"time\": \"13:30\",\n          \"title\": \"午餐：lilliput粒粒堡亲子餐厅\",\n          \"location\": \"lilliput粒粒堡亲子餐厅(保利时光里店)\",\n          \"address\": \"瑞平路230号保利时光里F2层\",\n          \"longitude\": 121.4935,\n          \"latitude\": 31.2228,\n          \"duration\": 120,\n          \"description\": \"在宽敞明亮的亲子餐厅用餐，孩子可在独立游乐区自由活动。\",\n          \"estimated_cost\": 450,\n          \"tips\": \"餐厅提供婴儿椅和消毒湿巾，适合低龄儿童\",\n          \"photo\": \"http://store.is.autonavi.com/showpic/099529dfd90952495c52d98233ce9706\"\n        },\n        {\n          \"time\": \"16:00\",\n          \"title\": \"科技馆下沉广场休闲\",\n          \"location\": \"上海科技馆下沉式广场\",\n          \"address\": \"世纪大道2000号\",\n          \"longitude\": 121.5393,\n          \"latitude\": 31.2262,\n          \"duration\": 90,\n          \"description\": \"在科技馆外广场散步，观看喷泉与艺术装置，放松身心。\",\n          \"estimated_cost\": 0,\n          \"tips\": \"傍晚光线柔和，适合家庭合影\",\n          \"photo\": \"http://store.is.autonavi.com/showpic/e37f4924de51fd77825ee98bb5562e42\"\n        }\n      ]\n    },\n    {\n      \"day\": 3,\n      \"title\": \"动漫文化深度体验\",\n      \"activities\": [\n        {\n          \"time\": \"10:30\",\n          \"title\": \"天天玩X秋葉原日系动漫中心\",\n          \"location\": \"天天玩X秋葉原日系动漫中心\",\n          \"address\": \"华山路2088号汇银广场南楼7M层\",\n          \"longitude\": 121.4263,\n          \"latitude\": 31.2074,\n          \"duration\": 150,\n          \"description\": \"体验日系动漫主题空间，参与角色扮演、游戏互动与手工制作。\",\n          \"estimated_cost\": 350,\n          \"tips\": \"部分项目需额外收费，建议选择包含多个项目的套票\",\n          \"photo\": \"http://store.is.autonavi.com/showpic/fd69cb5598634778ffd8ac94fce7d6f2\"\n        },\n        {\n          \"time\": \"13:00\",\n          \"title\": \"午餐：twinkle耀童亲子餐厅\",\n          \"location\": \"twinkle耀童亲子餐厅(尚嘉店)\",\n          \"address\": \"仙霞路99号尚嘉中心L2层\",\n          \"longitude\": 121.3928,\n          \"latitude\": 31.1946,\n          \"duration\": 120,\n          \"description\": \"在高端亲子餐厅享用精致餐点，享受安静舒适的亲子时光。\",\n          \"estimated_cost\": 500,\n          \"tips\": \"餐厅环境优雅，适合记录成长瞬间，建议提前预约\",\n          \"photo\": \"http://store.is.autonavi.com/showpic/96793614e0131055174f333d816589f8\"\n        },\n        {\n          \"time\": \"15:30\",\n          \"title\": \"上海动漫博物馆参观\",\n          \"location\": \"上海动漫博物馆\",\n          \"address\": \"张江路69号\",\n          \"longitude\": 121.6488,\n          \"latitude\": 31.2087,\n          \"duration\": 120,\n          \"description\": \"了解中国动漫发展历程，观看经典动画展陈，参与互动体验项目。\",\n          \"estimated_cost\": 150,\n          \"tips\": \"博物馆设有儿童导览手册，可领取后边看边学\",\n          \"photo\": \"https://aos-comment.amap.com/B00156EC23/comment/50b35219acecf041bf30c572ea494b3f_2048_2048_80.jpg\"\n        }\n      ]\n    }\n  ],\n\n  \"accommodation\": [\n    {\n      \"day\": 1,\n      \"hotel_name\": \"上海陆家嘴上海中心亚朵酒店\",\n      \"address\": \"浦东大道580号\",\n      \"longitude\": 121.5176,\n      \"latitude\": 31.2351,\n      \"price_range\": \"¥600-900/晚\",\n      \"rating\": \"4.8星\",\n      \"reason\": \"地理位置优越，靠近科技馆与外滩，交通便利，房间安静舒适，适合家庭入住\",\n      \"photo\": \"http://store.is.autonavi.com/showpic/c46b8aa25ba531fd319a32db66b603a7\"\n    },\n    {\n      \"day\": 2,\n      \"hotel_name\": \"上海陆家嘴上海中心亚朵酒店\",\n      \"address\": \"浦东大道580号\",\n      \"longitude\": 121.5176,\n      \"latitude\": 31.2351,\n      \"price_range\": \"¥600-900/晚\",\n      \"rating\": \"4.8星\",\n      \"reason\": \"连续入住方便行李存放，周边餐饮选择多，步行可达地铁站\",\n      \"photo\": \"http://store.is.autonavi.com/showpic/c46b8aa25ba531fd319a32db66b603a7\"\n    },\n    {\n      \"day\": 3,\n      \"hotel_name\": \"上海陆家嘴上海中心亚朵酒店\",\n      \"address\": \"浦东大道580号\",\n      \"longitude\": 121.5176,\n      \"latitude\": 31.2351,\n      \"price_range\": \"¥600-900/晚\",\n      \"rating\": \"4.8星\",\n      \"reason\": \"便于最后一天退房前存放行李，继续轻松游玩\",\n      \"photo\": \"http://store.is.autonavi.com/showpic/c46b8aa25ba531fd319a32db66b603a7\"\n    }\n  ],\n\n  \"transportation\": {\n    \"overview\": \"上海市内交通便捷，建议使用地铁+打车结合方式。亲子出行推荐使用网约车（如滴滴）更舒适。主要景点间距离适中，单程交通时间控制在40分钟内。\",\n    \"details\": [\n      {\n        \"type\": \"地铁\",\n        \"route\": \"市内地铁出行（含换乘）\",\n        \"estimated_cost\": 100\n      },\n      {\n        \"type\": \"网约车\",\n        \"route\": \"每日短途接送及大件行李运输\",\n        \"estimated_cost\": 600\n      },\n      {\n        \"type\": \"停车费\",\n        \"route\": \"商场及景区临时停车\",\n        \"estimated_cost\": 150\n      }\n    ]\n  },\n\n  \"budget_breakdown\": {\n    \"transportation\": 850,\n    \"accommodation\": 2400,\n    \"food\": 2000,\n    \"activities\": 1500,\n    \"shopping\": 800,\n    \"other\": 450,\n    \"total\": 8000\n  }\n}
`
    console.log('Extracted text:', text) // debug log
    
    const aiObj = parsePlanJsonFromText<AIResponse>(text)
    if (!aiObj) {
      throw new Error('无法从 AI 返回中解析出有效的 JSON 行程数据')
    }

    console.log('Parsed AI response:', aiObj) // debug log

    const createRes = await createPlanFromAI(aiObj)
    if (createRes.error || !createRes.data) {
      throw new Error(createRes.error?.message || '持久化行程失败')
    }

    message.success('行程生成并保存成功！')
    // 生成成功后返回首页
    router.push('/')
  } catch (err) {
    const e = err as Error
    console.error('Generate plan error:', e)
    message.error(e.message || '生成行程失败')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.create-plan-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 64px;
}

/* 装饰渐变球背景 */
.create-plan-view {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

.decor-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  z-index: 0;
  pointer-events: none;
  animation: float-orb 22s ease-in-out infinite;
}

.orb-1 { width: 420px; height: 420px; background: var(--gradient-sunset); top: -120px; left: -120px; animation-delay: 0s; }
.orb-2 { width: 360px; height: 360px; background: var(--gradient-tropical); bottom: -140px; right: -140px; animation-delay: 6s; }
.orb-3 { width: 300px; height: 300px; background: var(--gradient-paradise); top: 40%; left: 60%; animation-delay: 12s; }

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(24px, -20px) scale(1.08); }
  66% { transform: translate(-18px, 16px) scale(0.95); }
}

/* 覆盖全局 #app 在本页面的布局，确保卡片覆盖全宽 */
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
  max-width: 800px;
  margin: 40px auto;
  padding: 0 24px;
}

.page-card {
  width: 100%;
  min-height: calc(100vh - 64px);
  border-radius: 0;
  box-shadow: none;
  padding: 32px 32px 48px;
  position: relative;
  z-index: 1;
}

/* Hero 信息区 */
.page-hero {
  margin-bottom: 16px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(30, 136, 229, 0.08);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.12);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

.feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.feature-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #eee;
  border-radius: 999px;
  font-size: 12px;
  color: #555;
}

/* Tab 切换 */
.tab-container {
  display: flex;
  border-bottom: 2px solid #e8e8e8;
  margin-bottom: 32px;
}

.tab-item {
  padding: 12px 24px;
  cursor: pointer;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tab-item.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}

/* 语音输入 */
.voice-input-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.mic-button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--gradient-ocean);
  border: none;
  color: white;
  font-size: 48px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(30, 136, 229, 0.3);
}

.mic-button:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(30, 136, 229, 0.4);
}

.mic-button.recording {
  background: var(--gradient-sunset);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 111, 60, 0.7);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(255, 111, 60, 0);
  }
}

.voice-tip {
  margin-top: 24px;
  font-size: 16px;
  color: #666;
  transition: color 0.3s;
}

.voice-tip.recording {
  color: var(--color-accent);
  font-weight: 600;
}

.voice-tip.recognizing {
  color: var(--color-primary);
  font-weight: 600;
}

.text-preview {
  margin-top: 32px;
  width: 100%;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  min-height: 120px;
  border: 1px solid #e8e8e8;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}

.preview-content {
  font-size: 14px;
  line-height: 1.6;
  color: #1a1a1a;
  outline: none;
}

.retry-link {
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.3s;
}

.retry-link:hover {
  opacity: 0.8;
}

/* 文字输入 */
.text-input-area {
  position: relative;
}

.text-input {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  font-family: inherit;
  transition: border-color 0.3s;
}

.text-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.char-count {
  text-align: right;
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

/* 补充信息 */
.additional-info {
  margin-top: 24px;
}

.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.collapse-header:hover {
  background: #f0f0f0;
}

.collapse-title {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.collapse-arrow {
  color: #666;
  transition: transform 0.3s;
  font-size: 12px;
}

.collapse-arrow.open {
  transform: rotate(180deg);
}

.collapse-content {
  padding: 24px 16px;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-radius: 0 0 8px 8px;
  margin-top: -8px;
}

.collapse-hint {
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
}

.form-row {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
}

.form-input-number {
  width: 200px;
}

.form-input-date {
  width: 200px;
}

.input-suffix {
  margin-left: 8px;
  color: #666;
  font-size: 14px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.checkbox-item {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
}

.checkbox-item:hover {
  border-color: var(--color-primary);
}

.checkbox-item.selected {
  background: rgba(30, 136, 229, 0.06);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 500;
}

/* 生成按钮 */
.generate-section {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 60%);
  padding: 24px 0 8px;
  margin-top: 40px;
  text-align: center;
}

.generate-btn {
  height: 48px;
  padding: 0 56px;
  background: var(--gradient-ocean);
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
  transition: all 0.3s;
}

.generate-hint {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 136, 229, 0.4);
}

.generate-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  box-shadow: none;
}

/* 响应式 */
@media (max-width: 768px) {
  .main-container {
    margin: 24px auto;
    padding: 0 16px;
  }

  .page-card {
    padding: 24px 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .mic-button {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }

  .checkbox-group {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-input-number,
  .form-input-date {
    width: 150px;
  }
}
</style>

