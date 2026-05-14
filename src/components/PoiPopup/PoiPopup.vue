<template>
  <view class="poi-popup" v-if="visible" :style="{ top: top + 'px', left: left + 'px' }">
    <view class="poi-popup__header">
      <text class="poi-popup__title">{{ data.name }}</text>
      <view class="poi-popup__close" @click="handleClose">
        <text class="poi-popup__close-icon">✕</text>
      </view>
    </view>
    <view class="poi-popup__rating">
      <text class="poi-popup__star">★</text>
      <text class="poi-popup__score">{{ data.rating }}分</text>
      <text class="poi-popup__category"> · {{ data.category }}</text>
    </view>
    <text class="poi-popup__desc">{{ data.description }}</text>
    <view class="poi-popup__btn" @click="handleDetail">
      <text class="poi-popup__btn-text">查看详情</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  data: { type: Object, default: () => ({}) },
  top: { type: Number, default: 150 },
  left: { type: Number, default: 50 }
})

const emit = defineEmits(['close', 'detail'])

function handleClose() {
  emit('close')
}

function handleDetail() {
  emit('detail', props.data)
}
</script>

<style lang="scss" scoped>
.poi-popup {
  position: absolute;
  z-index: 30;
  width: 192px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  padding: 12px;
  animation: popIn 0.3s ease-out;

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    color: #1F2937;
  }

  &__close {
    padding: 2px;
  }

  &__close-icon {
    font-size: 12px;
    color: #9CA3AF;
  }

  &__rating {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;
    margin-bottom: 4px;
  }

  &__star {
    font-size: 12px;
    color: #FF9F43;
  }

  &__score {
    font-size: 12px;
    color: #6B7A8D;
  }

  &__category {
    font-size: 12px;
    color: #6B7A8D;
  }

  &__desc {
    font-size: 10px;
    color: #9CA3AF;
    margin-bottom: 8px;
    line-height: 16px;
  }

  &__btn {
    width: 100%;
    height: 32px;
    background: #4ECDC4;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__btn-text {
    font-size: 12px;
    color: #FFFFFF;
    font-weight: 500;
  }
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
