<template>
  <view class="page">
    <!-- #ifdef H5 -->
    <view class="page__web-title">
      <view class="page__web-title-inner">
        <text class="page__web-title-icon">💾</text>
        <text class="page__web-title-text">离线缓存</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="page__nav">
        <view class="page__back" @click="goBack"><text class="page__back-icon">‹</text></view>
        <text class="page__title">离线缓存</text>
        <view class="page__back" style="opacity:0"><text class="page__back-icon">‹</text></view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view class="page__body" scroll-y>
      <view class="page__content">
        <view class="section">
          <text class="section__title">下载离线地图</text>
          <view class="city-grid">
            <view class="city-card" v-for="city in cities" :key="city.name">
              <view class="city-card__top">
                <text class="city-card__name">{{ city.name }}</text>
                <text class="city-card__size">{{ city.size }}</text>
              </view>
              <view class="city-card__btn" :class="{ 'city-card__btn--done': city.downloaded }" @click="toggleDownload(city)">
                <text>{{ city.downloaded ? '✓ 已下载' : '下载' }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="section" v-if="downloadedCount > 0">
          <text class="section__title">已下载（{{ downloadedCount }}）</text>
          <view class="card">
            <view class="item" v-for="city in downloadedCities" :key="city.name">
              <view class="item__left">
                <text class="item__name">{{ city.name }}</text>
                <text class="item__size">{{ city.size }}</text>
              </view>
              <view class="item__btn item__btn--del" @click="toggleDownload(city)">
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>
        <view class="hint">
          <text class="hint__text">下载离线地图后，无网络也能查看景点位置和路线</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getSystemInfo } from '@/utils/safeArea'

const statusBarHeight = getSystemInfo().statusBarHeight
const cities = ref([
  { name: '厦门', size: '12MB', downloaded: false },
  { name: '北京', size: '18MB', downloaded: false },
  { name: '成都', size: '14MB', downloaded: false },
  { name: '西安', size: '15MB', downloaded: false },
  { name: '三亚', size: '10MB', downloaded: false },
])

const downloadedCities = computed(() => cities.value.filter(c => c.downloaded))
const downloadedCount = computed(() => downloadedCities.value.length)

function toggleDownload(city) {
  if (city.downloaded) {
    city.downloaded = false
    uni.showToast({ title: '已删除离线数据', icon: 'none' })
  } else {
    uni.showLoading({ title: '下载中...' })
    setTimeout(() => {
      city.downloaded = true
      uni.hideLoading()
      uni.showToast({ title: '下载完成', icon: 'success' })
    }, 1500)
  }
}
function goBack() { uni.navigateBack() }
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
}
.section { margin-bottom: 20px; }
.section__title { font-size: 14px; font-weight: 600; color: #6B7280; margin-bottom: 10px; padding-left: 2px; }
.city-grid { display: flex; flex-direction: column; gap: 10px; }
.city-card { background: #fff; border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; }
.city-card__top { display: flex; flex-direction: column; gap: 2px; }
.city-card__name { font-size: 15px; color: #1F2937; font-weight: 500; }
.city-card__size { font-size: 12px; color: #9CA3AF; }
.city-card__btn { padding: 6px 16px; border-radius: 16px; background: #4ECDC4; cursor: pointer; }
.city-card__btn text { font-size: 12px; color: #fff; font-weight: 600; }
.city-card__btn--done { background: #E5E7EB; }
.city-card__btn--done text { color: #6B7280; }
.card { background: #fff; border-radius: 12px; overflow: hidden; }
.item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid #F3F4F6; }
.item:last-child { border-bottom: none; }
.item__left { display: flex; flex-direction: column; gap: 2px; }
.item__name { font-size: 15px; color: #1F2937; font-weight: 500; }
.item__size { font-size: 12px; color: #9CA3AF; }
.item__btn--del { padding: 6px 16px; border-radius: 16px; background: #FEF2F2; }
.item__btn--del text { font-size: 12px; color: #EF4444; font-weight: 600; }
.hint { padding: 20px; text-align: center; }
.hint__text { font-size: 13px; color: #9CA3AF; }

/* #ifdef H5 */
.page__web-title {
  background: #FFFFFF;
  border-bottom: 1px solid #EEF0F4;
}

.page__web-title-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px 24px 20px;
}

.page__web-title-icon {
  font-size: 28px;
}

.page__web-title-text {
  font-size: 24px;
  font-weight: 800;
  color: #1F2937;
}

.page__body {
  padding: 0 !important;
}

.page__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.section__title {
  font-size: 15px;
  color: #374151;
  margin-bottom: 12px;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.city-card {
  border-radius: 14px;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.city-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.city-card__btn {
  align-self: flex-start;
  transition: all 0.2s;
}

.city-card__btn:hover {
  opacity: 0.85;
}

.card {
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
/* #endif */
</style>
