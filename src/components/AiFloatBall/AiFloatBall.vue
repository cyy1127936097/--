<template>
  <view
    class="ai-float-ball"
    :class="{
      'ai-float-ball--dragging': isDragging,
      'ai-float-ball--animating': isAnimating
    }"
    :style="{ left: posX + 'px', top: posY + 'px' }"
    @touchstart="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @click="handleClick"
  >
    <view class="ai-float-ball__inner" :class="{ 'ai-float-ball__inner--dragging': isDragging }">
      <text class="ai-float-ball__icon">🤖</text>
    </view>
    <view v-if="showPulse" class="ai-float-ball__pulse"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  initialLeft: { type: Number, default: 0 },
  initialTop: { type: Number, default: 0 }
})

const emit = defineEmits(['click'])

const posX = ref(0)
const posY = ref(0)
const isDragging = ref(false)
const isAnimating = ref(false)
const showPulse = ref(true)
let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0
let hasMoved = false

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  posX.value = props.initialLeft || sysInfo.windowWidth - 70
  posY.value = props.initialTop || sysInfo.windowHeight - 200
})

function onTouchStart(e) {
  const touch = e.touches[0]
  startX = touch.clientX
  startY = touch.clientY
  startLeft = posX.value
  startTop = posY.value
  isDragging.value = true
  isAnimating.value = false
  hasMoved = false
}

function onTouchMove(e) {
  const touch = e.touches[0]
  const dx = touch.clientX - startX
  const dy = touch.clientY - startY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    hasMoved = true
  }
  if (!hasMoved) return
  const sysInfo = uni.getSystemInfoSync()
  let newLeft = startLeft + dx
  let newTop = startTop + dy
  newLeft = Math.max(0, Math.min(newLeft, sysInfo.windowWidth - 56))
  newTop = Math.max(80, Math.min(newTop, sysInfo.windowHeight - 120))
  posX.value = newLeft
  posY.value = newTop
}

function onTouchEnd() {
  isDragging.value = false
  if (!hasMoved) return
  isAnimating.value = true
  const sysInfo = uni.getSystemInfoSync()
  const centerX = sysInfo.windowWidth / 2
  posX.value = posX.value < centerX ? 14 : sysInfo.windowWidth - 70
  setTimeout(() => { isAnimating.value = false }, 300)
}

function handleClick() {
  if (!hasMoved) {
    showPulse.value = false
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.ai-float-ball {
  position: fixed;
  z-index: 888;
  width: 56px;
  height: 56px;

  &--animating {
    transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &--dragging {
    .ai-float-ball__inner {
      box-shadow: 0 8px 24px rgba(78, 205, 196, 0.5);
    }
  }

  &__inner {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ECDC4, #2A9D8F);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(78, 205, 196, 0.4);
    transition: transform 0.2s, opacity 0.2s, box-shadow 0.15s ease;

    &--dragging {
      transform: scale(0.9);
      opacity: 0.8;
    }
  }

  &__icon {
    font-size: 24px;
  }

  &__pulse {
    position: absolute;
    top: 0;
    left: 0;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(78, 205, 196, 0.3);
    animation: pulse 2s ease-out infinite;
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}
</style>
