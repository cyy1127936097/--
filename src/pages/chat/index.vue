<template>
  <view class="chat-page">
    <!-- #ifdef H5 -->
    <WebTopNav />
    <!-- #endif -->

    <view class="chat-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="chat-page__header-bg"></view>
      <view class="chat-page__header-content">
        <view class="chat-page__back" @click="goBack">
          <text class="chat-page__back-icon">‹</text>
        </view>
        <view class="chat-page__title-wrap">
          <view class="chat-page__avatar-ai">
            <text class="chat-page__avatar-ai-icon">🤖</text>
            <view class="chat-page__status-dot" :class="{ 'chat-page__status-dot--streaming': chatStore.isStreaming }"></view>
          </view>
          <view class="chat-page__title-info">
            <text class="chat-page__title">AI 旅游规划师</text>
            <text class="chat-page__status">{{ chatStore.isStreaming ? '正在思考中...' : '在线 · 随时为你规划' }}</text>
          </view>
        </view>
        <view class="chat-page__clear" @click="clearChat">
          <text class="chat-page__clear-icon">🗑</text>
        </view>
      </view>
    </view>

    <scroll-view
      class="chat-page__messages"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <view class="chat-page__msg-list">
        <view
          v-for="msg in chatStore.messages"
          :key="msg.id"
          class="chat-page__msg"
          :class="{ 'chat-page__msg--user': msg.role === 'user' }"
        >
          <view v-if="msg.role === 'assistant'" class="chat-page__avatar">
            <text class="chat-page__avatar-text">🤖</text>
          </view>
          <view class="chat-page__bubble-wrapper">
            <view
              class="chat-page__bubble"
              :class="{
                'chat-page__bubble--ai': msg.role === 'assistant',
                'chat-page__bubble--user': msg.role === 'user'
              }"
            >
              <text
                class="chat-page__bubble-text"
                :class="{ 'chat-page__bubble-text--user': msg.role === 'user' }"
              >{{ msg.content }}</text>
              <view v-if="msg.isStreaming && msg.content" class="chat-page__cursor">
                <text class="chat-page__cursor-bar">|</text>
              </view>
            </view>
            <view v-if="!msg.isStreaming && msg.role === 'assistant' && msg.id !== 1" class="chat-page__save-wrap">
              <view class="chat-page__save-btn" @click="saveAsTrip(msg)">
                <text class="chat-page__save-icon">💾</text>
                <text class="chat-page__save-text">保存为行程</text>
              </view>
            </view>
          </view>
        </view>
        <!-- AI 正在思考提示 -->
        <view v-if="isAiThinking" class="chat-page__msg">
          <view class="chat-page__avatar">
            <text class="chat-page__avatar-text">🤖</text>
          </view>
          <view class="chat-page__bubble-wrapper">
            <view class="chat-page__bubble chat-page__bubble--ai chat-page__bubble--thinking">
              <view class="chat-page__thinking">
                <view class="chat-page__thinking-dots">
                  <view class="chat-page__thinking-dot"></view>
                  <view class="chat-page__thinking-dot"></view>
                  <view class="chat-page__thinking-dot"></view>
                </view>
                <text class="chat-page__thinking-text">正在思考中</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 12px;"></view>
    </scroll-view>

    <view class="chat-page__suggestions" v-if="chatStore.messages.length <= 1 && !chatStore.isStreaming">
      <view
        v-for="(sug, idx) in suggestions"
        :key="idx"
        class="chat-page__suggestion-chip"
        @click="quickSend(sug)"
      >
        <text>{{ sug }}</text>
      </view>
    </view>

    <view class="chat-page__input-bar" :style="{ paddingBottom: safeBottom + 'px' }">
      <view class="chat-page__input-wrap">
        <input
          class="chat-page__input"
          v-model="inputText"
          placeholder="描述你想去的旅行..."
          placeholder-style="color: #C0C7D0;"
          confirm-type="send"
          @confirm="sendMessage"
        />
        <view
          class="chat-page__send-btn"
          :class="{ 'chat-page__send-btn--active': inputText.trim() && !chatStore.isStreaming }"
          @click="sendMessage"
        >
          <text v-if="chatStore.isStreaming" class="chat-page__send-text">■</text>
          <text v-else class="chat-page__send-text">↑</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/store/chat'
import { useAppStore } from '@/store/app'
import { createTrip } from '@/api/user'
import { getSystemInfo, getSafeAreaBottom } from '@/utils/safeArea'
// #ifdef H5
import WebTopNav from '@/components/WebTopNav/WebTopNav.vue'
// #endif

