/**
 * 讯飞实时语音转写 WebSocket API
 * - 生成签名并完成握手
 * - 推流 PCM 16k Int16 分片
 * - 回传转写结果与错误
 */

export type IflyConfig = {
  appId: string
  accessKeyId: string
  accessKeySecret: string
  endpoint?: string // 可覆盖默认地址
}

export type IflyParams = {
  uuid?: string
  utc?: string
  lang?: string // e.g. 'autodialect'
  audio_encode?: string // e.g. 'pcm_s16le' | 'opus-wb' | 'speex-7' | 'speex-10'
  samplerate?: number // 16000 when pcm
  role_type?: number // 0 | 2
  feature_ids?: string
  eng_spk_match?: number // 0 | 1
  pd?: string
  eng_punc?: string
  eng_vad_mdn?: number // 1 | 2
}

export type IflyClient = {
  connect: () => Promise<void>
  sendAudio: (chunk: Uint8Array) => void
  end: (sessionId: string) => void
  close: () => void
  onResult: (cb: (data: any) => void) => void
  onError: (cb: (err: any) => void) => void
  isOpen: () => boolean
}

function encodeQuery(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined)
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}

function formatUtcOffsetString(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const min = pad(date.getMinutes())
  const sec = pad(date.getSeconds())
  const tz = -date.getTimezoneOffset() // minutes east of UTC
  const sign = tz >= 0 ? '+' : '-'
  const tzAbs = Math.abs(tz)
  const tzHH = pad(Math.floor(tzAbs / 60))
  const tzMM = pad(tzAbs % 60)
  // 返回未编码的 UTC 字符串（冒号保持原样），交由 encodeQuery 统一编码
  return `${year}-${month}-${day}T${hour}:${min}:${sec}${sign}${tzHH}${tzMM}`
}

async function hmacSha1Base64(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  const uint8 = new Uint8Array(signature)
  // 使用浏览器内置 btoa 进行 Base64 编码
  let binary = ''
  for (let i = 0; i < uint8.byteLength; i++) binary += String.fromCharCode(uint8[i])
  return btoa(binary)
}

export function createIflyAsrClient(cfg: IflyConfig, params: IflyParams = {}): IflyClient {
  const endpoint = cfg.endpoint || 'wss://office-api-ast-dx.iflyaisol.com/ast/communicate/v1'
  let ws: WebSocket | null = null
  let resultHandler: ((data: any) => void) | null = null
  let errorHandler: ((err: any) => void) | null = null

  async function buildUrl(): Promise<string> {
    const baseParams: Record<string, string | number | undefined> = {
      appId: cfg.appId,
      accessKeyId: cfg.accessKeyId,
      uuid: params.uuid,
      // 注意：utc 需包含时区偏移。这里返回未编码版本，encodeQuery 会对冒号进行一次 URL 编码
      utc: params.utc || formatUtcOffsetString(),
      lang: params.lang || 'autodialect',
      audio_encode: params.audio_encode || 'pcm_s16le',
      samplerate: params.samplerate || 16000,
      role_type: params.role_type,
      feature_ids: params.feature_ids,
      eng_spk_match: params.eng_spk_match,
      pd: params.pd,
      eng_punc: params.eng_punc,
      eng_vad_mdn: params.eng_vad_mdn
    }
    const baseString = encodeQuery(baseParams)
    const signature = await hmacSha1Base64(cfg.accessKeySecret, baseString)
    return `${endpoint}?${baseString}&signature=${encodeURIComponent(signature)}`
  }

  async function connect(): Promise<void> {
    const url = await buildUrl()
    return new Promise((resolve, reject) => {
      try {
        ws = new WebSocket(url)
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
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(chunk)
    }
  }

  function end(sessionId: string) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ end: true, sessionId }))
    }
  }

  function close() {
    try {
      ws?.close()
    } catch {}
    ws = null
  }

  function onResult(cb: (data: any) => void) {
    resultHandler = cb
  }

  function onError(cb: (err: any) => void) {
    errorHandler = cb
  }

  function isOpen() {
    return !!ws && ws.readyState === WebSocket.OPEN
  }

  return { connect, sendAudio, end, close, onResult, onError, isOpen }
}

export function parseIflyPartialText(payload: any): string | null {
  // 针对 #2.3.1 结构提取中文词内容 data.cn.st.rt.ws.cw.w
  try {
    const wsArr = payload?.data?.cn?.st?.rt?.[0]?.ws
    if (!Array.isArray(wsArr)) return null
    const words: string[] = []
    for (const wsItem of wsArr) {
      const cwArr = wsItem?.cw
      if (Array.isArray(cwArr)) {
        for (const cw of cwArr) {
          const w = cw?.w
          if (typeof w === 'string') words.push(w)
        }
      }
    }
    return words.length ? words.join('') : null
  } catch {
    return null
  }
}


