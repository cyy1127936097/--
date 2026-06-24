<template>
  <view class="comment-page">
    <view class="comment-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="comment-page__header-content">
        <view class="comment-page__back" @click="goBack">
          <text class="comment-page__back-icon">‹</text>
        </view>
        <text class="comment-page__title">评论列表</text>
        <view class="comment-page__placeholder"></view>
      </view>
    </view>

    <view class="comment-page__tabs">
      <view
        class="comment-page__tab"
        :class="{ 'comment-page__tab--active': sortBy === 'hot' }"
        @click="switchSort('hot')"
      >
        <text class="comment-page__tab-text" :class="{ 'comment-page__tab-text--active': sortBy === 'hot' }">最热</text>
      </view>
      <view
        class="comment-page__tab"
        :class="{ 'comment-page__tab--active': sortBy === 'latest' }"
        @click="switchSort('latest')"
      >
        <text class="comment-page__tab-text" :class="{ 'comment-page__tab-text--active': sortBy === 'latest' }">最新</text>
      </view>
    </view>

    <scroll-view class="comment-page__content" scroll-y @scrolltolower="loadMore">
      <view class="comment-page__list">
        <CommentItem
          v-for="comment in commentList"
          :key="comment.id"
          :data="comment"
          @like="handleLike"
          @reply="handleReply"
        />
      </view>
      <view class="comment-page__loading">
        <text class="comment-page__loading-text">{{ loadingText }}</text>
      </view>
    </scroll-view>

    <view class="comment-page__input-bar" :style="{ paddingBottom: safeBottom + 'px' }">
      <view class="comment-page__input-wrap">
        <input
          class="comment-page__input"
          v-model="inputText"
          placeholder="写评论..."
          placeholder-class="comment-page__input-placeholder"
        />
        <view class="comment-page__send-btn" @click="submitComment">
          <text class="comment-page__send-text">发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCommentList, postComment } from '@/api/comment'
import { getSystemInfo, getSafeAreaBottom } from '@/utils/safeArea'
import CommentItem from '@/components/CommentItem/CommentItem.vue'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const safeBottom = getSafeAreaBottom()

const poiId = ref(1)
const sortBy = ref('hot')
const commentList = ref([])
const inputText = ref('')
const loading = ref(false)

const loadingText = computed(() => loading.value ? '加载中...' : '— 已经到底啦 —')

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  poiId.value = parseInt(page.options?.poiId || '1')
  loadComments()
})

async function loadComments() {
  loading.value = true
  try {
    commentList.value = await getCommentList(poiId.value, sortBy.value)
  } catch (e) {
    console.error('加载评论失败', e)
  } finally {
    loading.value = false
  }
}

function switchSort(sort) {
  sortBy.value = sort
  loadComments()
}

function loadMore() {}

function handleLike(id) {
  const comment = commentList.value.find(c => c.id === id)
  if (comment) {
    comment.isLiked = !comment.isLiked
    comment.likeCount += comment.isLiked ? 1 : -1
  }
}

function handleReply(data) {
  inputText.value = `@${data.userName} `
}

async function submitComment() {
  const content = inputText.value.trim()
  if (!content) return
  try {
    await postComment({ poiId: poiId.value, content })
    inputText.value = ''
    uni.showToast({ title: '评论成功', icon: 'success' })
    loadComments()
  } catch (e) {
    console.error('评论失败', e)
  }
}

function goBack() {
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.comment-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;

  &__header {
    background: #FFFFFF;
    border-bottom: 1px solid #F1F5F9;
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

  &__placeholder {
    width: 36px;
  }

  &__tabs {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid #F1F5F9;
  }

  &__tab {
    padding: 6px 16px;
    border-radius: 20px;
    background: #F3F4F6;

    &--active {
      background: #E8F8F7;
    }
  }

  &__tab-text {
    font-size: 13px;
    color: #6B7A8D;

    &--active {
      color: #4ECDC4;
      font-weight: 700;
    }
  }

  &__content {
    flex: 1;
    padding: 0 16px;
  }

  &__list {
    display: flex;
    flex-direction: column;
  }

  &__loading {
    padding: 20px 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__loading-text {
    font-size: 12px;
    color: #9CA3AF;
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
  }

  &__send-btn {
    background: #4ECDC4;
    padding: 8px 20px;
    border-radius: 20px;
    flex-shrink: 0;
  }

  &__send-text {
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
  }
}
</style>
