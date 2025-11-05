import express from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'

const app = express()
const upload = multer({ dest: 'temp/' })

const PORT = 3001
const API_KEY = process.env.DASHSCOPE_API_KEY || ''
const SUBMIT_URL = 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription'
const QUERY_URL_BASE = 'https://dashscope.aliyuncs.com/api/v1/tasks'

app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// 提供临时文件的公网访问
app.use('/temp-audio', express.static('temp'))

async function submitAsrTask(fileUrl) {
  const response = await fetch(SUBMIT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable'
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

async function queryAsrTask(taskId) {
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

async function getTranscriptionText(transcriptionUrl) {
  const response = await fetch(transcriptionUrl)
  if (!response.ok) {
    throw new Error('获取识别结果失败')
  }

  const result = await response.json()
  return result.transcripts.map(t => t.transcript).join('\n')
}

app.post('/api/asr/recognize', upload.single('audio'), async (req, res) => {
  let tempFilePath = null
  
  try {
    if (!req.file) {
      return res.status(400).json({ message: '缺少音频文件' })
    }

    tempFilePath = req.file.path
    const publicUrl = `http://localhost:${PORT}/temp-audio/${path.basename(tempFilePath)}`

    console.log('临时文件已保存:', tempFilePath)
    console.log('公网 URL:', publicUrl)

    // 提交识别任务
    const taskId = await submitAsrTask(publicUrl)
    console.log('任务已提交:', taskId)

    // 轮询查询任务状态
    let attempts = 0
    const maxAttempts = 60

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const result = await queryAsrTask(taskId)
      console.log(`查询结果 (${attempts + 1}/${maxAttempts}):`, result.output.task_status)

      if (result.output.task_status === 'SUCCEEDED') {
        const transcriptionUrl = result.output.results?.[0]?.transcription_url
        if (!transcriptionUrl) {
          throw new Error('未获取到识别结果 URL')
        }

        const text = await getTranscriptionText(transcriptionUrl)
        
        // 删除临时文件
        await fs.unlink(tempFilePath)
        console.log('临时文件已删除:', tempFilePath)

        return res.json({ text })
      } else if (result.output.task_status === 'FAILED') {
        const errorMsg = result.output.results?.[0]?.message || '识别失败'
        throw new Error(errorMsg)
      }

      attempts++
    }

    throw new Error('识别超时，请稍后重试')
  } catch (error) {
    console.error('识别失败:', error)
    
    // 删除临时文件
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath)
        console.log('临时文件已删除:', tempFilePath)
      } catch (e) {
        console.error('删除临时文件失败:', e)
      }
    }

    res.status(500).json({
      message: error.message || '语音识别失败'
    })
  }
})

// 确保 temp 目录存在
await fs.mkdir('temp', { recursive: true })

app.listen(PORT, () => {
  console.log(`ASR 代理服务运行在 http://localhost:${PORT}`)
  console.log(`请确保已设置环境变量 DASHSCOPE_API_KEY`)
})
