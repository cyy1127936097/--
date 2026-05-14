<template>
  <view class="poi-detail-page">
    <scroll-view class="poi-detail-page__scroll" scroll-y>
      <view class="poi-detail-page__banner" :style="{ height: bannerHeight + 'px' }">
        <swiper
          class="poi-detail-page__swiper"
          :indicator-dots="true"
          indicator-color="rgba(255,255,255,0.5)"
          indicator-active-color="#FFFFFF"
          :autoplay="true"
          :circular="true"
        >
          <swiper-item v-for="(img, idx) in poiData.images" :key="idx">
            <image class="poi-detail-page__img" :src="img" mode="aspectFill" />
          </swiper-item>
        </swiper>

        <view class="poi-detail-page__nav" :style="{ top: statusBarHeight + 'px' }">
          <view class="poi-detail-page__nav-btn" @click="goBack">
            <text class="poi-detail-page__nav-icon">‹</text>
          </view>
          <view class="poi-detail-page__nav-btn" @click="toggleFavorite">
            <text class="poi-detail-page__nav-icon">{{ isFavorite ? '♥' : '♡' }}</text>
          </view>
        </view>
      </view>

      <view class="poi-detail-page__info">
        <view class="poi-detail-page__name-row">
          <text class="poi-detail-page__name">{{ poiData.name }}</text>
          <view v-if="poiData.topRank" class="poi-detail-page__badge">
            <text class="poi-detail-page__badge-icon">🔥</text>
            <text class="poi-detail-page__badge-text">{{ poiData.topRank }}</text>
          </view>
        </view>

        <view class="poi-detail-page__rating-row">
          <text class="poi-detail-page__star">★</text>
          <text class="poi-detail-page__rating">{{ poiData.rating }}</text>
          <text class="poi-detail-page__divider">|</text>
          <text class="poi-detail-page__comment-count">{{ poiData.commentCount }}条评论</text>
        </view>

        <view class="poi-detail-page__meta-grid">
          <view class="poi-detail-page__meta-item">
            <view class="poi-detail-page__meta-icon">
              <text>🕐</text>
            </view>
            <view class="poi-detail-page__meta-text">
              <text class="poi-detail-page__meta-label">开放时间</text>
              <text class="poi-detail-page__meta-value">{{ poiData.openTime }}</text>
            </view>
          </view>
          <view class="poi-detail-page__meta-item">
            <view class="poi-detail-page__meta-icon">
              <text>🎫</text>
            </view>
            <view class="poi-detail-page__meta-text">
              <text class="poi-detail-page__meta-label">门票价格</text>
              <text class="poi-detail-page__meta-value">{{ poiData.ticketPrice }}</text>
            </view>
          </view>
          <view class="poi-detail-page__meta-item">
            <view class="poi-detail-page__meta-icon">
              <text>🚌</text>
            </view>
            <view class="poi-detail-page__meta-text">
              <text class="poi-detail-page__meta-label">交通方式</text>
              <text class="poi-detail-page__meta-value">{{ poiData.traffic }}</text>
            </view>
          </view>
        </view>

        <view class="poi-detail-page__ai-summary">
          <text class="poi-detail-page__ai-label">🌿 AI总结：</text>
          <text class="poi-detail-page__ai-text">{{ poiData.aiSummary }}</text>
        </view>

        <view class="poi-detail-page__comment-section">
          <view class="poi-detail-page__comment-header">
            <text class="poi-detail-page__comment-title">全部评论 ({{ poiData.commentCount }})</text>
            <view class="poi-detail-page__comment-tabs">
              <view
                class="poi-detail-page__comment-tab"
                :class="{ 'poi-detail-page__comment-tab--active': commentSort === 'latest' }"
                @click="commentSort = 'latest'"
              >
                <text class="poi-detail-page__comment-tab-text" :class="{ 'poi-detail-page__comment-tab-text--active': commentSort === 'latest' }">最新</text>
              </view>
              <view
                class="poi-detail-page__comment-tab"
                :class="{ 'poi-detail-page__comment-tab--active': commentSort === 'hot' }"
                @click="commentSort = 'hot'"
              >
                <text class="poi-detail-page__comment-tab-text" :class="{ 'poi-detail-page__comment-tab-text--active': commentSort === 'hot' }">最热</text>
              </view>
            </view>
          </view>

          <view class="poi-detail-page__comment-list">
            <CommentItem
              v-for="comment in comments"
              :key="comment.id"
              :data="comment"
              @like="handleCommentLike"
              @reply="handleCommentReply"
            />
          </view>

          <view class="poi-detail-page__more-comments" @click="goCommentList">
            <text class="poi-detail-page__more-text">查看全部评论 ›</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="poi-detail-page__bottom-bar" :style="{ paddingBottom: safeBottom + 'px' }">
      <view class="poi-detail-page__action-btn poi-detail-page__action-btn--nav" @click="navigateTo">
        <text class="poi-detail-page__action-icon">🧭</text>
        <text class="poi-detail-page__action-label">导航</text>
      </view>
      <view class="poi-detail-page__action-btn" @click="goCommentList">
        <text class="poi-detail-page__action-icon">💬</text>
        <text class="poi-detail-page__action-label">评论</text>
      </view>
      <view class="poi-detail-page__action-btn" @click="sharePoi">
        <text class="poi-detail-page__action-icon">↗</text>
        <text class="poi-detail-page__action-label">分享</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPoiDetail } from '@/api/poi'
