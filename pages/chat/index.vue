<template>
  <view class="chat-page">
    <view class="chat-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="chat-page__header-content">
        <view class="chat-page__back" @click="goBack">
          <text class="chat-page__back-icon">‹</text>
        </view>
        <text class="chat-page__title">AI 旅游规划师 小智</text>
        <view class="chat-page__history" @click="showHistory">
          <text class="chat-page__history-icon">🕐</text>
        </view>
      </view>
    </view>

    <scroll-view
      class="chat-page__messages"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      scroll-into-view=""
    >
      <view class="chat-page__msg-list">
        <view
          v-for="msg in messages"
          :key="msg.id"
          class="chat-page__msg"
          :class="{ 'chat-page__msg--user': msg.role === 'user' }"
        >
          <view v-if="msg.role === 'assistant'" class="chat-page__avatar-ai">
            <text class="chat-page__avatar-ai-icon">🤖</text>
          </view>
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
              <text class="chat-page__cursor-icon">|</text>
            </view>
          </view>
        </view>
      </view>
      <view id="chat-bottom" style="height: 1px;"></view>
    </scroll-view>

    <view class="chat-page__input-bar" :style="{ paddingBottom: safeBottom + 'px' }">
      <view class="chat-page__input-wrap">
        <view class="chat-page__voice-btn" @click="voiceInput">
          <text class="chat-page__voice-icon">🎤</text>
        </view>
        <input
          class="chat-page__input"
          v-model="inputText"
          placeholder="告诉我你的旅行需求吧~"
          placeholder-class="chat-page__input-placeholder"
          confirm-type="send"
          @confirm="sendMessage"
        />
        <view class="chat-page__send-btn" :class="{ 'chat-page__send-btn--active': inputText.trim() }" @click="sendMessage">
          <text class="chat-page__send-text">发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { getChatHistory, sendMessage as apiSendMessage, streamReply } from '@/api/chat'
import { getSystemInfo, getSafeAreaBottom } from '@/utils/safeArea'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const safeBottom = getSafeAreaBottom()

const messages = ref([])
const inputText = ref('')
const scrollTop = ref(0)
let streamTimer = null

onMounted(() => {
  loadHistory()
})

async function loadHistory() {
  try {
    const history = await getChatHistory()
    messages.value = history
    scrollToBottom()
  } catch (e) {
    console.error('加载对话历史失败', e)
  }
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return
  inputText.value = ''

  try {
    const { userMsg, assistantMsg } = await apiSendMessage(text)
    messages.value.push(userMsg)
    scrollToBottom()

    messages.value.push(assistantMsg)
    scrollToBottom()

    streamTimer = streamReply(
      (chunk, fullText) => {
        const lastMsg = messages.value[messages.value.length - 1]
        if (lastMsg && lastMsg.isStreaming) {
          lastMsg.content = fullText
        }
        scrollToBottom()
      },
      (fullText) => {
        const lastMsg = messages.value[messages.value.length - 1]
        if (lastMsg) {
          lastMsg.isStreaming = false
          lastMsg.content = fullText
        }
      }
    )
  } catch (e) {
    console.error('发送消息失败', e)
  }
}

function scrollToBottom() {
  nextTick(() => {
    scrollTop.value = scrollTop.value + 100
  })
}

function goBack() {
  uni.navigateBack({ delta: 1 })
}

function showHistory() {
  uni.showToast({ title: '对话历史开发中', icon: 'none' })
}

function voiceInput() {
  uni.showToast({ title: '语音输入开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.chat-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F9FAFB;

  &__header {
    background: #FFFFFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    z-index: 10;
  }

  &__header-content {
    height: 44px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
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
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: #1F2937;
  }

  &__history {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__history-icon {
    font-size: 20px;
  }

  &__messages {
    flex: 1;
    padding: 16px;
  }

  &__msg-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__msg {
    display: flex;
    flex-direction: row;
    gap: 8px;

    &--user {
      justify-content: flex-end;
    }
  }

  &__avatar-ai {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ECDC4, #2A9D8F);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__avatar-ai-icon {
    font-size: 16px;
  }

  &__bubble {
    max-width: 80%;
    padding: 12px;
    border-radius: 16px;
    position: relative;

    &--ai {
      background: #FFFFFF;
      border-top-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    &--user {
      background: #E5E7EB;
      border-top-right-radius: 4px;
    }
  }

  &__bubble-text {
    font-size: 14px;
    color: #374151;
    line-height: 22px;
    white-space: pre-wrap;

    &--user {
      color: #1F2937;
    }
  }

  &__cursor {
    display: inline;
  }

  &__cursor-icon {
    color: #4ECDC4;
    font-weight: 700;
    animation: blink 1s step-end infinite;
  }

  &__input-bar {
    background: #FFFFFF;
    border-top: 1px solid #F1F5F9;
    padding: 12px 16px;
  }

  &__input-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  &__voice-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #F3F4F6;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__voice-icon {
    font-size: 18px;
  }

  &__input {
    flex: 1;
    height: 40px;
    background: #F3F4F6;
    border-radius: 20px;
    padding: 0 16px;
    font-size: 14px;
    color: #1F2937;
  }

  &__input-placeholder {
    color: #9CA3AF;
    font-size: 14px;
  }

  &__send-btn {
    background: #E5E7EB;
    padding: 8px 16px;
    border-radius: 20px;
    flex-shrink: 0;

    &--active {
      background: #4ECDC4;
      box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
    }
  }

  &__send-text {
    font-size: 14px;
    font-weight: 700;
    color: #FFFFFF;
  }
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