const chatStore = useChatStore()
const appStore = useAppStore()
const { currentCity } = storeToRefs(appStore)
const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const safeBottom = getSafeAreaBottom()

const inputText = ref('')
const scrollTop = ref(0)

// AI 正在思考：streaming 中但最后一条消息还没有内容
const isAiThinking = computed(() => {
  if (!chatStore.isStreaming) return false
  const last = chatStore.messages[chatStore.messages.length - 1]
  return !last || last.role !== 'assistant' || !last.content
})

const suggestions = computed(() => {
  const city = currentCity.value || '厦门'
  return [
    `🎯 推荐3天${city}经典路线`,
    `🍜 ${city}地道美食攻略`,
    '📸 适合拍照的文艺景点',
    '👨‍👩‍👧 亲子游路线推荐',
    `🌅 ${city}必去打卡地`
  ]
})

watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

watch(() => chatStore.isStreaming, () => {
  scrollToBottom()
})

watch(() => {
  const last = chatStore.messages[chatStore.messages.length - 1]
  return last?.content?.length
}, () => {
  scrollToBottom()
})

onMounted(() => {
  chatStore.loadHistory()
  scrollToBottom()
})

function scrollToBottom() {
  nextTick(() => {
    scrollTop.value = scrollTop.value + 9999
  })
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text || chatStore.isStreaming) return
  inputText.value = ''
  chatStore.sendMessage(text)
  scrollToBottom()
}

function quickSend(text) {
  inputText.value = text
  sendMessage()
}

function clearChat() {
  uni.showModal({
    title: '清空对话',
    content: '确定要清空所有对话记录吗？',
    confirmColor: '#FF6B6B',
    success: (res) => {
      if (res.confirm) {
        chatStore.clearMessages()
      }
    }
  })
}

async function saveAsTrip(msg) {
  const content = msg.content || ''
  const name = extractTripName(content)
  const days = extractDays(content)
  const poiCount = extractPoiCount(content)
  const city = currentCity.value || extractCity(content)

  uni.showLoading({ title: '保存中...' })
  try {
    const trip = {
      name,
      cover: 'https://picsum.photos/seed/' + Date.now() + '/400/240',
      days: days || 2,
      poiCount: poiCount || 4,
      city: city || '未知',
      status: 'planned',
      createTime: new Date().toISOString().split('T')[0]
    }
    const saved = await createTrip(trip)
    uni.hideLoading()
    uni.showModal({
      title: '保存成功',
      content: '已保存到「我的行程」，是否立即查看？',
      confirmText: '查看',
      cancelText: '继续聊',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/trip-detail/index?id=' + saved.id })
        }
      }
    })
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '保存失败，请重试', icon: 'none' })
  }
}

