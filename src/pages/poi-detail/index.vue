<template>
  <view class="poi-detail-page">
    <!-- 骨架屏 -->
    <view v-if="pageLoading" class="poi-detail-page__skeleton-wrap">
      <Skeleton type="detail" />
    </view>

    <template v-else>
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

          <!-- 天气卡片 -->
          <view class="poi-detail-page__weather" v-if="weatherData" @click="toggleWeatherExpand">
            <view class="poi-detail-page__weather-main">
              <text class="poi-detail-page__weather-icon">{{ weatherData.current.icon }}</text>
              <view class="poi-detail-page__weather-info">
                <view class="poi-detail-page__weather-temp-row">
                  <text class="poi-detail-page__weather-temp">{{ weatherData.current.temp }}°</text>
                  <text class="poi-detail-page__weather-desc">{{ weatherData.current.weather }}</text>
                </view>
                <text class="poi-detail-page__weather-range">{{ weatherData.today.minTemp }}° / {{ weatherData.today.maxTemp }}° · 体感 {{ weatherData.current.feelsLike }}°</text>
              </view>
              <text class="poi-detail-page__weather-arrow">{{ weatherExpanded ? '▲' : '▼' }}</text>
            </view>
            <view v-if="weatherExpanded" class="poi-detail-page__weather-detail">
              <view class="poi-detail-page__weather-detail-row">
                <text class="poi-detail-page__weather-detail-label">💧 湿度</text>
                <text class="poi-detail-page__weather-detail-value">{{ weatherData.current.humidity }}%</text>
              </view>
              <view class="poi-detail-page__weather-detail-row">
                <text class="poi-detail-page__weather-detail-label">🌬️ 风速</text>
                <text class="poi-detail-page__weather-detail-value">{{ weatherData.current.windDir }} {{ weatherData.current.windSpeed }}km/h</text>
              </view>
              <view class="poi-detail-page__weather-detail-row">
                <text class="poi-detail-page__weather-detail-label">👁️ 能见度</text>
                <text class="poi-detail-page__weather-detail-value">{{ weatherData.current.visibility }}km</text>
              </view>
              <view class="poi-detail-page__weather-detail-row">
                <text class="poi-detail-page__weather-detail-label">☀️ 紫外线</text>
                <text class="poi-detail-page__weather-detail-value">{{ getUvLevel(weatherData.current.uvIndex) }}</text>
              </view>
              <view class="poi-detail-page__weather-detail-row" v-if="weatherData.tomorrow">
                <text class="poi-detail-page__weather-detail-label">📅 明天</text>
                <text class="poi-detail-page__weather-detail-value">{{ weatherData.tomorrow.minTemp }}°~{{ weatherData.tomorrow.maxTemp }}° {{ weatherData.tomorrow.weather }}</text>
              </view>
            </view>
          </view>

          <view class="poi-detail-page__meta-grid">
            <view class="poi-detail-page__meta-item">
              <view class="poi-detail-page__meta-icon"><text>🕐</text></view>
              <view class="poi-detail-page__meta-text">
                <text class="poi-detail-page__meta-label">开放时间</text>
                <text class="poi-detail-page__meta-value">{{ poiData.openTime }}</text>
              </view>
            </view>
            <view class="poi-detail-page__meta-item">
              <view class="poi-detail-page__meta-icon"><text>🎫</text></view>
              <view class="poi-detail-page__meta-text">
                <text class="poi-detail-page__meta-label">门票价格</text>
                <text class="poi-detail-page__meta-value">{{ poiData.ticketPrice }}</text>
              </view>
            </view>
            <view class="poi-detail-page__meta-item">
              <view class="poi-detail-page__meta-icon"><text>🚌</text></view>
              <view class="poi-detail-page__meta-text">
                <text class="poi-detail-page__meta-label">交通方式</text>
                <text class="poi-detail-page__meta-value">{{ poiData.traffic }}</text>
              </view>
            </view>
            <view class="poi-detail-page__meta-item">
              <view class="poi-detail-page__meta-icon"><text>📍</text></view>
              <view class="poi-detail-page__meta-text">
                <text class="poi-detail-page__meta-label">所在城市</text>
                <text class="poi-detail-page__meta-value">{{ poiData.city }}</text>
              </view>
            </view>
          </view>

          <view class="poi-detail-page__ai-summary">
            <text class="poi-detail-page__ai-label">🌿 AI总结：</text>
            <text class="poi-detail-page__ai-text">{{ poiData.aiSummary }}</text>
          </view>

          <!-- AI推荐景点 -->
          <view class="poi-detail-page__recommend" v-if="recommendList.length > 0">
            <view class="poi-detail-page__recommend-header">
              <text class="poi-detail-page__recommend-title">✨ 猜你也想去</text>
            </view>
            <scroll-view class="poi-detail-page__recommend-scroll" scroll-x :show-scrollbar="false">
              <view class="poi-detail-page__recommend-inner">
                <view
                  v-for="item in recommendList"
                  :key="item.id"
                  class="poi-detail-page__recommend-card"
                  @click="goPoiDetail(item)"
                >
                  <image
                    class="poi-detail-page__recommend-img"
                    v-if="item.images && item.images.length > 0"
                    :src="item.images[0]"
                    mode="aspectFill"
                  />
                  <view class="poi-detail-page__recommend-img poi-detail-page__recommend-img--empty" v-else>
                    <text>📍</text>
                  </view>
                  <view class="poi-detail-page__recommend-info">
                    <text class="poi-detail-page__recommend-name">{{ item.name }}</text>
                    <text class="poi-detail-page__recommend-reason">{{ item.reason }}</text>
                    <text class="poi-detail-page__recommend-rating">★ {{ item.rating }}</text>
                  </view>
                </view>
              </view>
            </scroll-view>
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
    </template>

    <!-- 分享弹窗 -->
    <view v-if="shareVisible" class="poi-detail-page__share-mask" @click="shareVisible = false">
      <view class="poi-detail-page__share-panel" @click.stop>
        <view class="poi-detail-page__share-header">
          <text class="poi-detail-page__share-title">分享到</text>
          <view class="poi-detail-page__share-close" @click="shareVisible = false">
            <text>✕</text>
          </view>
        </view>
        <view class="poi-detail-page__share-options">
          <view class="poi-detail-page__share-option" @click="shareToWechat">
            <view class="poi-detail-page__share-icon poi-detail-page__share-icon--wechat">
              <text>微</text>
            </view>
            <text class="poi-detail-page__share-option-text">微信好友</text>
          </view>
          <view class="poi-detail-page__share-option" @click="shareToMoments">
            <view class="poi-detail-page__share-icon poi-detail-page__share-icon--moments">
              <text>圈</text>
            </view>
            <text class="poi-detail-page__share-option-text">朋友圈</text>
          </view>
          <view class="poi-detail-page__share-option" @click="copyLink">
            <view class="poi-detail-page__share-icon poi-detail-page__share-icon--link">
              <text>⎘</text>
            </view>
            <text class="poi-detail-page__share-option-text">复制链接</text>
          </view>
          <view class="poi-detail-page__share-option" @click="saveImage">
            <view class="poi-detail-page__share-icon poi-detail-page__share-icon--save">
              <text>⬇</text>
            </view>
            <text class="poi-detail-page__share-option-text">保存图片</text>
          </view>
        </view>
        <view class="poi-detail-page__share-cancel" @click="shareVisible = false">
          <text class="poi-detail-page__share-cancel-text">取消</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPoiDetail, toggleFavorite as apiToggleFavorite, getWeather, getAiRecommend } from '@/api/poi'
