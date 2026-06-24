<template>
  <view class="rank-page">
    <!-- #ifdef H5 -->
    <view class="rank-page__web-title">
      <view class="rank-page__web-title-inner">
        <text class="rank-page__web-title-icon">🏆</text>
        <text class="rank-page__web-title-text">热度排行</text>
        <text class="rank-page__web-title-city">{{ currentCity }}</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="rank-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="rank-page__header-bg">
        <view class="rank-page__header-glow"></view>
      </view>
      <view class="rank-page__header-content">
        <view class="rank-page__title-row">
          <text class="rank-page__title-icon">🏆</text>
          <text class="rank-page__title">热度排行</text>
        </view>
        <text class="rank-page__subtitle">{{ currentCity }}最受欢迎的旅行目的地</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- Tab切换栏 -->
    <view class="rank-page__tab-bar-wrap">
      <view class="rank-page__tab-bar">
        <view
          v-for="tab in tabs"
          :key="tab.key"
          class="rank-page__tab"
          :class="{ 'rank-page__tab--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <text class="rank-page__tab-icon">{{ tab.icon }}</text>
          <text class="rank-page__tab-text" :class="{ 'rank-page__tab-text--active': activeTab === tab.key }">{{ tab.label }}</text>
        </view>
      </view>
    </view>

    <scroll-view
      class="rank-page__scroll"
      scroll-y
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view v-if="loading" class="rank-page__skeleton">
        <view v-for="i in 6" :key="i" class="rank-page__skeleton-card">
          <view class="rank-page__skeleton-img"></view>
          <view class="rank-page__skeleton-body">
            <view class="rank-page__skeleton-line rank-page__skeleton-line--wide"></view>
            <view class="rank-page__skeleton-line rank-page__skeleton-line--mid"></view>
            <view class="rank-page__skeleton-line rank-page__skeleton-line--short"></view>
          </view>
        </view>
      </view>

      <view v-else class="rank-page__content">
        <!-- #ifdef H5 -->
        <view
          v-for="(poi, index) in rankList"
          :key="poi.id"
          class="rank-page__card"
          :class="`rank-page__card--rank${index + 1}`"
          :style="{ animationDelay: (index * 0.06) + 's' }"
          @click="goPoiDetail(poi)"
        >
          <view class="rank-page__card-img-wrap">
            <image class="rank-page__card-img" :src="poi.images[0]" mode="aspectFill" />
            <view class="rank-page__card-rank" :class="`rank-page__card-rank--${index < 3 ? ['gold','silver','bronze'][index] : 'normal'}`">
              <text>{{ index + 1 }}</text>
            </view>
            <view v-if="poi.isFavorite" class="rank-page__card-fav">
              <text>♥</text>
            </view>
          </view>
          <view class="rank-page__card-body">
            <view class="rank-page__card-name-row">
              <text class="rank-page__card-name">{{ poi.name }}</text>
              <view v-if="poi.topRank" class="rank-page__card-badge">
                <text>{{ poi.topRank }}</text>
              </view>
            </view>
            <view class="rank-page__card-rating">
              <text v-for="s in 5" :key="s" :class="s <= Math.floor(poi.rating) ? 'filled' : ''">★</text>
              <text class="rank-num">{{ poi.rating }}</text>
              <text class="dot">·</text>
              <text class="cate">{{ poi.category }}</text>
            </view>
            <text class="rank-page__card-desc">{{ poi.description }}</text>
            <view class="rank-page__card-tags">
              <text class="rank-page__card-tag">{{ poi.ticketPrice }}</text>
              <text class="rank-page__card-tag">{{ poi.traffic }}</text>
            </view>
          </view>
        </view>
        <!-- #endif -->

        <!-- #ifndef H5 -->
        <view
          v-for="(poi, index) in rankList"
          :key="poi.id"
          class="rank-page__item"
          :class="{
            'rank-page__item--gold': index === 0,
            'rank-page__item--silver': index === 1,
            'rank-page__item--bronze': index === 2,
            'rank-page__item--normal': index >= 3
          }"
          :style="{ animationDelay: (index * 0.08) + 's' }"
          @click="goPoiDetail(poi)"
        >
          <view class="rank-page__rank-col">
            <view v-if="index === 0" class="rank-page__medal rank-page__medal--gold">
              <text class="rank-page__medal-icon">🥇</text>
            </view>
            <view v-else-if="index === 1" class="rank-page__medal rank-page__medal--silver">
              <text class="rank-page__medal-icon">🥈</text>
            </view>
            <view v-else-if="index === 2" class="rank-page__medal rank-page__medal--bronze">
              <text class="rank-page__medal-icon">🥉</text>
            </view>
            <view v-else class="rank-page__rank-num">
              <text>{{ index + 1 }}</text>
            </view>
          </view>

          <view class="rank-page__card">
            <view class="rank-page__img-wrap">
              <image class="rank-page__img" :src="poi.images[0]" mode="aspectFill" />
              <view v-if="poi.isFavorite" class="rank-page__fav-tag">
                <text>♥</text>
              </view>
            </view>
            <view class="rank-page__info">
              <view class="rank-page__name-row">
                <text class="rank-page__name">{{ poi.name }}</text>
                <view v-if="poi.topRank" class="rank-page__top-badge">
                  <text>{{ poi.topRank }}</text>
                </view>
              </view>
              <view class="rank-page__rating-row">
                <view class="rank-page__stars">
                  <text v-for="s in 5" :key="s" class="rank-page__star" :class="{ 'rank-page__star--filled': s <= Math.floor(poi.rating) }">{{ s <= Math.floor(poi.rating) ? '★' : '☆' }}</text>
                </view>
                <text class="rank-page__rating-num">{{ poi.rating }}</text>
                <text class="rank-page__dot">·</text>
                <text class="rank-page__category">{{ poi.category }}</text>
              </view>
              <view class="rank-page__tags">
                <view class="rank-page__tag">
                  <text>{{ poi.ticketPrice }}</text>
                </view>
                <view class="rank-page__tag">
                  <text>{{ poi.traffic }}</text>
                </view>
              </view>
              <text class="rank-page__desc">{{ poi.description }}</text>
            </view>
            <view class="rank-page__arrow">
              <text>›</text>
            </view>
          </view>
        </view>
        <!-- #endif -->
      </view>

      <view class="rank-page__bottom">
        <text>— 已加载全部排行 —</text>
      </view>
    </scroll-view>
    <!-- #ifdef H5 -->
    <WebTopNav />
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <CustomTabBar />
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { getHotPoi, getRatingPoi } from '@/api/poi'
import { useAppStore } from '@/store/app'
import { getSystemInfo } from '@/utils/safeArea'
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue'
// #ifdef H5
import WebTopNav from '@/components/WebTopNav/WebTopNav.vue'
// #endif