function extractTripName(content) {
  const lines = content.split('\n').filter(l => l.trim())
  for (const line of lines) {
    const m = line.match(/(.{2,20}?)(\d+天|路线|攻略|之旅|之游|行程|游|行)/)
    if (m) return m[1] + m[2]
  }
  const firstLine = lines[0] || ''
  return firstLine.replace(/[#\*\-→\d\.\s]/g, '').slice(0, 16) || 'AI规划行程'
}

function extractDays(content) {
  const m = content.match(/(\d+)天/)
  if (m) return parseInt(m[1])
  const dayMatches = content.match(/Day\s*\d+/gi)
  if (dayMatches) return dayMatches.length
  return 2
}

function extractPoiCount(content) {
  const places = content.match(/[→\-]\s*([^\s\n→\-]{2,12})/g)
  if (places) return places.length
  return 4
}

function extractCity(content) {
  const cities = ['厦门', '北京', '上海', '成都', '杭州', '南京', '西安', '重庆', '广州', '深圳', '武汉', '长沙', '大理', '丽江', '三亚', '青岛', '苏州', '桂林']
  for (const c of cities) {
    if (content.includes(c)) return c
  }
  return '未知'
}

function goBack() {
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.chat-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #EDF0F4;

  &__header {
    background: #FFFFFF;
    position: relative;
    overflow: hidden;
    z-index: 10;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  }

  &__header-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(78, 205, 196, 0.04), rgba(42, 157, 143, 0.02));
  }

  &__header-content {
    height: 44px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    position: relative;
    z-index: 1;
  }

  &__back {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__back-icon {
    font-size: 28px;
    color: #1F2937;
    font-weight: 300;
  }

  &__title-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  &__avatar-ai {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ECDC4, #2A9D8F);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  &__avatar-ai-icon {
    font-size: 18px;
  }

  &__status-dot {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #10B981;
    border: 2px solid #FFFFFF;

    &--streaming {
      background: #FF9F43;
      animation: pulse-dot 1s ease-in-out infinite;
    }
  }

  &__title-info {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: #1F2937;
  }

  &__status {
    font-size: 10px;
    color: #9CA3AF;
    margin-top: 1px;
  }

  &__clear {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &:active {
      background: #FEE2E2;
    }
  }

  &__clear-icon {
    font-size: 16px;
  }

  &__messages {
    flex: 1;
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  &__msg-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
  }

  &__msg {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    animation: msg-pop 0.3s ease;

    &--user {
      justify-content: flex-end;
    }
  }

  &__avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #E8F8F7, #D4F1F0);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    align-self: flex-end;
  }

  &__avatar-text {
    font-size: 16px;
  }

  &__bubble-wrapper {
    max-width: 85%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  &__save-wrap {
    display: flex;
    flex-direction: row;
    margin-top: 6px;
  }

  &__save-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    background: #ECFDF5;
    border: 1px solid #A7F3D0;
    border-radius: 14px;
    transition: all 0.15s;

    &:active {
      background: #D1FAE5;
      transform: scale(0.96);
    }
  }

  &__save-icon {
    font-size: 12px;
  }

  &__save-text {
    font-size: 11px;
    color: #059669;
    font-weight: 600;
  }

  &__bubble {
    padding: 10px 14px;
    border-radius: 18px;
    display: inline-flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 4px;
    flex-wrap: wrap;
    box-sizing: border-box;
    word-break: break-word;
    overflow-wrap: break-word;

    &--ai {
      background: #FFFFFF;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    &--user {
      background: linear-gradient(135deg, #4ECDC4, #3CB3AA);
      border-bottom-right-radius: 4px;
      align-self: flex-end;
    }
  }

  &__bubble-text {
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
    word-break: break-all;

    &--user {
      color: #FFFFFF;
    }
  }

  &__cursor {
    display: inline;
  }

  &__cursor-bar {
    font-size: 15px;
    color: #4ECDC4;
    animation: blink 0.8s ease-in-out infinite;
  }

  &__bubble--thinking {
    padding: 12px 16px;
  }

  &__thinking {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  &__thinking-dots {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }

  &__thinking-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4ECDC4;
    animation: thinking-bounce 1.4s ease-in-out infinite;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }

  &__thinking-text {
    font-size: 13px;
    color: #9CA3AF;
  }

  &__suggestions {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 16px 12px;
  }

  &__suggestion-chip {
    background: #FFFFFF;
    border-radius: 20px;
    padding: 8px 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;

    text {
      font-size: 12px;
      color: #6B7A8D;
      font-weight: 500;
    }

    &:active {
      background: #4ECDC4;
      transform: scale(0.96);

      text {
        color: #FFFFFF;
      }
    }
  }

  &__input-bar {
    background: #FFFFFF;
    padding: 8px 16px;
    border-top: 1px solid #EEF0F4;
  }

  &__input-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    background: #F3F4F6;
    border-radius: 24px;
    padding: 4px 4px 4px 16px;
    border: 1.5px solid transparent;
    transition: border-color 0.2s ease;

    &:focus-within {
      border-color: #4ECDC4;
      background: #FFFFFF;
    }
  }

  &__input {
    flex: 1;
    height: 38px;
    font-size: 15px;
    color: #1F2937;
    background: transparent;
  }

  &__send-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &--active {
      background: linear-gradient(135deg, #4ECDC4, #3CB3AA);
    }
  }

  &__send-text {
    font-size: 16px;
    color: #FFFFFF;
    font-weight: 700;
  }
}

@keyframes msg-pop {
  from { opacity: 0; transform: translateY(6px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes thinking-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

/* #ifdef H5 */
.chat-page {
  background: #F0F2F5;
}

.chat-page__header {
  background: #FFFFFF;
  border-bottom: 1px solid #EEF0F4;
  box-shadow: none;
}

.chat-page__header-bg {
  display: none;
}

.chat-page__header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 52px;
}

.chat-page__messages {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.chat-page__msg-list {
  width: 100%;
  box-sizing: border-box;
}

.chat-page__suggestions {
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
}

.chat-page__input-bar {
  border-top: 1px solid #EEF0F4;
}

.chat-page__input-wrap {
  max-width: 800px;
  margin: 0 auto;
}
/* #endif */
</style>
