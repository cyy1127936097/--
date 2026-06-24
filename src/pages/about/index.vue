<template>
  <view class="page">
    <!-- #ifdef H5 -->
    <view class="page__web-title">
      <view class="page__web-title-inner">
        <view class="page__web-back" @click="goBack"><text class="page__web-back-icon">‹</text></view>
        <text class="page__web-title-icon">🌍</text>
        <text class="page__web-title-text">关于我们</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="page__nav">
        <view class="page__back" @click="goBack"><text class="page__back-icon">‹</text></view>
        <text class="page__title">关于我们</text>
        <view class="page__back" style="opacity:0"><text class="page__back-icon">‹</text></view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view class="page__body" scroll-y>
      <view class="page__content">
        <view class="logo-area">
          <view class="logo">
            <text class="logo__icon">🌍</text>
          </view>
          <text class="logo__name">智旅AI</text>
          <text class="logo__version">v1.0.0</text>
        </view>
        <view class="info-grid">
          <view class="info-card">
            <text class="info-card__label">应用名称</text>
            <text class="info-card__value">智旅AI · 智能旅游助手</text>
          </view>
          <view class="info-card">
            <text class="info-card__label">版本号</text>
            <text class="info-card__value">1.0.0</text>
          </view>
          <view class="info-card">
            <text class="info-card__label">技术栈</text>
            <text class="info-card__value">uni-app + Spring Boot + AI</text>
          </view>
        </view>
        <view class="about-card">
          <text class="about-card__title">关于智旅AI</text>
          <text class="about-card__p">智旅AI 是一款基于人工智能的智能旅游规划应用，整合了全国25+城市景点数据，支持路线规划、社交分享、AI对话规划等功能。</text>
          <text class="about-card__p">我们致力于通过AI技术让每个人都能轻松规划完美旅程。</text>
        </view>
        <view class="footer">
          <text class="footer__text">© 2024 智旅AI Team · All Rights Reserved</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { getSystemInfo } from '@/utils/safeArea'
const statusBarHeight = getSystemInfo().statusBarHeight
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
.logo-area { display: flex; flex-direction: column; align-items: center; padding: 32px 0 24px; }
.logo { width: 72px; height: 72px; border-radius: 18px; background: linear-gradient(135deg, #4ECDC4, #2A9D8F); display: flex; align-items: center; justify-content: center; }
.logo__icon { font-size: 36px; }
.logo__name { font-size: 22px; font-weight: 700; color: #1F2937; margin-top: 12px; }
.logo__version { font-size: 13px; color: #9CA3AF; margin-top: 4px; }
.info-grid { display: flex; flex-direction: column; gap: 0; }
.info-card { background: #fff; border-radius: 0; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F3F4F6; }
.info-card:first-child { border-radius: 12px 12px 0 0; }
.info-card:last-child { border-radius: 0 0 12px 12px; border-bottom: none; }
.info-card__label { font-size: 15px; color: #1F2937; }
.info-card__value { font-size: 13px; color: #6B7280; }
.about-card { background: #fff; border-radius: 12px; padding: 20px; margin-top: 12px; }
.about-card__title { font-size: 16px; font-weight: 700; color: #1F2937; margin-bottom: 12px; display: block; }
.about-card__p { font-size: 14px; color: #6B7280; line-height: 1.8; display: block; margin-bottom: 8px; }
.footer { padding: 30px 0; text-align: center; }
.footer__text { font-size: 12px; color: #D1D5DB; }

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

.logo-area {
  padding: 48px 0 32px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.info-card {
  border-radius: 14px !important;
  border-bottom: none !important;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.info-card__label {
  font-size: 13px;
  color: #9CA3AF;
  font-weight: 500;
}

.info-card__value {
  font-size: 15px;
  color: #1F2937;
  font-weight: 600;
}

.about-card {
  border-radius: 14px;
  margin-top: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
/* #endif */
</style>
