import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { streamChat } from '@/api/zhipu'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([
    {
      id: 1,
      role: 'assistant',
      content: '你好！我是智旅AI，你的专属旅游规划师 🌍 告诉我你想去哪里，我来帮你规划完美行程！',
      timestamp: Date.now()
    }
  ])
  const isStreaming = ref(false)
  let streamAbort = null

  const chatMessages = computed(() => messages.value)

  const apiMessages = computed(() => {
    return messages.value
      .filter(m => !m.isStreaming)
      .map(m => ({
        role: m.role,
        content: m.content
      }))
  })

  function addUserMessage(content) {
    const msg = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: Date.now()
    }
    messages.value.push(msg)
    return msg
  }

  function addAssistantMessage() {
    const msg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    }
    messages.value.push(msg)
    return msg
  }

  function sendMessage(content) {
    if (isStreaming.value) return
    addUserMessage(content)
    const assistantMsg = addAssistantMessage()
    isStreaming.value = true

    streamChat(
      apiMessages.value.slice(0, -1),
      (chunk, fullText) => {
        assistantMsg.content = fullText
      },
      (fullText) => {
        assistantMsg.content = fullText
        assistantMsg.isStreaming = false
        isStreaming.value = false
      },
      (error) => {
        assistantMsg.content = '抱歉，AI暂时无法回复，请稍后再试 🙏'
        assistantMsg.isStreaming = false
        isStreaming.value = false
        console.error('对话异常:', error)
      }
    )
  }

  function clearMessages() {
    messages.value = [
      {
        id: Date.now(),
        role: 'assistant',
        content: '你好！我是智旅AI，你的专属旅游规划师 🌍 告诉我你想去哪里，我来帮你规划完美行程！',
        timestamp: Date.now()
      }
    ]
    isStreaming.value = false
  }

  return {
    messages,
    isStreaming,
    chatMessages,
    apiMessages,
    addUserMessage,
    addAssistantMessage,
    sendMessage,
    clearMessages
  }
})
