<template>
  <view class="mine-page">
    <scroll-view class="mine-page__scroll" scroll-y>
      <view class="mine-page__header" :style="{ paddingTop: (statusBarHeight + 16) + 'px' }">
        <view class="mine-page__header-top">
          <view class="mine-page__header-spacer"></view>
          <view class="mine-page__settings" @click="goSettings">
            <view class="mine-page__settings-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </view>
          </view>
        </view>
        <view class="mine-page__user">
          <view class="mine-page__avatar-wrap">
            <image class="mine-page__avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" />
            <view class="mine-page__avatar-badge" @click="editProfile">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
            </view>
          </view>
          <text class="mine-page__name">{{ userInfo.nickName || '未登录' }}</text>
          <view class="mine-page__level">
            <text class="mine-page__level-text">{{ userInfo.isLoggedIn ? userInfo.levelText : '点击登录' }}</text>
          </view>
        </view>
      </view>

      <view class="mine-page__stats">
        <view class="mine-page__stat" @click="goPage('route')">
          <text class="mine-page__stat-num">{{ userInfo.routeCount || 0 }}</text>
          <text class="mine-page__stat-label">我的路线</text>
        </view>
        <view class="mine-page__stat-divider"></view>
        <view class="mine-page__stat" @click="goPage('favorite')">
          <text class="mine-page__stat-num">{{ userInfo.favoriteCount || 0 }}</text>
          <text class="mine-page__stat-label">收藏景点</text>
        </view>
        <view class="mine-page__stat-divider"></view>
        <view class="mine-page__stat" @click="goPage('preference')">
          <text class="mine-page__stat-num">{{ userInfo.preferenceCount || 0 }}</text>
          <text class="mine-page__stat-label">偏好设置</text>
        </view>
      </view>

      <view class="mine-page__section">
        <text class="mine-page__section-title">常用功能</text>
        <view class="mine-page__card">
          <view class="mine-page__menu-item" @click="goPage('route')">
            <view class="mine-page__menu-icon mine-page__menu-icon--blue">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/>
                <line x1="9" y1="3" x2="9" y2="18"/>
                <line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">我的路线</text>
              <text class="mine-page__menu-desc">查看已创建的旅行路线</text>
            </view>
            <view class="mine-page__menu-arrow">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </view>
          </view>
          <view class="mine-page__menu-item" @click="goPage('favorite')">
            <view class="mine-page__menu-icon mine-page__menu-icon--red">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">我的收藏</text>
              <text class="mine-page__menu-desc">收藏的景点与路线</text>
            </view>
            <view class="mine-page__menu-arrow">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </view>
          </view>
          <view class="mine-page__menu-item" @click="goPage('preference')">
            <view class="mine-page__menu-icon mine-page__menu-icon--orange">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/>
                <line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">偏好设置</text>
              <text class="mine-page__menu-desc">个性化旅行偏好</text>
            </view>
            <view class="mine-page__menu-arrow">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <view class="mine-page__section">
        <text class="mine-page__section-title">数据与服务</text>
        <view class="mine-page__card">
          <view class="mine-page__menu-item" @click="goPage('offline')">
            <view class="mine-page__menu-icon mine-page__menu-icon--mint">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">离线缓存</text>
              <text class="mine-page__menu-desc">离线地图与数据缓存</text>
            </view>
            <view class="mine-page__menu-arrow">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </view>
          </view>
          <view class="mine-page__menu-item" @click="goPage('privacy')">
            <view class="mine-page__menu-icon mine-page__menu-icon--gray">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">隐私设置</text>
              <text class="mine-page__menu-desc">管理账号与数据隐私</text>
            </view>
            <view class="mine-page__menu-arrow">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <view class="mine-page__section">
        <text class="mine-page__section-title">帮助与反馈</text>
        <view class="mine-page__card">
          <view class="mine-page__menu-item" @click="goPage('feedback')">
            <view class="mine-page__menu-icon mine-page__menu-icon--purple">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">意见反馈</text>
              <text class="mine-page__menu-desc">告诉我们您的想法</text>
            </view>
            <view class="mine-page__menu-arrow">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <view class="mine-page__footer">
        <text class="mine-page__version">版本信息 v1.0.0</text>
        <view class="mine-page__logout" @click="handleLogout">
          <text class="mine-page__logout-text">退出登录</text>
        </view>
      </view>
    </scroll-view>
    <CustomTabBar />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { getSystemInfo } from '@/utils/safeArea'
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo || { isLoggedIn: false, nickName: '未登录', levelText: '点击登录', routeCount: 0, favoriteCount: 0, preferenceCount: 0 })

