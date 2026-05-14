<template>
  <view
    class="ai-chat-box"
    :class="{
      'ai-chat-box--expanded': expanded,
      'ai-chat-box--dragging': isDragging,
      'ai-chat-box--animating': isAnimating
    }"
    :style="boxStyle"
  >
    <view
      class="ai-chat-box__header"
      @mousedown.prevent="onPointerDown"
      @touchstart.prevent="onPointerDown"
    >
      <view class="ai-chat-box__header-left">
        <view class="ai-chat-box__avatar">
          <text class="ai-chat-box__avatar-icon">🤖</text>
        </view>
        <view class="ai-chat-box__header-info">
          <text class="ai-chat-box__title">AI 旅游规划师</text>
          <text class="ai-chat-box__subtitle">{{ chatStore.isStreaming ? '正在思考中...' : '在线' }}</text>
        </view>
      </view>
      <view class="ai-chat-box__header-right">
        <view class="ai-chat-box__drag-hint">
          <text class="ai-chat-box__drag-dot"></text>
          <text class="ai-chat-box__drag-dot"></text>
          <text class="ai-chat-box__drag-dot"></text>
        </view>
        <view class="ai-chat-box__close-btn" @click.stop="toggleExpand">
          <text class="ai-chat-box__close-icon">✕</text>
        </view>
      </view>
    </view>

    <view v-if="expanded" class="ai-chat-box__body">
      <scroll-view
        class="ai-chat-box__messages"
        scroll-y
        :scroll-top="msgScrollTop"
        :scroll-with-animation="true"
      >
        <view class="ai-chat-box__msg-list">
          <view
            v-for="msg in chatStore.messages"
            :key="msg.id"
            class="ai-chat-box__msg"
            :class="{ 'ai-chat-box__msg--user': msg.role === 'user' }"
          >
            <view
              class="ai-chat-box__bubble"
              :class="{
                'ai-chat-box__bubble--ai': msg.role === 'assistant',
                'ai-chat-box__bubble--user': msg.role === 'user'
              }"
            >
              <text
                class="ai-chat-box__msg-text"
                :class="{ 'ai-chat-box__msg-text--user': msg.role === 'user' }"
              >{{ msg.content }}</text>
              <view v-if="msg.isStreaming && msg.content" class="ai-chat-box__cursor">
                <text class="ai-chat-box__cursor-icon">|</text>
              </view>
              <view v-if="msg.isStreaming && !msg.content" class="ai-chat-box__loading">
                <view class="ai-chat-box__loading-dot"></view>
                <view class="ai-chat-box__loading-dot"></view>
                <view class="ai-chat-box__loading-dot"></view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="ai-chat-box__input">
        <input
          class="ai-chat-box__input-field"
          v-model="inputText"
          placeholder="告诉我你的旅行需求吧~"
          placeholder-class="ai-chat-box__input-placeholder"
          confirm-type="send"
          @confirm="handleSend"
        />
        <view
          class="ai-chat-box__send-btn"
          :class="{ 'ai-chat-box__send-btn--active': inputText.trim() && !chatStore.isStreaming }"
          @click="handleSend"
        >
          <text class="ai-chat-box__send-icon">➤</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useChatStore } from '@/store/chat'

const chatStore = useChatStore()