import { getCommentList } from '@/api/comment'
import { getSystemInfo, getSafeAreaBottom } from '@/utils/safeArea'
import CommentItem from '@/components/CommentItem/CommentItem.vue'
import Skeleton from '@/components/Skeleton/Skeleton.vue'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const safeBottom = getSafeAreaBottom()
const bannerHeight = 280

const poiId = ref(0)
const pageLoading = ref(true)
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
  city: '',
  isFavorite: false
})
const isFavorite = ref(false)
const comments = ref([])
const commentSort = ref('hot')
const weatherData = ref(null)
const weatherExpanded = ref(false)
const recommendList = ref([])
const shareVisible = ref(false)

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  poiId.value = parseInt(page.options?.id || '1')
  loadAll()
})

watch(commentSort, () => {
  loadComments()
})

async function loadAll() {
  pageLoading.value = true
  try {
    const data = await getPoiDetail(poiId.value)
    if (data) {
      poiData.value = data
      isFavorite.value = data.isFavorite
      // 并行加载天气和推荐
      await Promise.all([
        loadWeather(data.city, data.latitude, data.longitude),
        loadRecommend(data.city, poiId.value)
      ])
    }
  } catch (e) {
    console.error('加载景点详情失败', e)
  } finally {
    pageLoading.value = false
  }
  loadComments()
}

