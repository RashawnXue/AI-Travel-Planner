/**
 * 阿里云百炼 Paraformer 录音文件识别 REST API
 * 文档：https://help.aliyun.com/zh/model-studio/paraformer-recorded-speech-recognition-restful-api
 * 
 * 纯前端实现：音频文件上传到阿里云 OSS，然后调用 ASR API
 */

import OSS from 'ali-oss'

const API_KEY = import.meta.env.VITE_PF_API_KEY || ''
const SUBMIT_URL = '/api/dashscope/api/v1/services/audio/asr/transcription'
const QUERY_URL_BASE = '/api/dashscope/api/v1/tasks'

// OSS 配置
const OSS_CONFIG = {
  region: import.meta.env.VITE_OSS_REGION || 'oss-cn-shanghai',
  accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID || '',
  accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET || '',
  bucket: import.meta.env.VITE_OSS_BUCKET || '',
  secure: true // 使用 HTTPS
}

export type TranscriptionResult = {
  file_url: string
  properties: {
    audio_format: string
    channels: number[]
    original_sampling_rate: number
    original_duration: number
  }
  transcripts: Array<{
    channel_id: number
    content_duration: number
    transcript: string
    sentences?: Array<{
      begin_time: number
      end_time: number
      text: string
    }>
  }>
}

/**
 * 上传音频文件到 OSS
 */
async function uploadToOSS(blob: Blob): Promise<string> {
  const client = new OSS(OSS_CONFIG)
  
  const fileName = `recordings/${Date.now()}_${Math.random().toString(36).slice(2)}.webm`
  
  // 使用 put 方法上传，设置公共读权限和 CORS 头
  const result = await client.put(fileName, blob, {
    headers: {
      'Content-Type': 'audio/webm',
      'x-oss-object-acl': 'public-read'
    }
  })
  
  // 返回使用 HTTPS 的公网 URL
  return result.url.replace('http://', 'https://')
}

/**
 * 删除 OSS 临时文件
 */
async function deleteFromOSS(fileUrl: string): Promise<void> {
  try {
    const client = new OSS(OSS_CONFIG)
    const url = new URL(fileUrl)
    const fileName = url.pathname.substring(1) // 去掉开头的 /
    await client.delete(fileName)
    console.log('临时文件已删除:', fileName)
  } catch (e) {
    console.error('删除临时文件失败:', e)
  }
}

/**
 * 提交录音文件识别任务
 */
async function submitAsrTask(fileUrl: string): Promise<string> {
  const response = await fetch(SUBMIT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable',
      'X-DashScope-OssResourceResolve': 'enable'
    },
    body: JSON.stringify({
      model: 'paraformer-v2',
      input: {
        file_urls: [fileUrl]
      },
      parameters: {
        language_hints: ['zh', 'en']
      }
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '提交识别任务失败')
  }

  const result = await response.json()
  return result.output.task_id
}

/**
 * 查询任务状态和结果
 */
async function queryAsrTask(taskId: string): Promise<{
  output: {
    task_id: string
    task_status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED'
    results?: Array<{
      transcription_url?: string
      message?: string
    }>
  }
}> {
  const response = await fetch(`${QUERY_URL_BASE}/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '查询任务失败')
  }

  return await response.json()
}

/**
 * 获取识别结果文本
 */
async function getTranscriptionText(transcriptionUrl: string): Promise<string> {
  const response = await fetch(transcriptionUrl)
  if (!response.ok) {
    throw new Error('获取识别结果失败')
  }

  const result: TranscriptionResult = await response.json()
  
  return result.transcripts
    .map(t => t.transcript)
    .join('\n')
}

/**
 * 完整的录音识别流程
 */
export async function recognizeAudioBlob(blob: Blob): Promise<string> {
  let fileUrl: string | null = null
  
  try {
    // 1. 上传音频文件到 OSS 获取公网 URL
    console.log('正在上传音频文件到 OSS...')
    fileUrl = await uploadToOSS(blob)
    console.log('音频文件已上传:', fileUrl)
    
    // 2. 提交识别任务
    console.log('正在提交识别任务...')
    const taskId = await submitAsrTask(fileUrl)
    console.log('任务已提交:', taskId)
    
    // 3. 轮询查询任务状态
    let attempts = 0
    const maxAttempts = 60 // 最多轮询 60 次（约 1 分钟）
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const result = await queryAsrTask(taskId)
      console.log(`查询进度 (${attempts + 1}/${maxAttempts}):`, result.output.task_status)
      
      if (result.output.task_status === 'SUCCEEDED') {
        const transcriptionUrl = result.output.results?.[0]?.transcription_url
        if (!transcriptionUrl) {
          throw new Error('未获取到识别结果 URL')
        }
        
        // 4. 获取识别结果文本
        const text = await getTranscriptionText(transcriptionUrl)
        
        // 5. 删除临时文件
        await deleteFromOSS(fileUrl)
        
        return text
      } else if (result.output.task_status === 'FAILED') {
        const errorMsg = result.output.results?.[0]?.message || '识别失败'
        throw new Error(errorMsg)
      }
      
      attempts++
    }
    
    throw new Error('识别超时，请稍后重试')
  } catch (error) {
    // 出错时清理临时文件
    if (fileUrl) {
      await deleteFromOSS(fileUrl)
    }
    throw error
  }
}