const props = defineProps({
  expanded: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle', 'goChat'])

const posX = ref(0)
const posY = ref(0)
const isDragging = ref(false)
const isAnimating = ref(false)
const inputText = ref('')
const msgScrollTop = ref(0)
let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0
let hasMoved = false
let isPointerDown = false
const boxWidth = 340
const tabBarHeight = 50
let sysInfoCache = null

function getSysInfo() {
  if (!sysInfoCache) {
    sysInfoCache = uni.getSystemInfoSync()
  }
  return sysInfoCache
}

function getViewportHeight() {
  if (typeof window !== 'undefined' && window.innerHeight) {
    return window.innerHeight
  }
  const sys = getSysInfo()
  return sys.screenHeight
}

const boxStyle = computed(() => ({
  left: posX.value + 'px',
  top: posY.value + 'px'
}))

onMounted(() => {
  const sysInfo = getSysInfo()
  posX.value = (sysInfo.windowWidth - boxWidth) / 2
  posY.value = getViewportHeight() - tabBarHeight - 8 - 250

  // #ifdef H5
  document.addEventListener('mousemove', onPointerMove)
  document.addEventListener('mouseup', onPointerUp)
  // #endif
})

onBeforeUnmount(() => {
  // #ifdef H5
  document.removeEventListener('mousemove', onPointerMove)
  document.removeEventListener('mouseup', onPointerUp)
  // #endif
})

watch(() => chatStore.messages.length, () => {
  scrollMsgToBottom()
})

watch(() => {
  const last = chatStore.messages[chatStore.messages.length - 1]
  return last?.content?.length
}, () => {
  scrollMsgToBottom()
})

function scrollMsgToBottom() {
  nextTick(() => {
    msgScrollTop.value = msgScrollTop.value + 999
  })
}

function handleSend() {
  const text = inputText.value.trim()
  if (!text || chatStore.isStreaming) return
  inputText.value = ''
  chatStore.sendMessage(text)
  scrollMsgToBottom()
}

function onPointerDown(e) {
  isPointerDown = true
  hasMoved = false
  const point = e.touches ? e.touches[0] : e
  startX = point.clientX
  startY = point.clientY
  startLeft = posX.value
  startTop = posY.value
  isDragging.value = true
  isAnimating.value = false
}

function onPointerMove(e) {
  if (!isPointerDown) return
  const point = e.touches ? e.touches[0] : e
  const dx = point.clientX - startX
  const dy = point.clientY - startY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    hasMoved = true
  }
  const sysInfo = getSysInfo()
  const viewportHeight = getViewportHeight()
  let newLeft = startLeft + dx
  let newTop = startTop + dy
  newLeft = Math.max(0, Math.min(newLeft, sysInfo.windowWidth - boxWidth))
  newTop = Math.max(40, Math.min(newTop, viewportHeight - tabBarHeight - 60))
  posX.value = newLeft
  posY.value = newTop
}

function onPointerUp() {
  if (!isPointerDown) return
  isPointerDown = false
  isDragging.value = false
  if (!hasMoved) return
  isAnimating.value = true
  const sysInfo = getSysInfo()
  const centerX = sysInfo.windowWidth / 2
  if (posX.value + boxWidth / 2 < centerX) {
    posX.value = 12
  } else {
    posX.value = sysInfo.windowWidth - boxWidth - 12
  }
  setTimeout(() => { isAnimating.value = false }, 300)
}

function toggleExpand() {
  emit('toggle')
}
</script>

<style lang="scss" scoped>
.ai-chat-box {
  position: fixed;
  width: 340px;
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 999;
  display: flex;
  flex-direction: column;

  &--animating {
    transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &--dragging {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    transform: scale(1.02);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  &__header {
    height: 50px;
    padding: 0 12px 0 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    flex-shrink: 0;

    &:active {
      cursor: grabbing;
    }
  }

  &__header-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ECDC4, #2A9D8F);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__avatar-icon {
    font-size: 20px;
  }

  &__header-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__title {
    font-size: 13px;
    font-weight: 700;
    color: #1F2937;
  }

  &__subtitle {
    font-size: 10px;
    color: #9CA3AF;
    margin-top: 1px;
  }

  &__header-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__drag-hint {
    display: flex;
    flex-direction: row;
    gap: 2px;
    padding: 4px;
  }

  &__drag-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #D1D5DB;
  }

  &__close-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #F3F4F6;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      background: #E5E7EB;
    }
  }

  &__close-icon {
    font-size: 16px;
    color: #6B7280;
    font-weight: 700;
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    animation: slideDown 0.25s ease;
  }

  &__messages {
    height: 220px;
    padding: 0 16px;
    flex-shrink: 0;
  }

  &__msg-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 8px;
  }

  &__msg {
    display: flex;
    flex-direction: row;

    &--user {
      justify-content: flex-end;
    }
  }

  &__bubble {
    max-width: 80%;
    padding: 10px 12px;
    border-radius: 14px;
    word-break: break-word;
    overflow-wrap: break-word;

    &--ai {
      background: #F9FAFB;
      border: 1px solid #F1F5F9;
      border-top-left-radius: 4px;
    }

    &--user {
      background: #4ECDC4;
      border-top-right-radius: 4px;
    }
  }

  &__msg-text {
    font-size: 12px;
    color: #4B5563;
    line-height: 18px;
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

  &__input {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 8px 16px 16px;
    flex-shrink: 0;
  }

  &__input-field {
    flex: 1;
    height: 36px;
    background: #F3F4F6;
    border-radius: 18px;
    padding: 0 14px;
    font-size: 12px;
    color: #1F2937;
  }

  &__input-placeholder {
    color: #9CA3AF;
    font-size: 12px;
  }

  &__send-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #D1D5DB;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s ease;

    &--active {
      background: #4ECDC4;

      &:active {
        background: #3DBDB5;
      }
    }
  }

  &__send-icon {
    color: #FFFFFF;
    font-size: 14px;
  }
}

@keyframes blink {
  50% { opacity: 0; }
}

@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
