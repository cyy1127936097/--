import { chatHistory, simulateStreamReply } from '@/mock/chat'

export function getChatHistory() {
  return Promise.resolve(chatHistory)
}

export function sendMessage(content) {
  return new Promise((resolve) => {
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: Date.now()
    }
    const assistantMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    }
    resolve({ userMsg, assistantMsg })
  })
}

export function streamReply(onChunk, onComplete) {
  return simulateStreamReply(onChunk, onComplete)
}
