import { get, post, del } from '@/utils/request'

export function getChatHistory() {
  return get('/api/chat/history')
}

export function sendMessage(content) {
  return post('/api/chat/send', { content })
}

export function streamReply(onChunk, onComplete) {
  const token = uni.getStorageSync('token')
  const header = { 'Content-Type': 'application/json' }
  if (token) header['Authorization'] = `Bearer ${token}`

  const chatStore = require('@/store/chat').useChatStore()
  const messages = chatStore.apiMessages

  return new Promise((resolve, reject) => {
    uni.request({
      url: 'http://localhost:8080/api/chat/stream',
      method: 'POST',
      data: { content: chatStore.messages[chatStore.messages.length - 1]?.content || '', messages },
      header,
      enableChunked: true,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`请求错误: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