import { getCommentList } from '@/api/comment'
import { getSystemInfo, getSafeAreaBottom } from '@/utils/safeArea'
import CommentItem from '@/components/CommentItem/CommentItem.vue'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const safeBottom = getSafeAreaBottom()
const bannerHeight = 280

const poiId = ref(0)
const poiData = ref({
  name: '',
  images: [],
  rating: 0,
  commentCount: 0,
  topRank: '',
  openTime: '',
  ticketPrice: '',
  traffic: '',
  aiSummary: '',
  isFavorite: false
})
const isFavorite = ref(false)
const comments = ref([])
const commentSort = ref('hot')

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  poiId.value = parseInt(page.options?.id || '1')
  loadPoiDetail()
  loadComments()
})

watch(commentSort, () => {
  loadComments()
})

async function loadPoiDetail() {
  try {
    const data = await getPoiDetail(poiId.value)
    if (data) {
      poiData.value = data
      isFavorite.value = data.isFavorite
    }
  } catch (e) {
    console.error('加载景点详情失败', e)
  }
}

async function loadComments() {
  try {
    const list = await getCommentList(poiId.value, commentSort.value)
    comments.value = list.slice(0, 3)
  } catch (e) {
    console.error('加载评论失败', e)
  }
}

function goBack() {
  uni.navigateBack({ delta: 1 })
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
  uni.showToast({
    title: isFavorite.value ? '已收藏' : '取消收藏',
    icon: 'none'
  })
}

function handleCommentLike(id) {
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    comment.isLiked = !comment.isLiked
    comment.likeCount += comment.isLiked ? 1 : -1
  }
}

function handleCommentReply(data) {
  uni.showToast({ title: '回复功能开发中', icon: 'none' })
}

function goCommentList() {
  uni.navigateTo({ url: `/pages/comment/index?poiId=${poiId.value}` })
}

function navigateTo() {
  uni.openLocation({
    latitude: poiData.value.latitude || 24.4483,
    longitude: poiData.value.longitude || 118.065,
    name: poiData.value.name,
    address: poiData.value.traffic || ''
  })
}

function sharePoi() {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.poi-detail-page {
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
  position: relative;

  &__scroll {
    height: calc(100vh - 70px);
  }

  &__banner {
    position: relative;
  }

  &__swiper {
    width: 100%;
    height: 100%;
  }

  &__img {
    width: 100%;
    height: 100%;
  }

  &__nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 10;
  }

  &__nav-btn {
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }

  &__nav-icon {
    font-size: 22px;
    color: #FFFFFF;
  }

  &__info {
    padding: 20px;
  }

  &__name-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__name {
    font-size: 24px;
    font-weight: 700;
    color: #1F2937;
  }

  &__badge {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    background: #FFF3E6;
    padding: 4px 8px;
    border-radius: 8px;
  }

  &__badge-icon {
    font-size: 14px;
  }

  &__badge-text {
    font-size: 12px;
    color: #FF9F43;
    font-weight: 700;
  }

  &__rating-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    margin-bottom: 16px;
  }

  &__star {
    font-size: 16px;
    color: #FF9F43;
  }

  &__rating {
    font-size: 16px;
    font-weight: 700;
    color: #374151;
  }

  &__divider {
    font-size: 14px;
    color: #DDE2E8;
    margin: 0 8px;
  }

  &__comment-count {
    font-size: 14px;
    color: #6B7A8D;
  }

  &__meta-grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__meta-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    width: calc(50% - 8px);
  }

  &__meta-icon {
    width: 32px;
    height: 32px;
    background: #E8F8F7;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  &__meta-text {
    display: flex;
    flex-direction: column;
  }

  &__meta-label {
    font-size: 10px;
    color: #9CA3AF;
  }

  &__meta-value {
    font-size: 12px;
    font-weight: 700;
    color: #1F2937;
  }

  &__ai-summary {
    background: rgba(78, 205, 196, 0.05);
    border: 1px solid rgba(78, 205, 196, 0.2);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 32px;
  }

  &__ai-label {
    font-size: 14px;
    font-weight: 700;
    color: #4ECDC4;
    font-style: italic;
    margin-bottom: 4px;
  }

  &__ai-text {
    font-size: 14px;
    color: #4B5563;
    line-height: 22px;
  }

  &__comment-section {
    border-top: 1px solid #F1F5F9;
    padding-top: 24px;
  }

  &__comment-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  &__comment-title {
    font-size: 16px;
    font-weight: 700;
    color: #1F2937;
  }

  &__comment-tabs {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  &__comment-tab {
    padding: 4px 12px;
    border-radius: 20px;
    background: #F3F4F6;

    &--active {
      background: #E8F8F7;
    }
  }

  &__comment-tab-text {
    font-size: 12px;
    color: #6B7A8D;

    &--active {
      color: #4ECDC4;
      font-weight: 700;
    }
  }

  &__more-comments {
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__more-text {
    font-size: 14px;
    color: #4ECDC4;
    font-weight: 500;
  }

  &__bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: #FFFFFF;
    border-top: 1px solid #F1F5F9;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 0 24px;
  }

  &__action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    &--nav {
      background: #4ECDC4;
      padding: 8px 24px;
      border-radius: 24px;
      flex-direction: row;
      gap: 6px;
    }
  }

  &__action-icon {
    font-size: 18px;
  }

  &__action-label {
    font-size: 11px;
    color: #6B7A8D;
  }

  &__action-btn--nav &__action-label {
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 600;
  }
}
</style>
