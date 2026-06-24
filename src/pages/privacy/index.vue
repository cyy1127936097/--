<template>
  <view class="page">
    <!-- #ifdef H5 -->
    <view class="page__web-title">
      <view class="page__web-title-inner">
        <view class="page__web-back" @click="goBack"><text class="page__web-back-icon">‹</text></view>
        <text class="page__web-title-icon">🔒</text>
        <text class="page__web-title-text">隐私设置</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="page__nav">
        <view class="page__back" @click="goBack"><text class="page__back-icon">‹</text></view>
        <text class="page__title">隐私设置</text>
        <view class="page__back" style="opacity:0"><text class="page__back-icon">‹</text></view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view class="page__body" scroll-y>
      <view class="page__content">
        <view class="section">
          <text class="section__title">数据权限</text>
          <view class="card">
            <view class="item">
              <view class="item__left">
                <text class="item__icon">🎯</text>
                <view class="item__text">
                  <text class="item__label">个性化推荐</text>
                  <text class="item__desc">根据偏好推荐景点和路线</text>
                </view>
              </view>
              <switch :checked="personalized" @change="personalized = $event.detail.value" color="#4ECDC4" />
            </view>
            <view class="divider"></view>
            <view class="item">
              <view class="item__left">
                <text class="item__icon">📍</text>
                <view class="item__text">
                  <text class="item__label">位置信息</text>
                  <text class="item__desc">获取位置以推荐附近景点</text>
                </view>
              </view>
              <switch :checked="location" @change="location = $event.detail.value" color="#4ECDC4" />
            </view>
            <view class="divider"></view>
            <view class="item">
              <view class="item__left">
                <text class="item__icon">📊</text>
                <view class="item__text">
                  <text class="item__label">数据统计</text>
                  <text class="item__desc">匿名统计数据以改善体验</text>
                </view>
              </view>
              <switch :checked="analytics" @change="analytics = $event.detail.value" color="#4ECDC4" />
            </view>
          </view>
        </view>
        <view class="section">
          <text class="section__title">隐私政策</text>
          <view class="card policy-card">
            <text class="policy-card__p">智旅AI 重视您的隐私。我们仅收集您的城市偏好和收藏记录以提供个性化推荐，不会向第三方共享您的个人数据。</text>
            <text class="policy-card__p">您可以随时在设置中关闭或删除数据，相关操作即时生效。</text>
          </view>
        </view>
        <view class="danger-zone">
          <view class="danger-btn" @click="deleteAllData">
            <text class="danger-btn__icon">⚠️</text>
            <text class="danger-btn__text">删除所有个人数据</text>
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
const personalized = ref(true)
const location = ref(true)
const analytics = ref(true)

function deleteAllData() {
  uni.showModal({
    title: '删除数据',
    content: '此操作不可撤销，确定删除所有个人数据？',
    confirmColor: '#EF4444',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        uni.showToast({ title: '数据已清除', icon: 'success' })
      }
    }
  })
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
.card { background: #fff; border-radius: 12px; overflow: hidden; }
.item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; }
.item__left { display: flex; align-items: center; gap: 10px; flex: 1; }
.item__icon { font-size: 18px; }
.item__text { display: flex; flex-direction: column; gap: 2px; }
.item__label { font-size: 15px; color: #1F2937; }
.item__desc { font-size: 12px; color: #9CA3AF; }
.divider { height: 1px; background: #F3F4F6; margin: 0 16px; }
.policy-card { padding: 16px; }
.policy-card__p { font-size: 13px; color: #6B7280; line-height: 1.7; display: block; margin-bottom: 8px; }
.danger-zone { padding: 16px 0; }
.danger-btn { padding: 14px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; display: flex; justify-content: center; align-items: center; gap: 6px; }
.danger-btn__icon { font-size: 16px; }
.danger-btn__text { font-size: 15px; color: #EF4444; font-weight: 600; }

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

.page__web-back {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
  margin-right: 4px;

  &:hover {
    background: #F3F4F6;
  }
}

.page__web-back-icon {
  font-size: 24px;
  color: #1F2937;
  font-weight: 300;
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

.policy-card {
  padding: 20px;
}

.policy-card__p {
  font-size: 14px;
  line-height: 1.8;
}

.danger-btn {
  padding: 16px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.danger-btn:hover {
  background: #FEE2E2;
  border-color: #FCA5A5;
}
/* #endif */
</style>
