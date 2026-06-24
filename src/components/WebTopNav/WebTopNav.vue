<template>
  <view class="web-nav">
    <view class="web-nav__inner">
      <view class="web-nav__logo" @click="goHome">
        <text class="web-nav__logo-icon">🌍</text>
        <text class="web-nav__logo-text">智旅AI</text>
      </view>
      <view class="web-nav__links">
        <view
          v-for="tab in tabs"
          :key="tab.pagePath"
          class="web-nav__link"
          :class="{ 'web-nav__link--active': currentIndex === tab.index }"
          @click="switchTab(tab.index)"
        >
          <text>{{ tab.text }}</text>
        </view>
      </view>
      <view class="web-nav__user" @click="goMine">
        <text class="web-nav__user-icon">👤</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const tabs = [
  { index: 0, pagePath: '/pages/index/index', text: '首页' },
  { index: 1, pagePath: '/pages/discover/index', text: '发现' },
  { index: 2, pagePath: '/pages/trip/index', text: '行程' },
  { index: 3, pagePath: '/pages/rank/index', text: '排行' },
  { index: 4, pagePath: '/pages/mine/index', text: '我的' },
]

const currentIndex = ref(0)

onShow(() => {
  const pages = getCurrentPages()
  const currentRoute = '/' + pages[pages.length - 1].route
  const idx = tabs.findIndex(t => t.pagePath === currentRoute)
  if (idx >= 0) currentIndex.value = idx
})

function switchTab(index) {
  if (currentIndex.value === index) return
  uni.switchTab({ url: tabs[index].pagePath })
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' })
}

function goMine() {
  uni.switchTab({ url: '/pages/mine/index' })
}
</script>

<style lang="scss" scoped>
.web-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 56px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #E5E7EB;
}

.web-nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.web-nav__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-right: 48px;
  flex-shrink: 0;
}

.web-nav__logo-icon {
  font-size: 24px;
}

.web-nav__logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  letter-spacing: -0.5px;
}

.web-nav__links {
  display: flex;
  flex: 1;
  gap: 4px;
}

.web-nav__link {
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.web-nav__link text {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
}

.web-nav__link:hover {
  background: #F3F4F6;
}

.web-nav__link--active {
  background: #ECFDF5;
}

.web-nav__link--active text {
  color: #059669;
  font-weight: 600;
}

.web-nav__user {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: auto;
  flex-shrink: 0;
}

.web-nav__user:hover {
  background: #E5E7EB;
}

.web-nav__user-icon {
  font-size: 16px;
}
</style>
