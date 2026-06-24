<template>
  <view
    class="ai-float-ball"
    :style="{ left: posX + 'px', top: posY + 'px' }"
    @touchstart="onPointerDown"
    @touchmove.stop.prevent="onPointerMove"
    @touchend="onPointerUp"
    @mousedown.prevent="onPointerDown"
  >
    <view class="ai-float-ball__inner" :class="{ 'ai-float-ball__inner--dragging': isDragging }">
      <text class="ai-float-ball__icon">🤖</text>
    </view>
    <view v-if="showPulse" class="ai-float-ball__pulse"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  initialLeft: { type: Number, default: 0 },
  initialTop: { type: Number, default: 0 }
})

const emit = defineEmits(['click'])

const posX = ref(0)
const posY = ref(0)
const isDragging = ref(false)
const showPulse = ref(true)
let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0
let hasMoved = false
let isPointerDown = false

onMounted(() => {
  // #ifdef H5
  const vw = window.innerWidth
  const vh = window.innerHeight
  posX.value = props.initialLeft || vw - 70
  posY.value = props.initialTop || vh - 200
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  // #endif
  // #ifndef H5
  const sysInfo = uni.getSystemInfoSync()
  posX.value = props.initialLeft || sysInfo.windowWidth - 70
  posY.value = props.initialTop || sysInfo.windowHeight - 200
  // #endif
})

onBeforeUnmount(() => {
  // #ifdef H5
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  // #endif
})

function onPointerDown(e) {
  isPointerDown = true
  hasMoved = false
  const point = e.touches ? e.touches[0] : e
  startX = point.clientX
  startY = point.clientY
  startLeft = posX.value
  startTop = posY.value
  isDragging.value = true
}

function onPointerMove(e) {
  if (!isPointerDown) return
  const point = e.touches ? e.touches[0] : e
  const dx = point.clientX - startX
  const dy = point.clientY - startY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    hasMoved = true
  }
  // #ifdef H5
  const vw = window.innerWidth
  const vh = window.innerHeight
  let newLeft = startLeft + dx
  let newTop = startTop + dy
  newLeft = Math.max(0, Math.min(newLeft, vw - 56))
  newTop = Math.max(60, Math.min(newTop, vh - 120))
  posX.value = newLeft
  posY.value = newTop
  // #endif
  // #ifndef H5
  const sysInfo = uni.getSystemInfoSync()
  let newLeft2 = startLeft + dx
  let newTop2 = startTop + dy
  newLeft2 = Math.max(0, Math.min(newLeft2, sysInfo.windowWidth - 56))
  newTop2 = Math.max(80, Math.min(newTop2, sysInfo.windowHeight - 120))
  posX.value = newLeft2
  posY.value = newTop2
  // #endif
}

function onPointerUp() {
  if (!isPointerDown) return
  isPointerDown = false
  isDragging.value = false
  if (hasMoved) {
    // #ifdef H5
    const vw = window.innerWidth
    const centerX = vw / 2
    posX.value = posX.value < centerX ? 14 : vw - 70
    // #endif
    // #ifndef H5
    const sysInfo = uni.getSystemInfoSync()
    const centerX2 = sysInfo.windowWidth / 2
    posX.value = posX.value < centerX2 ? 14 : sysInfo.windowWidth - 70
    // #endif
  } else {
    showPulse.value = false
    emit('click')
  }
}

function onMouseMove(e) {
  onPointerMove(e)
}

function onMouseUp(e) {
  onPointerUp()
}
</script>

<style lang="scss" scoped>
.ai-float-ball {
  position: fixed;
  z-index: 888;
  width: 56px;
  height: 56px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;

  &:active {
    cursor: grabbing;
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
    transition: transform 0.2s, opacity 0.2s;

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
    pointer-events: none;
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}
</style>
