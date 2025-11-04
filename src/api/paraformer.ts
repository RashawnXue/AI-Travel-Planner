/**
 * 阿里云百炼 Paraformer 实时语音识别 WebSocket 客户端
 * 参考文档：https://help.aliyun.com/zh/model-studio/websocket-for-paraformer-real-time-service
 *
 * 说明：浏览器环境无法自定义 WS Header，常见做法是通过子协议或查询参数传 token。
 * 这里优先使用子协议传递：Sec-WebSocket-Protocol = `dashscope.${token}`；
 * 若服务端要求 query 方式，也支持通过 `?token=...` 传递。
 */

export type ParaformerConfig = {
  endpoint?: string // 可覆盖默认端点
  apiKey: string // DashScope API Key 或临时 Token
  model?: string // paraformer-realtime-v2 / paraformer-realtime-8k-v2 / ...
  sampleRate?: number // 16000 / 8000
  format?: 'pcm_s16le' | 'opus' | 'speex'
  queryAuth?: boolean // 将 token 以 query 传参（兼容某些网关限制）
}

export type ParaformerClient = {
  connect: () => Promise<void>
  sendAudio: (chunk: Uint8Array) => void
  end: () => void
  close: () => void
  onResult: (cb: (data: any) => void) => void
  onError: (cb: (err: any) => void) => void
  isOpen: () => boolean
}

function buildUrl(cfg: ParaformerConfig): string {
  const endpoint = cfg.endpoint || 'wss://dashscope.aliyuncs.com/api-ws/v1/paraformer'
  const params = new URLSearchParams()
  if (cfg.model) params.set('model', cfg.model)
  if (cfg.sampleRate) params.set('sample_rate', String(cfg.sampleRate))
  if (cfg.format) params.set('format', cfg.format)
  if (cfg.queryAuth) params.set('token', cfg.apiKey)
  const qs = params.toString()
  return qs ? `${endpoint}?${qs}` : endpoint
}

export function createParaformerClient(cfg: ParaformerConfig): ParaformerClient {
  let ws: WebSocket | null = null
  let resultHandler: ((data: any) => void) | null = null
  let errorHandler: ((err: any) => void) | null = null

  async function connect(): Promise<void> {
    const url = buildUrl(cfg)
    return new Promise((resolve, reject) => {
      try {
        const protocols = cfg.queryAuth ? [] : [`dashscope.${cfg.apiKey}`]
        ws = new WebSocket(url, protocols)
        ws.binaryType = 'arraybuffer'
        const timer = setTimeout(() => {
          try { ws?.close() } catch {}
          reject(new Error('WebSocket open timeout'))
        }, 8000)
        ws.onopen = () => { clearTimeout(timer); resolve() }
        ws.onerror = (e) => { clearTimeout(timer); errorHandler && errorHandler(e); reject(e) }
        ws.onmessage = (evt) => {
          try {
            const data = typeof evt.data === 'string' ? JSON.parse(evt.data) : evt.data
            resultHandler && resultHandler(data)
          } catch (err) {
            errorHandler && errorHandler(err)
          }
        }
        ws.onclose = (evt) => {
          const info = { code: evt.code, reason: evt.reason, wasClean: evt.wasClean }
          errorHandler && errorHandler(info)
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  function sendAudio(chunk: Uint8Array) {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(chunk)
  }

  function end() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // 百炼通常使用关闭连接作为结束标识；若需要显式 finish，可发送特定 JSON，留空以兼容
      try { ws.close() } catch {}
    }
  }

  function close() {
    try { ws?.close() } catch {}
    ws = null
  }

  function onResult(cb: (data: any) => void) { resultHandler = cb }
  function onError(cb: (err: any) => void) { errorHandler = cb }
  function isOpen() { return !!ws && ws.readyState === WebSocket.OPEN }

  return { connect, sendAudio, end, close, onResult, onError, isOpen }
}

/**
 * 解析 Paraformer 的识别结果到纯文本。
 * 文档示例中可能返回字段：`result` / `output` / `text` 等。
 */
export function parseParaformerText(payload: any): string | null {
  if (!payload) return null
  // 常见结构尝试
  if (typeof payload.text === 'string') return payload.text
  if (payload?.result?.text) return String(payload.result.text)
  if (payload?.output?.text) return String(payload.output.text)
  // 某些实现返回 tokens / words 列表
  const words = payload?.result?.words || payload?.output?.words
  if (Array.isArray(words)) {
    return words.map((w: any) => (typeof w === 'string' ? w : w?.word || '')).join('') || null
  }
  return null
}


