import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendMessage as apiSendMessage, getChatHistory, clearHistory } from '@/api/chat'
import { useAppStore } from './app'

export const useChatStore = defineStore('chat', () => {
  const appStore = useAppStore()
  const messages = ref([
    {
      id: 1,
      role: 'assistant',
      content: '你好！我是智旅AI，你的专属旅游规划师 🌍 告诉我你想去哪里，我来帮你规划完美行程！',
      timestamp: Date.now()
    }
  ])
  const isStreaming = ref(false)

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

  function sendMessage(content) {
    if (isStreaming.value) return
    addUserMessage(content)
    isStreaming.value = true

    const city = appStore.currentCity || '厦门'
    apiSendMessage(content, apiMessages.value, city)
      .then((res) => {
        messages.value.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: res.assistantMsg?.content || '',
          timestamp: Date.now(),
          isStreaming: false
        })
        isStreaming.value = false
      })
      .catch((error) => {
        messages.value.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: '抱歉，AI暂时无法回复，请稍后再试 🙏',
          timestamp: Date.now(),
          isStreaming: false
        })
        isStreaming.value = false
        console.error('对话异常:', error)
      })
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
    clearHistory().catch(() => {})
  }

  async function loadHistory() {
    try {
      const history = await getChatHistory()
      if (history && history.length > 0) {
        const mapped = history.map(msg => ({
          id: msg.id || Date.now() + Math.random(),
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp || Date.now(),
          isStreaming: false
        }))
        if (mapped.length > 0) {
          messages.value = mapped
        }
      }
    } catch (e) {
      console.error('加载对话历史失败:', e)
    }
  }

  return {
    messages,
    isStreaming,
    sendMessage,
    clearMessages,
    loadHistory
  }
})