function goSettings() {
  uni.showToast({ title: '设置功能开发中', icon: 'none' })
}

function editProfile() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  uni.showToast({ title: '编辑资料开发中', icon: 'none' })
}

function goPage(page) {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  if (page === 'preference') {
    uni.navigateTo({ url: '/pages/preference/index' })
    return
  }
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

function handleLogout() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.mine-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F1F5F9;

  &__scroll {
    flex: 1;
    overflow: hidden;
  }

  &__header {
    background: linear-gradient(135deg, #4ECDC4 0%, #2A9D8F 100%);
    padding-bottom: 64px;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: -50%;
      right: -30%;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.04);
    }

    &::before {
      content: '';
      position: absolute;
      bottom: -40%;
      left: -20%;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
    }
  }

  &__header-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px 12px;
    position: relative;
    z-index: 1;
  }

  &__header-spacer {
    flex: 1;
  }

  &__settings {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;

    &:active {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  &__settings-icon {
    color: rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
  }

  &__user {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  &__avatar-wrap {
    position: relative;
    margin-bottom: 14px;
  }

  &__avatar {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.35);
    background: #E5E7EB;
  }

  &__avatar-badge {
    position: absolute;
    right: -2px;
    bottom: 2px;
    width: 26px;
    height: 26px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4ECDC4;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    transition: transform 0.2s ease;

    &:active {
      transform: scale(0.9);
    }
  }

  &__name {
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }

  &__level {
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(4px);
    padding: 4px 14px;
    border-radius: 20px;
  }

  &__level-text {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  &__stats {
    margin: -40px 20px 0;
    background: #FFFFFF;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 80px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
    position: relative;
    z-index: 10;
    overflow: hidden;
  }

  &__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: background 0.15s ease;
    height: 100%;
    justify-content: center;

    &:active {
      background: #F8FAFC;
    }
  }

  &__stat-num {
    font-size: 20px;
    font-weight: 700;
    color: #1F2937;
    letter-spacing: -0.3px;
  }

  &__stat-label {
    font-size: 12px;
    color: #6B7280;
    margin-top: 3px;
  }

  &__stat-divider {
    width: 1px;
    height: 32px;
    background: #E5E7EB;
  }

  &__section {
    padding: 20px 20px 0;
  }

  &__section-title {
    font-size: 13px;
    font-weight: 600;
    color: #6B7280;
    padding-left: 4px;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__card {
    background: #FFFFFF;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
    border: 1px solid #F1F5F9;
  }

  &__menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid #F1F5F9;
    cursor: pointer;
    transition: background 0.15s ease;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: #F8FAFC;
    }
  }

  &__menu-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--blue { background: #EFF6FF; }
    &--red { background: #FEF2F2; }
    &--orange { background: #FFF7ED; }
    &--mint { background: #F0FDFA; }
    &--gray { background: #F9FAFB; }
    &--purple { background: #FAF5FF; }
  }

  &__menu-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 14px;
  }

  &__menu-title {
    font-size: 15px;
    font-weight: 500;
    color: #1F2937;
    line-height: 1.4;
  }

  &__menu-desc {
    font-size: 12px;
    color: #9CA3AF;
    margin-top: 2px;
    line-height: 1.3;
  }

  &__menu-arrow {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }

  &__footer {
    padding: 24px 20px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  &__version {
    font-size: 12px;
    color: #9CA3AF;
  }

  &__logout {
    width: 100%;
    height: 46px;
    background: #FFFFFF;
    border: 1.5px solid #FCA5A5;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;

    &:active {
      background: #FEF2F2;
      border-color: #EF4444;
    }
  }

  &__logout-text {
    font-size: 15px;
    font-weight: 600;
    color: #EF4444;
  }
}
</style>
