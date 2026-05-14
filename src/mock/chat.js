export const chatHistory = [
  {
    id: 1,
    role: 'assistant',
    content: '你好！我是你的AI旅游助手。请问你想去哪里旅行？',
    timestamp: Date.now() - 60000
  },
  {
    id: 2,
    role: 'user',
    content: '我想去厦门玩3天，喜欢拍照和美食',
    timestamp: Date.now() - 50000
  },
  {
    id: 3,
    role: 'assistant',
    content: '根据您的偏好，我为您规划了一条【文艺·美食】3日游路线👇\n\n第一天：鼓浪屿 → 中山路步行街 → 八市海鲜市场\n第二天：厦门大学 → 南普陀寺 → 沙坡尾\n第三天：曾厝垵 → 环岛路骑行 → 黄厝沙滩',
    timestamp: Date.now() - 40000,
    isStreaming: true
  }
]

export const streamReplyText = '根据您的偏好，我为您规划了一条【文艺·美食】3日游路线👇\n\n第一天：鼓浪屿 → 中山路步行街 → 八市海鲜市场\n第二天：厦门大学 → 南普陀寺 → 沙坡尾\n第三天：曾厝垵 → 环岛路骑行 → 黄厝沙滩\n\n这条路线涵盖了厦门最经典的拍照打卡点和地道美食，每天行程松弛有度，不会太赶。需要我为您调整某一天的行程吗？'

export function simulateStreamReply(callback, onComplete) {
  const text = streamReplyText
  let index = 0
  const timer = setInterval(() => {
    if (index < text.length) {
      const chunkSize = Math.floor(Math.random() * 3) + 1
      const chunk = text.substring(index, index + chunkSize)
      index += chunkSize
      callback(chunk, text.substring(0, index))
    } else {
      clearInterval(timer)
      if (onComplete) onComplete(text)
    }
  }, 30)
  return timer
}
