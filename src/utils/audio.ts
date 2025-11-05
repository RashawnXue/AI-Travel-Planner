/**
 * 音频工具：采集麦克风、录制为 WAV 文件
 */

export type RecorderControl = {
  start: () => Promise<void>
  stop: () => Promise<Blob>
  isRunning: () => boolean
}

/**
 * 创建麦克风录音器，返回 WAV Blob
 */
export function createWavRecorder(): RecorderControl {
  let mediaRecorder: MediaRecorder | null = null
  let audioChunks: Blob[] = []
  let running = false

  async function start() {
    if (running) return
    running = true
    audioChunks = []

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm'
    })

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    mediaRecorder.start()
  }

  async function stop(): Promise<Blob> {
    running = false
    
    return new Promise((resolve) => {
      if (!mediaRecorder) {
        resolve(new Blob())
        return
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' })
        
        mediaRecorder?.stream.getTracks().forEach(track => track.stop())
        mediaRecorder = null
        audioChunks = []
        
        resolve(blob)
      }

      mediaRecorder.stop()
    })
  }

  return {
    start,
    stop,
    isRunning: () => running
  }
}


