<template>
  <view class="comment-item">
    <view class="comment-item__header">
      <image class="comment-item__avatar" :src="data.avatar || '/static/default-avatar.png'" mode="aspectFill" />
      <view class="comment-item__info">
        <text class="comment-item__name">{{ data.userName }}</text>
        <text class="comment-item__time">{{ data.createTime }}</text>
      </view>
      <view class="comment-item__rating">
        <StarRating :model-value="data.rating" :size="12" :gap="1" readonly />
      </view>
    </view>
    <text class="comment-item__content">{{ data.content }}</text>
    <view v-if="data.images && data.images.length" class="comment-item__images">
      <image
        v-for="(img, idx) in data.images"
        :key="idx"
        class="comment-item__img"
        :src="img"
        mode="aspectFill"
        @click="previewImage(data.images, idx)"
      />
    </view>
    <view class="comment-item__actions">
      <view class="comment-item__like" @click="handleLike">
        <text class="comment-item__like-icon" :style="{ color: data.isLiked ? '#FF9F43' : '#9CA3AF' }">♥</text>
        <text class="comment-item__like-count">{{ data.likeCount || '' }}</text>
      </view>
      <view v-if="showReply" class="comment-item__reply-btn" @click="handleReply">
        <text class="comment-item__reply-text">回复</text>
      </view>
    </view>
    <view v-if="data.replies && data.replies.length" class="comment-item__replies">
      <view v-for="reply in data.replies" :key="reply.id" class="comment-item__reply">
        <text class="comment-item__reply-name">{{ reply.userName }}：</text>
        <text class="comment-item__reply-content">{{ reply.content }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import StarRating from '@/components/StarRating/StarRating.vue'

const props = defineProps({
  data: { type: Object, required: true },
  showReply: { type: Boolean, default: true }
})

const emit = defineEmits(['like', 'reply'])

function handleLike() {
  emit('like', props.data.id)
}

function handleReply() {
  emit('reply', props.data)
}

function previewImage(urls, index) {
  uni.previewImage({
    urls,
    current: urls[index]
  })
}
</script>

<style lang="scss" scoped>
.comment-item {
  padding: 16px 0;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #F1F5F9;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-size: 14px;
    font-weight: 700;
    color: #1F2937;
  }

  &__time {
    font-size: 10px;
    color: #9CA3AF;
    margin-top: 2px;
  }

  &__rating {
    flex-shrink: 0;
  }

  &__content {
    font-size: 14px;
    color: #4B5563;
    line-height: 22px;
    margin-bottom: 8px;
  }

  &__images {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  &__img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    background-color: #F1F5F9;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  &__like {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }

  &__like-icon {
    font-size: 14px;
  }

  &__like-count {
    font-size: 11px;
    color: #6B7A8D;
  }

  &__reply-btn {
    display: flex;
    align-items: center;
  }

  &__reply-text {
    font-size: 11px;
    color: #6B7A8D;
  }

  &__replies {
    margin-top: 8px;
    background-color: #F9FAFB;
    border-radius: 8px;
    padding: 8px 12px;
  }

  &__reply {
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  &__reply-name {
    font-size: 12px;
    color: #4ECDC4;
    font-weight: 500;
  }

  &__reply-content {
    font-size: 12px;
    color: #6B7A8D;
  }
}
</style>