const appStore = useAppStore()
const { currentCity } = storeToRefs(appStore)
const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const tabs = [
  { key: 'hot', label: '最热', icon: '🔥' },
  { key: 'rating', label: '评分', icon: '⭐' },
  { key: 'near', label: '最近', icon: '📍' }
]
const activeTab = ref('hot')
const rankList = ref([])
const loading = ref(true)
const isRefreshing = ref(false)

onShow(() => {
  loadRankList()
})

watch(activeTab, () => {
  loading.value = true
  loadRankList()
})

watch(() => currentCity.value, () => {
  loading.value = true
  loadRankList()
})

async function loadRankList() {
  try {
    const city = appStore.currentCity
    let data
    if (activeTab.value === 'rating') {
      data = await getRatingPoi(0, 20, city)
    } else {
      data = await getHotPoi(20, city)
    }
    rankList.value = data || []
  } catch (e) {
    console.error('加载排行失败', e)
  } finally {
    loading.value = false
    isRefreshing.value = false
  }
}

async function onRefresh() {
  isRefreshing.value = true
  await loadRankList()
}

function goPoiDetail(poi) {
  uni.navigateTo({ url: `/pages/poi-detail/index?id=${poi.id}` })
}
</script>

<style lang="scss" scoped>
.rank-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F0F2F5;

  &__header {
    background: linear-gradient(135deg, #1A1A2E, #16213E);
    position: relative;
    overflow: hidden;
  }

  &__header-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  &__header-glow {
    position: absolute;
    top: -50%;
    left: -20%;
    width: 140%;
    height: 200%;
    background: radial-gradient(ellipse at 30% 30%, rgba(78, 205, 196, 0.15), transparent 60%),
                radial-gradient(ellipse at 70% 70%, rgba(255, 159, 67, 0.1), transparent 60%);
  }

  &__header-content {
    position: relative;
    z-index: 1;
    padding: 12px 20px 20px;
  }

  &__title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  &__title-icon {
    font-size: 24px;
  }

  &__title {
    font-size: 22px;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: 0.5px;
  }

  &__subtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.55);
    margin-bottom: 16px;
    display: block;
  }

  &__tab-bar {
    display: flex;
    flex-direction: row;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 3px;
    gap: 2px;
    backdrop-filter: blur(10px);
  }

  &__tab {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 0;
    border-radius: 22px;
    transition: all 0.25s ease;

    &--active {
      background: #FFFFFF;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
  }

  &__tab-icon {
    font-size: 14px;
  }

  &__tab-text {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;

    &--active {
      color: #1F2937;
      font-weight: 700;
    }
  }

  &__scroll {
    flex: 1;
  }

  &__skeleton {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__skeleton-item {
    display: flex;
    flex-direction: row;
    gap: 12px;
    background: #FFFFFF;
    border-radius: 12px;
    padding: 12px;
    align-items: center;
  }

  &__skeleton-rank {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    flex-shrink: 0;
  }

  &__skeleton-img {
    width: 72px;
    height: 56px;
    border-radius: 8px;
    background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    flex-shrink: 0;
  }

  &__skeleton-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__skeleton-line {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;

    &--long { width: 70%; }
    &--short { width: 40%; }
  }

  &__content {
    padding: 16px 16px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 10px;
    animation: fade-in-up 0.4s ease both;
  }

  &__rank-col {
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__medal {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &--gold {
      background: linear-gradient(135deg, #FFD700, #FFA000);
      box-shadow: 0 0 16px rgba(255, 215, 0, 0.4);
      animation: pulse-glow 2s ease-in-out infinite;
    }

    &--silver {
      background: linear-gradient(135deg, #C0C0C0, #909090);
      box-shadow: 0 0 12px rgba(192, 192, 192, 0.3);
    }

    &--bronze {
      background: linear-gradient(135deg, #CD7F32, #A0522D);
      box-shadow: 0 0 12px rgba(205, 127, 50, 0.3);
    }
  }

  &__medal-icon {
    font-size: 20px;
  }

  &__rank-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #6B7A8D;
  }

  &__card {
    flex: 1;
    display: flex;
    flex-direction: row;
    background: #FFFFFF;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    position: relative;

    &--gold &__card {
      border: 1.5px solid rgba(255, 215, 0, 0.4);
    }
  }

  &__img-wrap {
    position: relative;
    width: 100px;
    height: 90px;
    flex-shrink: 0;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    background: #E5E7EB;
  }

  &__fav-tag {
    position: absolute;
    top: 6px;
    left: 6px;
    background: rgba(255, 107, 107, 0.9);
    border-radius: 10px;
    padding: 2px 6px;
    font-size: 10px;
    color: #FFFFFF;
  }

  &__info {
    flex: 1;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }

  &__name-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  &__name {
    font-size: 15px;
    font-weight: 700;
    color: #1F2937;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__top-badge {
    background: linear-gradient(135deg, #FF6B6B, #FF9F43);
    border-radius: 8px;
    padding: 2px 8px;
    flex-shrink: 0;

    text {
      font-size: 10px;
      color: #FFFFFF;
      font-weight: 600;
    }
  }

  &__rating-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }

  &__stars {
    display: flex;
    flex-direction: row;
    gap: 1px;
  }

  &__star {
    font-size: 12px;
    color: #D1D5DB;

    &--filled {
      color: #FF9F43;
    }
  }

  &__rating-num {
    font-size: 14px;
    font-weight: 700;
    color: #FF9F43;
  }

  &__dot {
    font-size: 12px;
    color: #D1D5DB;
  }

  &__category {
    font-size: 11px;
    color: #9CA3AF;
  }

  &__tags {
    display: flex;
    flex-direction: row;
    gap: 6px;
  }

  &__tag {
    background: #F3F4F6;
    border-radius: 6px;
    padding: 2px 8px;

    text {
      font-size: 10px;
      color: #6B7A8D;
    }
  }

  &__desc {
    font-size: 11px;
    color: #9CA3AF;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    display: flex;
    align-items: center;
    padding-right: 8px;

    text {
      font-size: 22px;
      color: #D1D5DB;
    }
  }

  &__bottom {
    padding: 24px 0 40px;
    display: flex;
    justify-content: center;

    text {
      font-size: 12px;
      color: #C0C7D0;
    }
  }
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
}

/* #ifdef H5 */
.rank-page__web-title {
  background: #FFFFFF;
  border-bottom: 1px solid #EEF0F4;
  padding: 0;
}

.rank-page__web-title-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px 24px 20px;
}

.rank-page__web-title-icon {
  font-size: 28px;
}

.rank-page__web-title-text {
  font-size: 24px;
  font-weight: 800;
  color: #1F2937;
}

.rank-page__web-title-city {
  font-size: 14px;
  color: #9CA3AF;
  font-weight: 500;
  margin-left: 4px;
}

.rank-page__tab-bar-wrap {
  background: #FFFFFF;
  border-bottom: 1px solid #EEF0F4;
  padding: 0;
}

.rank-page__tab-bar {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 8px 24px 12px;
  gap: 8px;
}

.rank-page__tab {
  padding: 8px 20px;
  border-radius: 20px;
  background: #F3F4F6;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.rank-page__tab:hover {
  background: #E5E7EB;
}

.rank-page__tab--active {
  background: #1F2937;
}
.rank-page__tab--active:hover {
  background: #374151;
}

.rank-page__tab-icon {
  font-size: 14px;
}

.rank-page__tab-text {
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
}

.rank-page__tab-text--active {
  color: #FFFFFF;
  font-weight: 600;
}

@media (min-width: 768px) {
  .rank-page__scroll {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 24px 0 !important;
  }

  .rank-page__content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
    padding: 0 !important;
  }

  .rank-page__skeleton {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
    padding: 0 !important;
  }

  .rank-page__skeleton-card {
    background: #FFFFFF;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .rank-page__skeleton-img {
    width: 100%;
    height: 180px;
    background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    border-radius: 0;
  }

  .rank-page__skeleton-body {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .rank-page__skeleton-line {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
  }

  .rank-page__skeleton-line--wide { width: 80%; }
  .rank-page__skeleton-line--mid { width: 55%; }
  .rank-page__skeleton-line--short { width: 35%; }
}

/* --- H5 卡片网格 --- */
.rank-page__card {
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  animation: fade-in-up 0.4s ease both;
}

.rank-page__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.rank-page__card-img-wrap {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #E5E7EB;
}

.rank-page__card-img {
  width: 100%;
  height: 100%;
}

.rank-page__card-rank {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: #FFFFFF;
  backdrop-filter: blur(8px);
}

.rank-page__card-rank--gold {
  background: linear-gradient(135deg, #FFD700, #FFA000);
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.4);
}

.rank-page__card-rank--silver {
  background: linear-gradient(135deg, #C0C0C0, #909090);
}

.rank-page__card-rank--bronze {
  background: linear-gradient(135deg, #CD7F32, #A0522D);
}

.rank-page__card-rank--normal {
  background: rgba(0, 0, 0, 0.55);
}

.rank-page__card-fav {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 107, 107, 0.9);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  color: #FFFFFF;
}

.rank-page__card-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rank-page__card-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rank-page__card-name {
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
}

.rank-page__card-badge {
  background: linear-gradient(135deg, #FF6B6B, #FF9F43);
  border-radius: 6px;
  padding: 2px 8px;
  flex-shrink: 0;
}

.rank-page__card-badge text {
  font-size: 10px;
  color: #FFFFFF;
  font-weight: 600;
}

.rank-page__card-rating {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rank-page__card-rating text {
  font-size: 13px;
  color: #D1D5DB;
}

.rank-page__card-rating text.filled {
  color: #FF9F43;
}

.rank-page__card-rating .rank-num {
  font-weight: 700;
  color: #FF9F43;
  margin-left: 6px;
  font-size: 14px;
}

.rank-page__card-rating .dot {
  font-size: 12px;
  color: #D1D5DB;
  margin: 0 4px;
}

.rank-page__card-rating .cate {
  font-size: 12px;
  color: #9CA3AF;
}

.rank-page__card-desc {
  font-size: 13px;
  color: #6B7280;
  line-height: 19px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rank-page__card-tags {
  display: flex;
  gap: 6px;
}

.rank-page__card-tag {
  background: #F3F4F6;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 11px;
  color: #6B7280;
  font-weight: 500;
}
/* #endif */
</style>
