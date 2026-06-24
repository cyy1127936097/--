import { get, post, del } from '@/utils/request'

export function getChatHistory() {
  return get('/chat/history')
}

export function sendMessage(content, messages = []) {
  return post('/chat/send', { content, messages })
}

export function clearHistory() {
  return del('/chat/history')
}
