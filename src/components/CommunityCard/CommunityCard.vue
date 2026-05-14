<template>
  <view class="community-card" @click="handleClick">
    <view class="community-card__cover" :style="{ background: data.gradient }">
      <image v-if="data.cover" class="community-card__img" :src="data.cover" mode="aspectFill" />
    </view>
    <view class="community-card__body">
      <view class="community-card__user">
        <image class="community-card__avatar" :src="data.avatar" mode="aspectFill" />
        <text class="community-card__username">{{ data.userName }}</text>
      </view>
      <text class="community-card__title">{{ data.title }}</text>
      <view class="community-card__stats">
        <view class="community-card__stat">
          <text class="community-card__stat-icon">♥</text>
          <text class="community-card__stat-text">{{ formatCount(data.likeCount) }}</text>
        </view>
        <view class="community-card__stat">
          <text class="community-card__stat-icon">💬</text>
          <text class="community-card__stat-text">{{ data.commentCount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, required: true }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click', props.data)
}

function formatCount(count) {
  if (count >= 10000) return (count / 10000).toFixed(1) + 'w'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k'
  return count
}
</script>

<style lang="scss" scoped>
.community-card {
  border-radius: 12px;
  overflow: hidden;
  background: #FFFFFF;
  border: 1px solid #DDE2E8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &__cover {
    width: 100%;
    height: 160px;
    position: relative;
  }

  &__img {
    width: 100%;
    height: 100%;
  }

  &__body {
    padding: 12px;
  }

  &__user {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  &__avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #E5E7EB;
    flex-shrink: 0;
  }

  &__username {
    font-size: 11px;
    font-weight: 500;
    color: #374151;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #1F2937;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-bottom: 8px;
  }

  &__stats {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  &__stat {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }

  &__stat-icon {
    font-size: 12px;
  }

  &__stat-text {
    font-size: 11px;
    color: #6B7A8D;
  }
}
</style>
