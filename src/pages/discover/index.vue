<template>
  <view class="discover-page">
    <!-- #ifdef H5 -->
    <view class="discover-page__web-title">
      <view class="discover-page__web-title-inner">
        <view class="discover-page__web-brand">
          <text class="discover-page__web-title-icon">✦</text>
          <text class="discover-page__web-title-text">发现精彩</text>
        </view>
        <view class="discover-page__web-search" @click="goSearch">
          <text class="discover-page__web-search-icon">⌕</text>
          <text class="discover-page__web-search-placeholder">搜索景点、帖子、路线</text>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="discover-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="discover-page__header-content">
        <view class="discover-page__title-row">
          <text class="discover-page__title-icon">✦</text>
          <text class="discover-page__title">发现精彩</text>
        </view>
        <view class="discover-page__header-btns">
          <view class="discover-page__header-btn" @click="goSearch">
            <text class="discover-page__header-icon">⌕</text>
          </view>
          <view class="discover-page__header-btn" @click="showToast('消息中心开发中')">
            <text class="discover-page__header-icon">♡</text>
            <view v-if="unreadCount > 0" class="discover-page__badge"></view>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view
      class="discover-page__content"
      scroll-y
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="discover-page__container">
        <!-- 顶部精选 Banner -->
        <view class="discover-page__banner" v-if="bannerPois.length > 0">
          <swiper
            class="discover-page__banner-swiper"
            :indicator-dots="bannerPois.length > 1"
            indicator-color="rgba(255,255,255,0.4)"
            indicator-active-color="#ffffff"
            :autoplay="true"
            :interval="5000"
            :circular="true"
            @change="onBannerChange"
          >
            <swiper-item v-for="(poi, idx) in bannerPois" :key="poi.id" @click="goPoiDetail(poi)">
              <view class="discover-page__banner-slide">
                <image
                  class="discover-page__banner-img"
                  v-if="poi.images && poi.images.length > 0"
                  :src="poi.images[0]"
                  mode="aspectFill"
                />
                <view class="discover-page__banner-img discover-page__banner-img--empty" v-else>
                  <text class="discover-page__banner-img-icon">⛰</text>
                </view>
                <view class="discover-page__banner-mask"></view>
                <view class="discover-page__banner-content">
                  <view class="discover-page__banner-tag">
                    <text class="discover-page__banner-tag-text">{{ idx === 0 ? '编辑精选' : '热门推荐' }}</text>
                  </view>
                  <text class="discover-page__banner-name">{{ poi.name }}</text>
                  <view class="discover-page__banner-meta">
                    <text class="discover-page__banner-rating">★ {{ poi.rating }}</text>
                    <text class="discover-page__banner-city" v-if="poi.city">📍 {{ poi.city }}</text>
                  </view>
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>

        <!-- 热门景点推荐板块 -->
        <view class="discover-page__section" v-if="hotPois.length > 0">
          <view class="discover-page__section-header">
            <view class="discover-page__section-title-wrap">
              <view class="discover-page__section-bar"></view>
              <view class="discover-page__section-title-text">
                <text class="discover-page__section-title">{{ currentCity }}热门景点</text>
                <text class="discover-page__section-subtitle">探索城市必去打卡地</text>
              </view>
            </view>
            <text class="discover-page__section-more" @click="goRanking">查看全部 →</text>
          </view>
          <scroll-view class="discover-page__poi-scroll" scroll-x :show-scrollbar="false">
            <view class="discover-page__poi-scroll-inner">
              <view
                v-for="poi in hotPois"
                :key="poi.id"
                class="discover-page__poi-card"
                @click="goPoiDetail(poi)"
              >
                <view class="discover-page__poi-img-wrap">
                  <image
                    class="discover-page__poi-img"
                    v-if="poi.images && poi.images.length > 0"
                    :src="poi.images[0]"
                    mode="aspectFill"
                  />
                  <view class="discover-page__poi-img discover-page__poi-img--empty" v-else>
                    <text class="discover-page__poi-img-icon">📍</text>
                  </view>
                  <view class="discover-page__poi-rating-badge" v-if="poi.rating">
                    <text class="discover-page__poi-rating-text">★ {{ poi.rating }}</text>
                  </view>
                </view>
                <view class="discover-page__poi-info">
                  <text class="discover-page__poi-name">{{ poi.name }}</text>
                  <text class="discover-page__poi-desc" v-if="poi.description">{{ poi.description }}</text>
                  <view class="discover-page__poi-tags">
                    <view class="discover-page__poi-tag" v-if="poi.category">
                      <text class="discover-page__poi-tag-text">{{ poi.category }}</text>
                    </view>
                    <view class="discover-page__poi-tag discover-page__poi-tag--price" v-if="poi.ticketPrice">
                      <text class="discover-page__poi-tag-text">{{ poi.ticketPrice }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 精选路线推荐板块 -->
        <view class="discover-page__section" v-if="recommendRoutes.length > 0">
          <view class="discover-page__section-header">
            <view class="discover-page__section-title-wrap">
              <view class="discover-page__section-bar discover-page__section-bar--route"></view>
              <view class="discover-page__section-title-text">
                <text class="discover-page__section-title">精选路线</text>
                <text class="discover-page__section-subtitle">达人推荐行程规划</text>
              </view>
            </view>
            <text class="discover-page__section-more" @click="goRoutes">查看全部 →</text>
          </view>
          <view class="discover-page__route-list">
            <view
              v-for="route in recommendRoutes"
              :key="route.id"
              class="discover-page__route-card"
              @click="goRouteDetail(route)"
            >
              <view class="discover-page__route-left">
                <view class="discover-page__route-days">
                  <text class="discover-page__route-days-num">{{ getRouteDays(route) }}</text>
                  <text class="discover-page__route-days-unit">天</text>
                </view>
              </view>
              <view class="discover-page__route-center">
                <text class="discover-page__route-name">{{ route.name }}</text>
                <view class="discover-page__route-meta">
                  <text class="discover-page__route-city">📍 {{ route.city }}</text>
                  <text class="discover-page__route-dot">·</text>
                  <text class="discover-page__route-pois">{{ getRoutePoiCount(route) }}个景点</text>
                </view>
              </view>
              <view class="discover-page__route-right">
                <text class="discover-page__route-arrow">→</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 帖子标签栏 -->
        <view class="discover-page__tags-section">
          <view class="discover-page__tags-header">
            <view class="discover-page__section-title-wrap">
              <view class="discover-page__section-bar discover-page__section-bar--community"></view>
              <view class="discover-page__section-title-text">
                <text class="discover-page__section-title">旅行社区</text>
                <text class="discover-page__section-subtitle">发现真实游记分享</text>
              </view>
            </view>
          </view>
          <scroll-view class="discover-page__tags" scroll-x :show-scrollbar="false">
            <view class="discover-page__tags-inner">
              <view
                v-for="tag in tags"
                :key="tag"
                class="discover-page__tag"
                :class="{ 'discover-page__tag--active': activeTag === tag }"
                @click="selectTag(tag)"
              >
                <text class="discover-page__tag-text" :class="{ 'discover-page__tag-text--active': activeTag === tag }">{{ tag }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 帖子列表 -->
        <view v-if="loading" class="discover-page__skeleton">
          <Skeleton type="grid" :count="4" />
        </view>

        <view v-else-if="communityList.length === 0" class="discover-page__empty">
          <text class="discover-page__empty-icon">📭</text>
          <text class="discover-page__empty-text">「{{ currentCity }}」暂无帖子</text>
          <text class="discover-page__empty-sub">换个城市看看更多精彩内容</text>
        </view>

        <!-- #ifdef H5 -->
        <view v-else class="discover-page__grid">
          <CommunityCard
            v-for="(item, idx) in communityList"
            :key="item.id"
            :data="item"
            :style="{ animationDelay: (idx * 0.06) + 's' }"
            @click="goCommunityDetail"
          />
        </view>
        <!-- #endif -->

        <!-- #ifndef H5 -->
        <view v-else class="discover-page__waterfall">
          <view class="discover-page__col">
            <CommunityCard
              v-for="(item, idx) in leftList"
              :key="item.id"
              :data="item"
              :style="{ animationDelay: (idx * 0.06) + 's' }"
              @click="goCommunityDetail"
            />
          </view>
          <view class="discover-page__col">
            <CommunityCard
              v-for="(item, idx) in rightList"
              :key="item.id"
              :data="item"
              :style="{ animationDelay: ((idx + leftList.length) * 0.06) + 's' }"
              @click="goCommunityDetail"
            />
          </view>
        </view>
        <!-- #endif -->

        <view class="discover-page__bottom">
          <text v-if="loading">加载中...</text>
          <text v-else>— 已经到底啦 —</text>
        </view>
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
import { ref, computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { getCommunityData } from '@/api/community'
import { getRecommendPoi, getRouteList } from '@/api/poi'
import { useAppStore } from '@/store/app'
import { getSystemInfo } from '@/utils/safeArea'
import CommunityCard from '@/components/CommunityCard/CommunityCard.vue'
import Skeleton from '@/components/Skeleton/Skeleton.vue'
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue'
// #ifdef H5
import WebTopNav from '@/components/WebTopNav/WebTopNav.vue'
// #endif

const appStore = useAppStore()
const { currentCity } = storeToRefs(appStore)
const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const tags = ref([])
const activeTag = ref('推荐')
const communityList = ref([])
const loading = ref(true)
const isRefreshing = ref(false)
const unreadCount = ref(3)
const hotPois = ref([])
const recommendRoutes = ref([])
const bannerIndex = ref(0)

// Banner 取热门景点前3个
const bannerPois = computed(() => hotPois.value.slice(0, 3))

const leftList = computed(() => communityList.value.filter((_, i) => i % 2 === 0))
const rightList = computed(() => communityList.value.filter((_, i) => i % 2 === 1))

onShow(() => {
  loadAll()
})

watch(currentCity, () => {
  loadAll()
})

async function loadAll() {
  await Promise.all([loadHotPois(), loadRoutes(), loadData()])
}

async function loadHotPois() {
  try {
    hotPois.value = await getRecommendPoi(currentCity.value, 8)
  } catch (e) {
    hotPois.value = []
  }
}

async function loadRoutes() {
  try {
    recommendRoutes.value = await getRouteList(currentCity.value)
  } catch (e) {
    recommendRoutes.value = []
  }
}

async function loadData() {
  loading.value = true
  try {
    const city = appStore.currentCity
    const res = await getCommunityData(activeTag.value || '推荐', city)
    if (res) {
      tags.value = res.tags || []
      communityList.value = res.list || []
    }
  } catch (e) {
    console.error('加载社区数据失败', e)
  } finally {
    loading.value = false
    isRefreshing.value = false
  }
}

async function selectTag(tag) {
  activeTag.value = tag
  communityList.value = []
  await loadData()
}

async function onRefresh() {
  isRefreshing.value = true
  await loadAll()
}

function onBannerChange(e) {
  bannerIndex.value = e.detail.current
}

function getRouteDays(route) {
  if (typeof route.days === 'number') return route.days
  if (Array.isArray(route.days)) return route.days.length
  return 1
}

function getRoutePoiCount(route) {
  if (Array.isArray(route.pois)) return route.pois.length
  let count = 0
  if (Array.isArray(route.days)) route.days.forEach(d => { if (d.pois) count += d.pois.length })
  return count || 0
}

function goPoiDetail(poi) {
  uni.navigateTo({ url: `/pages/poi-detail/index?id=${poi.id}` })
}

function goRouteDetail(route) {
  uni.navigateTo({ url: `/pages/trip-detail/index?id=${route.id}` })
}

function goCommunityDetail(data) {
  const id = data?.id || data
  if (id) uni.navigateTo({ url: `/pages/community-detail/index?id=${id}` })
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' })
}

function goRanking() {
  uni.switchTab({ url: '/pages/ranking/index' })
}

function goRoutes() {
  uni.switchTab({ url: '/pages/trip/index' })
}

function showToast(msg) {
  uni.showToast({ title: msg, icon: 'none' })
}
</script>

<style lang="scss" scoped>
/* ===== 设计变量 ===== */
$primary: #2A9D8F;
$primary-light: #4ECDC4;
$primary-bg: #E8F8F7;
$text-1: #1F2937;
$text-2: #6B7A8D;
$text-3: #9CA3AF;
$bg-page: #F7F8FA;
$bg-card: #FFFFFF;
$border: #EEF0F4;
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.04);
$shadow-md: 0 4px 16px rgba(15, 23, 42, 0.06);
$shadow-lg: 0 8px 32px rgba(15, 23, 42, 0.08);

.discover-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-page;

  /* ===== 移动端头部 ===== */
  &__header {
    background: $bg-card;
    border-bottom: 1px solid $border;
  }

  &__header-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    height: 44px;
  }

  &__title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  &__title-icon { font-size: 20px; color: $primary; }
  &__title { font-size: 20px; font-weight: 800; color: $text-1; letter-spacing: 0.3px; }

  &__header-btns { display: flex; flex-direction: row; gap: 4px; }
  &__header-btn {
    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; position: relative;
    &:active { background: #F3F4F6; }
  }
  &__header-icon { font-size: 18px; color: $text-2; }
  &__badge {
    position: absolute; top: 6px; right: 6px; width: 8px; height: 8px;
    background: #FF6B6B; border-radius: 50%; border: 1.5px solid $bg-card;
  }

  /* ===== 内容区 ===== */
  &__content { flex: 1; padding: 0; }

  &__container {
    padding: 16px;
  }

  /* ===== 顶部 Banner ===== */
  &__banner {
    margin-bottom: 24px;
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: $shadow-md;
  }

  &__banner-swiper {
    width: 100%;
    height: 200px;
  }

  &__banner-slide {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  &__banner-img {
    width: 100%;
    height: 100%;
  }

  &__banner-img--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2A9D8F, #4ECDC4);
  }

  &__banner-img-icon {
    font-size: 56px;
    color: rgba(255, 255, 255, 0.6);
  }

  &__banner-mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%);
  }

  &__banner-content {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__banner-tag {
    display: inline-flex;
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(8px);
    padding: 4px 12px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  &__banner-tag-text {
    font-size: 11px;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  &__banner-name {
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    line-height: 1.3;
  }

  &__banner-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__banner-rating {
    font-size: 13px;
    color: #FFD700;
    font-weight: 600;
  }

  &__banner-city {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.85);
  }

  /* ===== 通用板块 ===== */
  &__section {
    background: transparent;
    margin-bottom: 24px;
  }

  &__section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 16px;
  }

  &__section-title-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__section-bar {
    width: 4px;
    height: 28px;
    border-radius: 2px;
    background: linear-gradient(180deg, $primary-light, $primary);
  }

  &__section-bar--route {
    background: linear-gradient(180deg, #F4A261, #E76F51);
  }

  &__section-bar--community {
    background: linear-gradient(180deg, #A78BFA, #7C3AED);
  }

  &__section-title-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__section-title {
    font-size: 18px;
    font-weight: 800;
    color: $text-1;
    line-height: 1.2;
  }

  &__section-subtitle {
    font-size: 12px;
    color: $text-3;
    font-weight: 400;
  }

  &__section-more {
    font-size: 13px;
    color: $text-2;
    font-weight: 500;
    padding: 4px 0;
  }

  /* ===== 热门景点卡片 ===== */
  &__poi-scroll { white-space: nowrap; }
  &__poi-scroll-inner { display: flex; gap: 14px; padding-bottom: 4px; }

  &__poi-card {
    width: 200px;
    flex-shrink: 0;
    border-radius: $radius-lg;
    overflow: hidden;
    background: $bg-card;
    box-shadow: $shadow-sm;
  }

  &__poi-img-wrap {
    position: relative;
    width: 200px;
    height: 140px;
    overflow: hidden;
  }

  &__poi-img {
    width: 200px;
    height: 140px;
    background: #E5E7EB;
  }

  &__poi-img--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, $primary-bg, #B2DFDB);
  }

  &__poi-img-icon { font-size: 32px; }

  &__poi-rating-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    padding: 3px 8px;
    border-radius: 10px;
  }

  &__poi-rating-text {
    font-size: 11px;
    color: #FFD700;
    font-weight: 700;
  }

  &__poi-info {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__poi-name {
    font-size: 14px;
    font-weight: 700;
    color: $text-1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  &__poi-desc {
    font-size: 12px;
    color: $text-2;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  &__poi-tags {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }

  &__poi-tag {
    background: $primary-bg;
    padding: 2px 8px;
    border-radius: 6px;
  }

  &__poi-tag--price {
    background: #FFF4E6;
  }

  &__poi-tag-text {
    font-size: 11px;
    color: $primary;
    font-weight: 600;
  }

  &__poi-tag--price &__poi-tag-text {
    color: #F4A261;
  }

  /* ===== 精选路线卡片 ===== */
  &__route-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__route-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: $bg-card;
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;
  }

  &__route-left {
    flex-shrink: 0;
  }

  &__route-days {
    width: 52px;
    height: 52px;
    border-radius: $radius-md;
    background: linear-gradient(135deg, #F4A261, #E76F51);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
  }

  &__route-days-num {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }

  &__route-days-unit {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 2px;
  }

  &__route-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &__route-name {
    font-size: 15px;
    font-weight: 700;
    color: $text-1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  &__route-meta {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__route-city { font-size: 12px; color: $text-2; }
  &__route-dot { font-size: 12px; color: $text-3; }
  &__route-pois { font-size: 12px; color: $text-3; }

  &__route-right {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #F3F4F6;
  }

  &__route-arrow {
    font-size: 16px;
    color: $text-3;
    font-weight: 600;
  }

  /* ===== 社区标签栏 ===== */
  &__tags-section {
    margin-bottom: 16px;
  }

  &__tags-header {
    margin-bottom: 12px;
  }

  &__tags { white-space: nowrap; }
  &__tags-inner { display: flex; padding: 0; gap: 8px; }

  &__tag {
    padding: 7px 16px;
    border-radius: 20px;
    background: $bg-card;
    box-shadow: $shadow-sm;
    flex-shrink: 0;
    transition: all 0.25s ease;

    &--active {
      background: linear-gradient(135deg, $primary, $primary-light);
      box-shadow: 0 4px 12px rgba(42, 157, 143, 0.25);
    }
  }

  &__tag-text {
    font-size: 13px;
    color: $text-2;
    font-weight: 500;

    &--active {
      color: #ffffff;
      font-weight: 700;
    }
  }

  /* ===== 骨架屏 ===== */
  &__skeleton {
    display: flex;
    flex-direction: row;
    gap: 14px;
  }

  /* ===== 瀑布流 ===== */
  &__waterfall { display: flex; gap: 14px; }
  &__col { flex: 1; display: flex; flex-direction: column; gap: 14px; }

  /* ===== 底部 ===== */
  &__bottom {
    padding: 32px 0 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    text { font-size: 12px; color: #C0C7D0; }
  }

  /* ===== 空状态 ===== */
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 0 60px;
  }
  &__empty-icon { font-size: 56px; margin-bottom: 20px; opacity: 0.6; }
  &__empty-text { font-size: 16px; font-weight: 600; color: $text-2; margin-bottom: 8px; }
  &__empty-sub { font-size: 13px; color: $text-3; }
}

/* ===== H5 端专属样式 ===== */
/* #ifdef H5 */
.discover-page__web-title {
  background: $bg-card;
  border-bottom: 1px solid $border;
  position: sticky;
  top: 0;
  z-index: 10;
}

.discover-page__web-title-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.discover-page__web-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.discover-page__web-title-icon {
  font-size: 26px;
  color: $primary;
}

.discover-page__web-title-text {
  font-size: 24px;
  font-weight: 800;
  color: $text-1;
  letter-spacing: 0.5px;
}

.discover-page__web-search {
  flex: 1;
  max-width: 420px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: $bg-page;
  border-radius: 24px;
  padding: 11px 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;

  &:hover {
    background: #EEF0F4;
    border-color: $border;
  }
}

.discover-page__web-search-icon {
  font-size: 16px;
  color: $text-3;
}

.discover-page__web-search-placeholder {
  font-size: 14px;
  color: $text-3;
}

/* H5 内容容器统一宽度 */
.discover-page__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* H5 Banner 更大 */
.discover-page__banner-swiper {
  height: 320px;
}

.discover-page__banner-name {
  font-size: 28px;
}

.discover-page__banner-content {
  left: 32px;
  right: 32px;
  bottom: 32px;
}

/* H5 板块标题更大 */
.discover-page__section-title {
  font-size: 20px;
}

.discover-page__section-more {
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: $primary;
  }
}

/* H5 热门景点卡片 hover */
.discover-page__poi-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;

    .discover-page__poi-img {
      transform: scale(1.05);
    }
  }
}

.discover-page__poi-img {
  transition: transform 0.4s ease;
}

/* H5 路线卡片 hover */
.discover-page__route-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: $shadow-md;

    .discover-page__route-arrow {
      color: $primary;
    }

    .discover-page__route-right {
      background: $primary-bg;
    }
  }
}

.discover-page__route-right {
  transition: background 0.25s ease;
}

.discover-page__route-arrow {
  transition: color 0.25s ease;
}

/* H5 标签 hover */
.discover-page__tag {
  cursor: pointer;

  &:hover:not(.discover-page__tag--active) {
    background: $primary-bg;
  }
}

/* H5 Banner hover */
.discover-page__banner-slide {
  cursor: pointer;
}

/* H5 帖子网格 */
.discover-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  animation: fade-in-grid 0.4s ease;
}

@keyframes fade-in-grid {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.discover-page__skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.discover-page__waterfall {
  max-width: 1200px;
  margin: 0 auto;
}
/* #endif */
</style>
