<template>
  <view class="page">
    <!-- #ifdef H5 -->
    <view class="page__web-title">
      <view class="page__web-title-inner">
        <text class="page__web-title-icon">⚙️</text>
        <text class="page__web-title-text">设置</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="page__nav">
        <view class="page__back" @click="goBack"><text class="page__back-icon">‹</text></view>
        <text class="page__title">设置</text>
        <view class="page__back" style="opacity:0"><text class="page__back-icon">‹</text></view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view class="page__body" scroll-y>
      <view class="page__content">
        <view class="section">
          <text class="section__title">通知设置</text>
          <view class="card">
            <view class="item">
              <view class="item__left">
                <text class="item__icon">🔔</text>
                <text class="item__label">推送通知</text>
              </view>
              <switch :checked="pushOn" @change="pushOn = $event.detail.value" color="#4ECDC4" />
            </view>
            <view class="divider"></view>
            <view class="item">
              <view class="item__left">
                <text class="item__icon">🔊</text>
                <text class="item__label">声音提醒</text>
              </view>
              <switch :checked="soundOn" @change="soundOn = $event.detail.value" color="#4ECDC4" />
            </view>
          </view>
        </view>
        <view class="section">
          <text class="section__title">存储</text>
          <view class="card">
            <view class="item" @click="clearCache">
              <view class="item__left">
                <text class="item__icon">🗑</text>
                <text class="item__label">清除缓存</text>
              </view>
              <text class="item__hint">{{ cacheSize }}</text>
            </view>
          </view>
        </view>
        <view class="section">
          <text class="section__title">其他</text>
          <view class="card">
            <view class="item" @click="checkUpdate">
              <view class="item__left">
                <text class="item__icon">🔄</text>
                <text class="item__label">检查更新</text>
              </view>
              <text class="item__value">v1.0.0</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getSystemInfo } from '@/utils/safeArea'

const statusBarHeight = getSystemInfo().statusBarHeight
const pushOn = ref(true)
const soundOn = ref(true)
const cacheSize = ref('2.4 MB')

function clearCache() {
  uni.showModal({
    title: '清除缓存',
    content: '将清除所有本地缓存数据，确定继续？',
    confirmColor: '#EF4444',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        cacheSize.value = '0 B'
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      }
    }
  })
}

function checkUpdate() { uni.showToast({ title: '已是最新版本', icon: 'none' }) }
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
.card { background: #fff; border-radius: 12px; overflow: hidden; }
.item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; }
.item__left { display: flex; align-items: center; gap: 10px; }
.item__icon { font-size: 18px; }
.item__label { font-size: 15px; color: #1F2937; }
.item__hint { font-size: 12px; color: #9CA3AF; }
.item__value { font-size: 13px; color: #9CA3AF; }
.divider { height: 1px; background: #F3F4F6; margin: 0 16px; }

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

.card {
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.item {
  padding: 16px 20px;
}

.item:hover {
  background: #F9FAFB;
}

.item__icon {
  font-size: 20px;
}

.item__label {
  font-size: 15px;
}
/* #endif */
</style>
