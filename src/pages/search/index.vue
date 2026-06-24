<template>
  <view class="search-page">
    <!-- #ifdef H5 -->
    <view class="search-page__web-title">
      <view class="search-page__web-title-inner">
        <view class="search-page__web-back" @click="goBack"><text class="search-page__web-back-icon">‹</text></view>
        <view class="search-page__search-box">
          <text class="search-page__search-icon">🔍</text>
          <input
            class="search-page__search-input"
            v-model="keyword"
            placeholder="搜索景点、帖子、路线"
            confirm-type="search"
            @confirm="doSearch"
            focus
          />
          <view class="search-page__search-clear" v-if="keyword" @click="clearKeyword">
            <text class="search-page__search-clear-icon">✕</text>
          </view>
        </view>
        <view class="search-page__search-btn" @click="doSearch">
          <text class="search-page__search-btn-text">搜索</text>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="search-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="search-page__nav">
        <view class="search-page__back" @click="goBack"><text class="search-page__back-icon">‹</text></view>
        <view class="search-page__search-box search-page__search-box--app">
          <text class="search-page__search-icon">🔍</text>
          <input
            class="search-page__search-input"
            v-model="keyword"
            placeholder="搜索景点、帖子、路线"
            confirm-type="search"
            @confirm="doSearch"
            focus
          />
        </view>
        <view class="search-page__search-btn" @click="doSearch">
          <text class="search-page__search-btn-text">搜索</text>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view class="search-page__content" scroll-y>
      <!-- 搜索前：热门搜索 -->
      <view v-if="!hasSearched" class="search-page__hot">
        <text class="search-page__hot-title">🔥 热门搜索</text>
        <view class="search-page__hot-tags">
          <view
            v-for="hot in hotKeywords"
            :key="hot"
            class="search-page__hot-tag"
            @click="searchHot(hot)"
          >
            <text class="search-page__hot-tag-text">{{ hot }}</text>
          </view>
        </view>
      </view>

      <!-- 搜索中 -->
      <view v-else-if="searching" class="search-page__loading">
        <text class="search-page__loading-text">搜索中...</text>
      </view>

      <!-- 搜索结果 -->
      <view v-else-if="hasResults" class="search-page__results">
        <!-- 景点结果 -->
        <view v-if="results.pois.length > 0" class="search-page__section">
          <view class="search-page__section-header">
            <text class="search-page__section-title">📍 景点（{{ results.pois.length }}）</text>
          </view>
          <view class="search-page__poi-list">
            <view
              v-for="poi in results.pois"
              :key="poi.id"
              class="search-page__poi-item"
              @click="goPoiDetail(poi)"
            >
              <image
                class="search-page__poi-img"
                v-if="poi.images && poi.images.length > 0"
                :src="poi.images[0]"
                mode="aspectFill"
              />
              <view class="search-page__poi-img search-page__poi-img--empty" v-else>
                <text class="search-page__poi-img-icon">📍</text>
              </view>
              <view class="search-page__poi-info">
                <text class="search-page__poi-name">{{ poi.name }}</text>
                <view class="search-page__poi-meta">
                  <text class="search-page__poi-rating">★ {{ poi.rating }}</text>
                  <text class="search-page__poi-city">{{ poi.city }}</text>
                  <text class="search-page__poi-price" v-if="poi.ticketPrice">{{ poi.ticketPrice }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 路线结果 -->
        <view v-if="results.routes.length > 0" class="search-page__section">
          <view class="search-page__section-header">
            <text class="search-page__section-title">🗺️ 路线（{{ results.routes.length }}）</text>
          </view>
          <view class="search-page__route-list">
            <view
              v-for="route in results.routes"
              :key="route.id"
              class="search-page__route-item"
              @click="goRouteDetail(route)"
            >
              <view class="search-page__route-info">
                <text class="search-page__route-name">{{ route.name }}</text>
                <view class="search-page__route-meta">
                  <text class="search-page__route-city">📍 {{ route.city }}</text>
                  <text class="search-page__route-days">{{ getRouteDays(route) }}天</text>
                  <text class="search-page__route-pois">{{ getRoutePoiCount(route) }}个景点</text>
                </view>
              </view>
              <text class="search-page__route-arrow">›</text>
            </view>
          </view>
        </view>

        <!-- 帖子结果 -->
        <view v-if="results.posts.length > 0" class="search-page__section">
          <view class="search-page__section-header">
            <text class="search-page__section-title">📝 帖子（{{ results.posts.length }}）</text>
          </view>
          <!-- #ifdef H5 -->
          <view class="search-page__post-grid">
            <CommunityCard
              v-for="post in results.posts"
              :key="post.id"
              :data="post"
              @click="goPostDetail"
            />
          </view>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <view class="search-page__post-list">
            <view
              v-for="post in results.posts"
              :key="post.id"
              class="search-page__post-item"
              @click="goPostDetail(post)"
            >
              <image class="search-page__post-cover" v-if="post.cover" :src="post.cover" mode="aspectFill" />
              <view class="search-page__post-info">
                <text class="search-page__post-title">{{ post.title }}</text>
                <view class="search-page__post-meta">
                  <text class="search-page__post-user">{{ post.userName }}</text>
                  <text class="search-page__post-likes">♥ {{ post.likeCount }}</text>
                </view>
              </view>
            </view>
          </view>
          <!-- #endif -->
        </view>
      </view>

      <!-- 无结果 -->
      <view v-else class="search-page__no-result">
        <text class="search-page__no-result-icon">🔍</text>
        <text class="search-page__no-result-text">未找到「{{ searchedKeyword }}」相关内容</text>
        <text class="search-page__no-result-sub">试试其他关键词吧</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { searchAll } from '@/api/community'
import { useAppStore } from '@/store/app'
import { getSystemInfo } from '@/utils/safeArea'
// #ifdef H5
import CommunityCard from '@/components/CommunityCard/CommunityCard.vue'
// #endif

const appStore = useAppStore()
const { currentCity } = storeToRefs(appStore)
const statusBarHeight = getSystemInfo().statusBarHeight

const keyword = ref('')
const searchedKeyword = ref('')
const searching = ref(false)
const hasSearched = ref(false)
const results = ref({ pois: [], posts: [], routes: [] })

const hotKeywords = ['故宫', '西湖', '鼓浪屿', '兵马俑', '外滩', '大熊猫', '长城', '丽江']

const hasResults = computed(() =>
  results.value.pois.length > 0 || results.value.posts.length > 0 || results.value.routes.length > 0
)

async function doSearch() {
  if (!keyword.value.trim()) return
  searching.value = true
  hasSearched.value = true
  searchedKeyword.value = keyword.value.trim()
  try {
    const data = await searchAll(keyword.value.trim(), currentCity.value)
    results.value = data || { pois: [], posts: [], routes: [] }
  } catch (e) {
    results.value = { pois: [], posts: [], routes: [] }
  } finally {
    searching.value = false
  }
}

function searchHot(hot) {
  keyword.value = hot
  doSearch()
}

function clearKeyword() {
  keyword.value = ''
  hasSearched.value = false
  results.value = { pois: [], posts: [], routes: [] }
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

function goPostDetail(data) {
  const id = data?.id || data
  if (id) uni.navigateTo({ url: `/pages/community-detail/index?id=${id}` })
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.search-page {
  width: 100%; height: 100vh; background: #F3F4F6; display: flex; flex-direction: column;

  &__header { background: #fff; border-bottom: 1px solid #E5E7EB; }
  &__nav { display: flex; align-items: center; padding: 8px; gap: 8px; }
  &__back { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  &__back-icon { font-size: 28px; color: #1F2937; font-weight: 300; }

  &__search-box {
    flex: 1; display: flex; align-items: center; gap: 8px;
    background: #F3F4F6; border-radius: 20px; padding: 8px 14px;
  }
  &__search-box--app { max-width: none; }
  &__search-icon { font-size: 14px; }
  &__search-input { flex: 1; font-size: 14px; color: #1F2937; }
  &__search-clear { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
  &__search-clear-icon { font-size: 12px; color: #9CA3AF; }
  &__search-btn { padding: 8px 16px; flex-shrink: 0; }
  &__search-btn-text { font-size: 14px; color: #4ECDC4; font-weight: 600; }

  &__content { flex: 1; }

  &__hot { padding: 24px 16px; }
  &__hot-title { font-size: 15px; font-weight: 700; color: #1F2937; margin-bottom: 14px; }
  &__hot-tags { display: flex; flex-wrap: wrap; gap: 10px; }
  &__hot-tag { padding: 8px 16px; background: #fff; border-radius: 20px; border: 1px solid #E5E7EB; }
  &__hot-tag-text { font-size: 13px; color: #6B7A8D; }

  &__loading { display: flex; justify-content: center; padding: 60px 0; }
  &__loading-text { font-size: 14px; color: #9CA3AF; }

  &__results { padding: 12px 16px; }
  &__section { margin-bottom: 20px; }
  &__section-header { margin-bottom: 12px; }
  &__section-title { font-size: 15px; font-weight: 700; color: #1F2937; }

  &__poi-list { display: flex; flex-direction: column; gap: 10px; }
  &__poi-item { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 12px; padding: 12px; }
  &__poi-img { width: 64px; height: 64px; border-radius: 8px; flex-shrink: 0; background: #E5E7EB; }
  &__poi-img--empty { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #E0F2F1, #B2DFDB); }
  &__poi-img-icon { font-size: 24px; }
  &__poi-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
  &__poi-name { font-size: 15px; font-weight: 600; color: #1F2937; }
  &__poi-meta { display: flex; align-items: center; gap: 10px; }
  &__poi-rating { font-size: 12px; color: #F59E0B; font-weight: 600; }
  &__poi-city { font-size: 12px; color: #6B7A8D; }
  &__poi-price { font-size: 12px; color: #4ECDC4; }

  &__route-list { display: flex; flex-direction: column; gap: 10px; }
  &__route-item { display: flex; align-items: center; gap: 8px; background: #fff; border-radius: 12px; padding: 14px 16px; }
  &__route-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
  &__route-name { font-size: 15px; font-weight: 600; color: #1F2937; }
  &__route-meta { display: flex; align-items: center; gap: 10px; }
  &__route-city { font-size: 12px; color: #6B7A8D; }
  &__route-days { font-size: 12px; color: #4ECDC4; font-weight: 600; }
  &__route-pois { font-size: 12px; color: #9CA3AF; }
  &__route-arrow { font-size: 20px; color: #D1D5DB; }

  &__post-list { display: flex; flex-direction: column; gap: 10px; }
  &__post-item { display: flex; gap: 12px; background: #fff; border-radius: 12px; padding: 12px; }
  &__post-cover { width: 80px; height: 80px; border-radius: 8px; flex-shrink: 0; background: #E5E7EB; }
  &__post-info { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
  &__post-title { font-size: 14px; font-weight: 600; color: #1F2937; }
  &__post-meta { display: flex; align-items: center; gap: 12px; }
  &__post-user { font-size: 12px; color: #6B7A8D; }
  &__post-likes { font-size: 12px; color: #9CA3AF; }

  &__no-result { display: flex; flex-direction: column; align-items: center; padding: 80px 0; }
  &__no-result-icon { font-size: 48px; margin-bottom: 16px; }
  &__no-result-text { font-size: 15px; font-weight: 600; color: #4B5563; margin-bottom: 8px; }
  &__no-result-sub { font-size: 13px; color: #9CA3AF; }
}

/* #ifdef H5 */
.search-page__web-title { background: #FFFFFF; border-bottom: 1px solid #EEF0F4; }
.search-page__web-title-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 12px; padding: 16px 24px; }
.search-page__web-back { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; cursor: pointer; transition: background 0.2s; flex-shrink: 0; &:hover { background: #F3F4F6; } }
.search-page__web-back-icon { font-size: 24px; color: #1F2937; font-weight: 300; }
.search-page__search-box { flex: 1; max-width: 600px; }
.search-page__search-btn { cursor: pointer; }
.search-page__content { max-width: 1200px; margin: 0 auto; width: 100%; }
.search-page__results { max-width: 1200px; margin: 0 auto; padding: 24px; }
.search-page__post-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.search-page__poi-item, .search-page__route-item, .search-page__post-item { cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; &:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); } }
.search-page__hot { max-width: 1200px; margin: 0 auto; padding: 24px; }
.search-page__hot-tag { cursor: pointer; transition: all 0.2s; &:hover { background: #E8F8F7; border-color: #4ECDC4; } }
/* #endif */
</style>
