/**
 * 阿里云百炼 Paraformer 录音文件识别 REST API
 * 文档：https://help.aliyun.com/zh/model-studio/paraformer-recorded-speech-recognition-restful-api
 * 
 * 通过后端 API 实现：音频文件上传和 ASR 调用都在后端完成
 */

import { useUserStore } from '@/stores/user'

// 获取 API Key（优先使用用户配置的，否则使用环境变量）
function getApiKey(): string {
  const userStore = useUserStore()
  return userStore.apiKey || import.meta.env.VITE_PF_API_KEY || ''
}

export type TranscriptionResult = {
  file_url: string
  properties: {
    audio_format: string
    channels: number[]
    original_sampling_rate: number
    original_duration_in_milliseconds: number
  }
  transcripts: Array<{
    channel_id: number
    content_duration_in_milliseconds: number
    text: string
    sentences?: Array<{
      begin_time: number
      end_time: number
      text: string
    }>
  }>
}

/**
 * 完整的录音识别流程
 * 通过后端 API 实现，一次调用完成上传、识别、获取结果
 */
export async function recognizeAudioBlob(blob: Blob): Promise<string> {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    throw new Error('请先在顶部导航栏配置 API 密钥')
  }

  // 创建 FormData 上传音频文件
  const formData = new FormData()
  formData.append('file', blob, 'recording.webm')
  formData.append('api_key', apiKey)

  const response = await fetch('/api/backend/asr/recognize', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || error.message || '语音识别失败')
  }

  const result = await response.json()
  return result.text
}
