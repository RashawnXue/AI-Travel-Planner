export function createParaformerClient(cfg) {
  const apiKey = cfg.apiKey;
  const baseUrl = cfg.endpoint || 'wss://dashscope.aliyuncs.com/api-ws/v1/inference/';
  const url = `${baseUrl}?token=${apiKey}`;
  
  let ws = null;
  let resultHandler = null;
  let errorHandler = null;
  let taskStarted = false;
  
  const TASK_ID = typeof crypto.randomUUID === 'function' 
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 32)
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 18);

  function connect() {
    return new Promise((resolve, reject) => {
      ws = new WebSocket(url);
      ws.addEventListener('open', () => {
        console.log('连接到服务器');
        sendRunTask();
      });

      ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        switch (message.header.event) {
          case 'task-started':
            console.log('任务开始');
            taskStarted = true;
            resolve();
            break;
          case 'result-generated':
            console.log('识别结果：', message.payload.output.sentence.text);
            if (message.payload.usage) {
              console.log('任务计费时长（秒）：', message.payload.usage.duration);
            }
            if (resultHandler) resultHandler(message);
            break;
          case 'task-finished':
            console.log('任务完成');
            if (resultHandler) resultHandler(message);
            ws.close();
            break;
          case 'task-failed':
            console.error('任务失败：', message.header.error_message);
            if (errorHandler) errorHandler(message.header.error_message);
            ws.close();
            break;
          default:
            console.log('未知事件：', message.header.event);
        }
      });

      ws.addEventListener('close', () => {
        if (!taskStarted) {
          console.error('任务未启动，关闭连接');
          if (errorHandler) errorHandler(new Error('任务未启动'));
        }
      });

      ws.addEventListener('error', (error) => {
        console.error('WebSocket错误：', error);
        if (errorHandler) errorHandler(error);
        reject(error);
      });
    });
  }

  function sendRunTask() {
    const runTaskMessage = {
      header: {
        action: 'run-task',
        task_id: TASK_ID,
        streaming: 'duplex'
      },
      payload: {
        task_group: 'audio',
        task: 'asr',
        function: 'recognition',
        model: cfg.model || 'paraformer-realtime-v2',
        parameters: {
          sample_rate: cfg.sampleRate || 16000,
          format: cfg.format || 'pcm_s16le'
        },
        input: {}
      }
    };
    ws.send(JSON.stringify(runTaskMessage));
  }

  function sendAudio(chunk) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(chunk);
    }
  }

  function end() {
    const finishTaskMessage = {
      header: {
        action: 'finish-task',
        task_id: TASK_ID,
        streaming: 'duplex'
      },
      payload: {
        input: {}
      }
    };
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(finishTaskMessage));
    }
  }

  function close() {
    try {
      if (ws) ws.close();
    } catch {}
    ws = null;
  }

  function onResult(cb) {
    resultHandler = cb;
  }

  function onError(cb) {
    errorHandler = cb;
  }

  function isOpen() {
    return ws && ws.readyState === WebSocket.OPEN;
  }

  return { connect, sendAudio, end, close, onResult, onError, isOpen };
}

export function parseParaformerText(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload;
  if (typeof p.text === 'string') return p.text;
  const pl = typeof p.payload === 'object' && p.payload ? p.payload : undefined;
  const out = pl && typeof pl.output === 'object' && pl.output ? pl.output : undefined;
  const sentence = out && typeof out.sentence === 'object' && out.sentence ? out.sentence : undefined;
  if (sentence && typeof sentence.text === 'string') return sentence.text;
  const result = typeof p.result === 'object' && p.result ? p.result : undefined;
  if (result && typeof result.text === 'string') return result.text;
  
  const extractWords = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    const o = obj;
    const arr = o.words;
    if (!Array.isArray(arr)) return null;
    return arr.map((w) => {
      if (typeof w === 'string') return w;
      if (w && typeof w === 'object' && 'word' in w) return String(w.word);
      return '';
    });
  };
  
  const wordsFromResult = extractWords(result);
  const wordsFromOut = extractWords(out);
  const merged = wordsFromResult || wordsFromOut;
  if (merged && merged.length) {
    const s = merged.join('');
    return s || null;
  }
  return null;
}
