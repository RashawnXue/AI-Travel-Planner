/**
 * 音频工具：采集麦克风、下采样至 16k、转换 PCM Int16、分片发送
 */

export type RecorderControl = {
  start: () => Promise<void>
  stop: () => Promise<void>
  isRunning: () => boolean
}

export type AudioSendCallback = (chunk: Uint8Array) => void

/**
 * 创建麦克风录音器：
 * - 采集浏览器默认采样率音频
 * - 下采样至 16k 单声道
 * - 转换为 Int16 PCM 并分片为 1280 字节（约 40ms）回调发送
 */
export function createPcm16kRecorder(onSend: AudioSendCallback): RecorderControl {
  let audioContext: AudioContext | null = null
  let source: MediaStreamAudioSourceNode | null = null
  let processor: ScriptProcessorNode | null = null
  let running = false

  async function start() {
    if (running) return
    running = true

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    source = audioContext.createMediaStreamSource(stream)
    // 使用较小缓冲提高实时性；4096 也可，根据设备情况调整
    processor = audioContext.createScriptProcessor(2048, 1, 1)

    processor.onaudioprocess = (e) => {
      if (!running) return
      const input = e.inputBuffer.getChannelData(0)
      const down = downsampleTo16k(input, audioContext!.sampleRate)
      const pcm = floatTo16BitPCM(down)
      // 分片为 1280 字节（40ms at 16k * 2 bytes）
      for (let offset = 0; offset < pcm.length; offset += 1280) {
        const slice = pcm.subarray(offset, Math.min(offset + 1280, pcm.length))
        onSend(slice)
      }
    }

    source.connect(processor)
    processor.connect(audioContext.destination)
  }

  async function stop() {
    running = false
    try {
      processor?.disconnect()
      source?.disconnect()
      await audioContext?.close()
    } catch {}
    processor = null
    source = null
    audioContext = null
  }

  return {
    start,
    stop,
    isRunning: () => running
  }
}

function downsampleTo16k(buffer: Float32Array, inputSampleRate: number): Float32Array {
  if (inputSampleRate === 16000) return buffer
  const sampleRateRatio = inputSampleRate / 16000
  const newLength = Math.round(buffer.length / sampleRateRatio)
  const result = new Float32Array(newLength)
  let offsetResult = 0
  let offsetBuffer = 0
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio)
    // 简单平均下采样
    let accum = 0
    let count = 0
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i]
      count++
    }
    result[offsetResult] = accum / (count || 1)
    offsetResult++
    offsetBuffer = nextOffsetBuffer
  }
  return result
}

function floatTo16BitPCM(input: Float32Array): Uint8Array {
  const buffer = new ArrayBuffer(input.length * 2)
  const view = new DataView(buffer)
  let offset = 0
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return new Uint8Array(buffer)
}


