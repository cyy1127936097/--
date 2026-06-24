<template>
  <view class="chat-page">
    <view class="chat-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="chat-page__header-content">
        <view class="chat-page__back" @click="goBack">
          <text class="chat-page__back-icon">‹</text>
        </view>
        <view class="chat-page__title-wrap">
          <text class="chat-page__title">AI 旅游规划师</text>
          <text class="chat-page__status">{{ chatStore.isStreaming ? '正在思考中...' : '在线' }}</text>
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
            <view v-if="msg.isStreaming && !msg.content" class="chat-page__loading">
              <view class="chat-page__loading-dot"></view>
              <view class="chat-page__loading-dot"></view>
              <view class="chat-page__loading-dot"></view>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 20px;"></view>
    </scroll-view>

    <view class="chat-page__input-bar" :style="{ paddingBottom: safeBottom + 'px' }">
      <view class="chat-page__input-wrap">
        <input
          class="chat-page__input"
          v-model="inputText"
          placeholder="告诉我你的旅行需求吧~"
          placeholder-class="chat-page__input-placeholder"
          confirm-type="send"
          @confirm="sendMessage"
        />
        <view
          class="chat-page__send-btn"
          :class="{ 'chat-page__send-btn--active': inputText.trim() && !chatStore.isStreaming }"
          @click="sendMessage"
        >
          <text class="chat-page__send-text">发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useChatStore } from '@/store/chat'
import { getSystemInfo, getSafeAreaBottom } from '@/utils/safeArea'

const chatStore = useChatStore()
const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const safeBottom = getSafeAreaBottom()

const inputText = ref('')
const scrollTop = ref(0)

watch(() => chatStore.messages.length, () => {
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
})

function scrollToBottom() {
  nextTick(() => {
    scrollTop.value = scrollTop.value + 999
  })
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text || chatStore.isStreaming) return
  inputText.value = ''
  chatStore.sendMessage(text)
  scrollToBottom()
}

function clearChat() {
  uni.showModal({
    title: '清空对话',
    content: '确定要清空所有对话记录吗？',
    success: (res) => {
      if (res.confirm) {
        chatStore.clearMessages()
      }
    }
  })
}

function goBack() {
  uni.navigateBack({ delta: 1 })
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

  &__title-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__title {
    font-size: 17px;
    font-weight: 700;
    color: #1F2937;
  }

  &__status {
    font-size: 10px;
    color: #4ECDC4;
    margin-top: 1px;
  }

  &__clear {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__clear-icon {
    font-size: 18px;
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
      background: #4ECDC4;
      border-top-right-radius: 4px;
    }
  }

  &__bubble-text {
    font-size: 14px;
    color: #374151;
    line-height: 22px;
    white-space: pre-wrap;

    &--user {
      color: #FFFFFF;
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

  &__loading {
    display: flex;
    flex-direction: row;
    gap: 4px;
    padding-top: 4px;
  }

  &__loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #D1D5DB;
    animation: dotBounce 1.4s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
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
    transition: background 0.2s ease;

    &--active {
      background: #4ECDC4;
      box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);

      &:active {
        background: #3DBDB5;
      }
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

@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
