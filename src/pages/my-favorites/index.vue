<template>
  <view class="page">
    <!-- #ifdef H5 -->
    <view class="page__web-title">
      <view class="page__web-title-inner">
        <view class="page__web-back" @click="goBack"><text class="page__web-back-icon">‹</text></view>
        <text class="page__web-title-icon">❤️</text>
        <text class="page__web-title-text">我的收藏</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="page__nav">
        <view class="page__back" @click="goBack"><text class="page__back-icon">‹</text></view>
        <text class="page__title">我的收藏</text>
        <view class="page__back" style="opacity:0"><text class="page__back-icon">‹</text></view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view class="page__body" scroll-y>
      <view class="page__content">
        <view v-if="loading" class="page__skeleton">
          <view v-for="i in 3" :key="i" class="page__skeleton-card"></view>
        </view>
        <view class="page__grid" v-else-if="favorites.length > 0">
          <view class="card" v-for="poi in favorites" :key="poi.id" @click="goDetail(poi.id)">
            <image class="card__cover" :src="getCover(poi.images)" mode="aspectFill" />
            <view class="card__info">
              <text class="card__name">{{ poi.name }}</text>
              <view class="card__row">
                <text class="card__star">★ {{ poi.rating }}</text>
                <text class="card__city">{{ poi.city }}</text>
              </view>
              <text class="card__price" v-if="poi.ticketPrice">{{ poi.ticketPrice }}</text>
            </view>
            <view class="card__fav" @click.stop="removeFavorite(poi)">
              <text class="card__fav-icon">♥</text>
            </view>
          </view>
        </view>
        <view class="page__empty" v-else>
          <text class="page__empty-icon">❤️</text>
          <text class="page__empty-text">暂无收藏，去发现页面收藏景点吧</text>
          <view class="page__empty-btn" @click="goDiscover">
            <text class="page__empty-btn-text">去发现</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSystemInfo } from '@/utils/safeArea'
import { get } from '@/utils/request'
import { toggleFavorite } from '@/api/poi'

const statusBarHeight = getSystemInfo().statusBarHeight
const favorites = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadFavorites()
})

async function loadFavorites() {
  loading.value = true
  try {
    favorites.value = await get('/poi/favorites')
  } catch (e) {
    favorites.value = []
  } finally {
    loading.value = false
  }
}

function getCover(images) {
  try {
    const arr = typeof images === 'string' ? JSON.parse(images) : images
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : ''
  } catch { return '' }
}

async function removeFavorite(poi) {
  try {
    await toggleFavorite(poi.id)
    favorites.value = favorites.value.filter(f => f.id !== poi.id)
    uni.showToast({ title: '取消收藏', icon: 'none' })
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

function goDetail(id) { uni.navigateTo({ url: '/pages/poi-detail/index?id=' + id }) }
function goBack() { uni.navigateBack() }
function goDiscover() { uni.switchTab({ url: '/pages/discover/index' }) }
</script>

<style lang="scss" scoped>
.page {
  width: 100%; height: 100vh; background: #F3F4F6; display: flex; flex-direction: column; overflow-x: hidden;
  &__header { background: #fff; border-bottom: 1px solid #E5E7EB; }
  &__nav { display: flex; justify-content: space-between; align-items: center; padding: 8px; }
  &__back { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
  &__back-icon { font-size: 28px; color: #1F2937; font-weight: 300; }
  &__title { font-size: 17px; font-weight: 700; color: #1F2937; }
  &__body { flex: 1; padding: 12px 16px; box-sizing: border-box; }
  &__grid { display: flex; flex-direction: column; gap: 10px; }
  &__empty { display: flex; flex-direction: column; align-items: center; padding-top: 80px; }
  &__empty-icon { font-size: 48px; }
  &__empty-text { font-size: 14px; color: #9CA3AF; margin-top: 12px; }
  &__empty-btn { margin-top: 20px; background: #4ECDC4; padding: 10px 28px; border-radius: 20px; }
  &__empty-btn-text { font-size: 14px; color: #fff; font-weight: 600; }
  &__skeleton { display: flex; flex-direction: column; gap: 10px; }
  &__skeleton-card { height: 74px; background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }
}
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.card {
  background: #fff; border-radius: 12px; padding: 10px; display: flex; align-items: center; gap: 12px;
  &__cover { width: 72px; height: 54px; border-radius: 8px; background: #E5E7EB; flex-shrink: 0; }
  &__info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  &__name { font-size: 15px; font-weight: 600; color: #1F2937; }
  &__row { display: flex; flex-direction: row; align-items: center; gap: 12px; }
  &__star { font-size: 12px; color: #F59E0B; font-weight: 600; }
  &__city { font-size: 11px; color: #9CA3AF; }
  &__price { font-size: 11px; color: #6B7A8D; }
  &__fav { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  &__fav-icon { font-size: 18px; color: #EF4444; }
}

/* #ifdef H5 */
.page__web-title { background: #FFFFFF; border-bottom: 1px solid #EEF0F4; }
.page__web-title-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 8px; padding: 24px 24px 20px; }
.page__web-back { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; cursor: pointer; transition: background 0.2s; margin-right: 4px; &:hover { background: #F3F4F6; } }
.page__web-back-icon { font-size: 24px; color: #1F2937; font-weight: 300; }
.page__web-title-icon { font-size: 28px; }
.page__web-title-text { font-size: 24px; font-weight: 800; color: #1F2937; }
.page__body { padding: 0 !important; }
.page__content { max-width: 1200px; margin: 0 auto; padding: 24px; }
.page__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.card { border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; &:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); } }
.card__cover { width: 100px; height: 75px; border-radius: 10px; }
.card__fav { cursor: pointer; border-radius: 8px; transition: background 0.2s; &:hover { background: #FEF2F2; } }
.page__skeleton { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.page__skeleton-card { height: 95px; }
/* #endif */
</style>
