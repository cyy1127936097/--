const ZHIPU_API_KEY = '39bfaec720ac45458755bcc2be4dbab0.FgMjAva0IsSX1cMi'
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const MODEL = 'glm-4-flash'

const BASE_SYSTEM_PROMPT = `你是"智旅AI"，一个专业的旅游规划助手。你的职责是：
1. 根据用户的需求，推荐旅游目的地、景点、美食
2. 帮助用户规划旅行路线和行程安排
3. 提供旅游攻略、交通建议、住宿推荐
4. 回答与旅游相关的问题

回答要求：
- 回答简洁实用，重点突出
- 推荐景点时附带简要说明
- 行程规划按天排列，清晰明了
- 语气友好热情，像朋友一样交流`

function buildMessages(messages, preferenceContext) {
  let systemContent = BASE_SYSTEM_PROMPT
  if (preferenceContext) {
    systemContent += `\n\n用户偏好信息：\n${preferenceContext}\n请在推荐时优先考虑以上偏好，让推荐更贴合用户需求。`
  }
  return [
    { role: 'system', content: systemContent },
    ...messages
  ]
}

export function streamChat(messages, onChunk, onComplete, onError, preferenceContext) {
  const requestTask = uni.request({
    url: ZHIPU_API_URL,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ZHIPU_API_KEY}`
    },
    data: {
      model: MODEL,
      messages: buildMessages(messages, preferenceContext),
      stream: true
    },
    enableChunked: true,
    responseType: 'text',
    success: () => {},
    fail: (err) => {
      console.error('智谱AI请求失败:', err)
      if (onError) onError(err)
    }
  })

  let fullText = ''
  let buffer = ''

  requestTask.onChunkReceived((res) => {
    const uint8Arr = new Uint8Array(res.data)
    let chunk = ''
    for (let i = 0; i < uint8Arr.length; i++) {
      chunk += String.fromCharCode(uint8Arr[i])
    }
    try {
      chunk = decodeURIComponent(escape(chunk))
    } catch (e) {
      chunk = uint8ArrToUtf8(uint8Arr)
    }

    buffer += chunk
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data:')) continue

      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') {
        if (onComplete) onComplete(fullText)
        return
      }

      try {
        const parsed = JSON.parse(data)
        const delta = parsed.choices?.[0]?.delta?.content
        if (delta) {
          fullText += delta
          if (onChunk) onChunk(delta, fullText)
        }
      } catch (e) {
        // skip invalid JSON
      }
    }
  })

  return requestTask
}

function uint8ArrToUtf8(uint8Arr) {
  let str = ''
  let i = 0
  while (i < uint8Arr.length) {
    let byte1 = uint8Arr[i++]
    if (byte1 < 0x80) {
      str += String.fromCharCode(byte1)
    } else if (byte1 >= 0xC0 && byte1 < 0xE0) {
      let byte2 = uint8Arr[i++]
      str += String.fromCharCode(((byte1 & 0x1F) << 6) | (byte2 & 0x3F))
    } else if (byte1 >= 0xE0 && byte1 < 0xF0) {
      let byte2 = uint8Arr[i++]
      let byte3 = uint8Arr[i++]
      str += String.fromCharCode(((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F))
    } else if (byte1 >= 0xF0) {
      let byte2 = uint8Arr[i++]
      let byte3 = uint8Arr[i++]
      let byte4 = uint8Arr[i++]
      let code = ((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F)
      code -= 0x10000
      str += String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF))
    }
  }
  return str
}

export function sendChatMessage(messages, preferenceContext) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: ZHIPU_API_URL,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`
      },
      data: {
        model: MODEL,
        messages: buildMessages(messages, preferenceContext),
        stream: false
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data.choices?.[0]?.message?.content || '')
        } else {
          reject(new Error(`API请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