async function loadWeather(city, lat, lon) {
  try {
    const data = await getWeather(city, lat || '', lon || '')
    if (data) weatherData.value = data
  } catch (e) {
    console.error('加载天气失败', e)
  }
}

async function loadRecommend(city, id) {
  try {
    const data = await getAiRecommend(city, String(id), 6)
    if (data) recommendList.value = data
  } catch (e) {
    console.error('加载推荐失败', e)
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

function getUvLevel(index) {
  const v = parseInt(index || 0)
  if (v <= 2) return '低'
  if (v <= 5) return '中等'
  if (v <= 7) return '高'
  if (v <= 10) return '很高'
  return '极高'
}

function toggleWeatherExpand() {
  weatherExpanded.value = !weatherExpanded.value
}

function goBack() {
  uni.navigateBack({ delta: 1 })
}

async function toggleFavorite() {
  try {
    const result = await apiToggleFavorite(poiId.value)
    isFavorite.value = result.isFavorite
  } catch (e) {
    isFavorite.value = !isFavorite.value
  }
  uni.showToast({ title: isFavorite.value ? '已收藏' : '取消收藏', icon: 'none' })
}

function handleCommentLike(id) {
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    comment.isLiked = !comment.isLiked
    comment.likeCount += comment.isLiked ? 1 : -1
  }
}

function handleCommentReply() {
  uni.showToast({ title: '回复功能开发中', icon: 'none' })
}

function goCommentList() {
  uni.navigateTo({ url: `/pages/comment/index?poiId=${poiId.value}` })
}

function goPoiDetail(poi) {
  uni.redirectTo({ url: `/pages/poi-detail/index?id=${poi.id}` })
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
  shareVisible.value = true
}

function shareToWechat() {
  shareVisible.value = false
  // #ifdef H5
  if (navigator.share) {
    navigator.share({ title: poiData.value.name, text: poiData.value.aiSummary, url: window.location.href })
    return
  }
  // #endif
  uni.showToast({ title: '请在微信中打开分享', icon: 'none' })
}

function shareToMoments() {
  shareVisible.value = false
  uni.showToast({ title: '请截图分享到朋友圈', icon: 'none' })
}

function copyLink() {
  shareVisible.value = false
  // #ifdef H5
  navigator.clipboard?.writeText(window.location.href)
  // #endif
  uni.setClipboardData({
    data: window.location?.href || `智旅AI - ${poiData.value.name}`,
    success: () => uni.showToast({ title: '链接已复制', icon: 'success' })
  })
}

function saveImage() {
  shareVisible.value = false
  uni.showToast({ title: '长按图片可保存', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.poi-detail-page {
  width: 100%;
  height: 100vh;
  background: #FFFFFF;
  position: relative;

  &__skeleton-wrap {
    padding: 0;
  }

  &__scroll {
    height: calc(100vh - 70px);
  }

  &__banner { position: relative; }
  &__swiper { width: 100%; height: 100%; }
  &__img { width: 100%; height: 100%; }

  &__nav {
    position: absolute; top: 0; left: 0; right: 0;
    display: flex; flex-direction: row; justify-content: space-between;
    padding: 0 16px; z-index: 10;
  }

  &__nav-btn {
    width: 40px; height: 40px; background: rgba(0, 0, 0, 0.3);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(10px);
  }

  &__nav-icon { font-size: 22px; color: #FFFFFF; }

  &__info { padding: 20px; }

  &__name-row {
    display: flex; flex-direction: row; align-items: center;
    justify-content: space-between; margin-bottom: 8px;
  }

  &__name { font-size: 24px; font-weight: 700; color: #1F2937; }

  &__badge {
    display: flex; flex-direction: row; align-items: center; gap: 4px;
    background: #FFF3E6; padding: 4px 8px; border-radius: 8px;
  }
  &__badge-icon { font-size: 14px; }
  &__badge-text { font-size: 12px; color: #FF9F43; font-weight: 700; }

  &__rating-row {
    display: flex; flex-direction: row; align-items: center;
    gap: 4px; margin-bottom: 16px;
  }
  &__star { font-size: 16px; color: #FF9F43; }
  &__rating { font-size: 16px; font-weight: 700; color: #374151; }
  &__divider { font-size: 14px; color: #DDE2E8; margin: 0 8px; }
  &__comment-count { font-size: 14px; color: #6B7A8D; }

  // 天气卡片
  &__weather {
    background: linear-gradient(135deg, #E0F7FA, #E8F5E9);
    border-radius: 16px; padding: 16px; margin-bottom: 20px;
  }

  &__weather-main {
    display: flex; flex-direction: row; align-items: center; gap: 12px;
  }

  &__weather-icon { font-size: 36px; }

  &__weather-info { flex: 1; }

  &__weather-temp-row {
    display: flex; flex-direction: row; align-items: baseline; gap: 8px;
  }

  &__weather-temp { font-size: 28px; font-weight: 700; color: #1F2937; }
  &__weather-desc { font-size: 14px; color: #4B5563; font-weight: 500; }
  &__weather-range { font-size: 12px; color: #6B7280; margin-top: 2px; }
  &__weather-arrow { font-size: 12px; color: #9CA3AF; padding: 8px; }

  &__weather-detail {
    margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.06);
    display: flex; flex-direction: column; gap: 8px;
  }

  &__weather-detail-row {
    display: flex; flex-direction: row; justify-content: space-between; align-items: center;
  }

  &__weather-detail-label { font-size: 13px; color: #6B7280; }
  &__weather-detail-value { font-size: 13px; color: #1F2937; font-weight: 600; }

  &__meta-grid {
    display: flex; flex-direction: row; flex-wrap: wrap;
    gap: 16px; margin-bottom: 24px;
  }

  &__meta-item {
    display: flex; flex-direction: row; align-items: center;
    gap: 8px; width: calc(50% - 8px);
  }

  &__meta-icon {
    width: 32px; height: 32px; background: #E8F8F7; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }

  &__meta-text { display: flex; flex-direction: column; }
  &__meta-label { font-size: 10px; color: #9CA3AF; }
  &__meta-value { font-size: 12px; font-weight: 700; color: #1F2937; }

  &__ai-summary {
    background: rgba(78, 205, 196, 0.05); border: 1px solid rgba(78, 205, 196, 0.2);
    border-radius: 16px; padding: 16px; margin-bottom: 24px;
  }
  &__ai-label { font-size: 14px; font-weight: 700; color: #4ECDC4; font-style: italic; margin-bottom: 4px; }
  &__ai-text { font-size: 14px; color: #4B5563; line-height: 22px; }

  // AI推荐
  &__recommend { margin-bottom: 24px; }

  &__recommend-header { margin-bottom: 12px; }
  &__recommend-title { font-size: 16px; font-weight: 700; color: #1F2937; }

  &__recommend-scroll { white-space: nowrap; }
  &__recommend-inner { display: flex; gap: 10px; padding-bottom: 4px; }

  &__recommend-card {
    width: 140px; flex-shrink: 0; border-radius: 12px; overflow: hidden;
    background: #F9FAFB; border: 1px solid #E5E7EB;
  }

  &__recommend-img { width: 140px; height: 90px; background: #E5E7EB; }
  &__recommend-img--empty {
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #E0F2F1, #B2DFDB); font-size: 28px;
  }

  &__recommend-info { padding: 8px 10px; }
  &__recommend-name {
    font-size: 13px; font-weight: 600; color: #1F2937;
    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden;
  }
  &__recommend-reason { font-size: 10px; color: #4ECDC4; margin-top: 2px; }
  &__recommend-rating { font-size: 11px; color: #F59E0B; font-weight: 600; margin-top: 2px; }

  // 评论区
  &__comment-section { border-top: 1px solid #F1F5F9; padding-top: 24px; }

  &__comment-header {
    display: flex; flex-direction: row; justify-content: space-between;
    align-items: center; margin-bottom: 24px;
  }
  &__comment-title { font-size: 16px; font-weight: 700; color: #1F2937; }

  &__comment-tabs { display: flex; flex-direction: row; gap: 8px; }

  &__comment-tab {
    padding: 4px 12px; border-radius: 20px; background: #F3F4F6;
    &--active { background: #E8F8F7; }
  }

  &__comment-tab-text {
    font-size: 12px; color: #6B7A8D;
    &--active { color: #4ECDC4; font-weight: 700; }
  }

  &__more-comments {
    padding: 16px 0; display: flex; align-items: center; justify-content: center;
  }
  &__more-text { font-size: 14px; color: #4ECDC4; font-weight: 500; }

  // 底部栏
  &__bottom-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 70px;
    background: #FFFFFF; border-top: 1px solid #F1F5F9;
    display: flex; flex-direction: row; align-items: center;
    justify-content: space-around; padding: 0 24px;
  }

  &__action-btn {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    &--nav {
      background: #4ECDC4; padding: 8px 24px; border-radius: 24px;
      flex-direction: row; gap: 6px;
    }
  }
  &__action-icon { font-size: 18px; }
  &__action-label { font-size: 11px; color: #6B7A8D; }
  &__action-btn--nav &__action-label { font-size: 14px; color: #FFFFFF; font-weight: 600; }

  // 分享弹窗
  &__share-mask {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.4); display: flex; align-items: flex-end;
  }

  &__share-panel {
    width: 100%; background: #FFFFFF; border-radius: 20px 20px 0 0;
    padding: 20px 16px; padding-bottom: env(safe-area-inset-bottom, 20px);
  }

  &__share-header {
    display: flex; flex-direction: row; justify-content: space-between;
    align-items: center; margin-bottom: 20px;
  }
  &__share-title { font-size: 16px; font-weight: 700; color: #1F2937; }
  &__share-close { padding: 4px 8px; }
  &__share-close text { font-size: 16px; color: #9CA3AF; }

  &__share-options {
    display: flex; flex-direction: row; justify-content: space-around; margin-bottom: 20px;
  }

  &__share-option {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }

  &__share-icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 700; color: #FFFFFF;

    &--wechat { background: #07C160; }
    &--moments { background: #07C160; }
    &--link { background: #4ECDC4; }
    &--save { background: #6366F1; }
  }

  &__share-option-text { font-size: 12px; color: #4B5563; }

  &__share-cancel {
    padding: 14px; text-align: center; background: #F3F4F6; border-radius: 12px;
  }
  &__share-cancel-text { font-size: 15px; color: #6B7280; font-weight: 500; }
}
</style>
