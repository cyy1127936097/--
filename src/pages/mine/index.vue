<template>
  <view class="mine-page">
    <scroll-view class="mine-page__scroll" scroll-y>
      <view class="mine-page__header" :style="{ paddingTop: (statusBarHeight + 16) + 'px' }">
        <view class="mine-page__settings" @click="goSettings">
          <text class="mine-page__settings-icon">⚙</text>
        </view>
        <view class="mine-page__user">
          <view class="mine-page__avatar-wrap">
            <image class="mine-page__avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" />
            <view class="mine-page__edit" @click="editProfile">
              <text class="mine-page__edit-icon">✎</text>
            </view>
          </view>
          <text class="mine-page__name">{{ userInfo.nickName || '未登录' }}</text>
          <view class="mine-page__level">
            <text class="mine-page__level-text">{{ userInfo.isLoggedIn ? userInfo.levelText : '点击登录' }}</text>
          </view>
        </view>
      </view>

      <view class="mine-page__stats">
        <view class="mine-page__stat">
          <text class="mine-page__stat-num">{{ userInfo.routeCount || 0 }}</text>
          <text class="mine-page__stat-label">我的路线</text>
        </view>
        <view class="mine-page__stat-divider"></view>
        <view class="mine-page__stat">
          <text class="mine-page__stat-num">{{ userInfo.favoriteCount || 0 }}</text>
          <text class="mine-page__stat-label">收藏景点</text>
        </view>
        <view class="mine-page__stat-divider"></view>
        <view class="mine-page__stat">
          <text class="mine-page__stat-num">{{ userInfo.preferenceCount || 0 }}</text>
          <text class="mine-page__stat-label">偏好设置</text>
        </view>
      </view>

      <view class="mine-page__divider">
        <view class="mine-page__divider-line"></view>
        <view class="mine-page__divider-dot"></view>
        <view class="mine-page__divider-line"></view>
      </view>

      <view class="mine-page__section">
        <view class="mine-page__group">
          <view class="mine-page__item" @click="goPage('route')">
            <view class="mine-page__item-left">
              <view class="mine-page__item-icon mine-page__item-icon--blue">
                <text>🗺️</text>
              </view>
              <view class="mine-page__item-text">
                <text class="mine-page__item-title">我的路线</text>
                <text class="mine-page__item-desc">查看已创建的旅行路线</text>
              </view>
            </view>
            <text class="mine-page__item-arrow">›</text>
          </view>
          <view class="mine-page__item" @click="goPage('favorite')">
            <view class="mine-page__item-left">
              <view class="mine-page__item-icon mine-page__item-icon--red">
                <text>❤️</text>
              </view>
              <view class="mine-page__item-text">
                <text class="mine-page__item-title">我的收藏</text>
                <text class="mine-page__item-desc">收藏的景点与路线</text>
              </view>
            </view>
            <text class="mine-page__item-arrow">›</text>
          </view>
          <view class="mine-page__item" @click="goPage('preference')">
            <view class="mine-page__item-left">
              <view class="mine-page__item-icon mine-page__item-icon--orange">
                <text>🎛️</text>
              </view>
              <view class="mine-page__item-text">
                <text class="mine-page__item-title">偏好设置</text>
                <text class="mine-page__item-desc">个性化旅行偏好</text>
              </view>
            </view>
            <text class="mine-page__item-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="mine-page__section">
        <view class="mine-page__group">
          <view class="mine-page__item" @click="goPage('offline')">
            <view class="mine-page__item-left">
              <view class="mine-page__item-icon mine-page__item-icon--mint">
                <text>📥</text>
              </view>
              <view class="mine-page__item-text">
                <text class="mine-page__item-title">离线缓存</text>
                <text class="mine-page__item-desc">离线地图与数据缓存</text>
              </view>
            </view>
            <text class="mine-page__item-arrow">›</text>
          </view>
          <view class="mine-page__item" @click="goPage('privacy')">
            <view class="mine-page__item-left">
              <view class="mine-page__item-icon mine-page__item-icon--gray">
                <text>🔒</text>
              </view>
              <view class="mine-page__item-text">
                <text class="mine-page__item-title">隐私设置</text>
                <text class="mine-page__item-desc">管理账号与数据隐私</text>
              </view>
            </view>
            <text class="mine-page__item-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="mine-page__section">
        <view class="mine-page__group">
          <view class="mine-page__item" @click="goPage('feedback')">
            <view class="mine-page__item-left">
              <view class="mine-page__item-icon mine-page__item-icon--purple">
                <text>💬</text>
              </view>
              <view class="mine-page__item-text">
                <text class="mine-page__item-title">意见反馈</text>
                <text class="mine-page__item-desc">告诉我们您的想法</text>
              </view>
            </view>
            <text class="mine-page__item-arrow">›</text>
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

    <CustomTabBar :selected="4" />
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
  background: #F3F4F6;

  &__scroll {
    height: 100%;
  }

  &__header {
    background: linear-gradient(135deg, #4ECDC4, #2A9D8F);
    padding-bottom: 60px;
    position: relative;
  }

  &__settings {
    display: flex;
    justify-content: flex-end;
    padding: 0 16px 16px;
  }

  &__settings-icon {
    font-size: 22px;
    color: rgba(255, 255, 255, 0.8);
  }

  &__user {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__avatar-wrap {
    position: relative;
    margin-bottom: 12px;
  }

  &__avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.4);
    background: #E5E7EB;
  }

  &__edit {
    position: absolute;
    right: 0;
    top: 0;
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__edit-icon {
    font-size: 12px;
    color: #FFFFFF;
  }

  &__name {
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: 6px;
  }

  &__level {
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 12px;
  }

  &__level-text {
    font-size: 11px;
    color: #FFFFFF;
    font-weight: 500;
  }

  &__stats {
    margin: -36px 24px 0;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #DDE2E8;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 72px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    position: relative;
    z-index: 10;
  }

  &__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__stat-num {
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
  }

  &__stat-label {
    font-size: 12px;
    color: #6B7A8D;
    margin-top: 2px;
  }

  &__stat-divider {
    width: 1px;
    height: 28px;
    background: #DDE2E8;
  }

  &__divider {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 24px 24px 0;
  }

  &__divider-line {
    flex: 1;
    height: 1px;
    background: #DDE2E8;
  }

  &__divider-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(78, 205, 196, 0.3);
  }

  &__section {
    padding: 20px 24px 0;
  }

  &__group {
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #DDE2E8;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  &__item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #F1F5F9;

    &:last-child {
      border-bottom: none;
    }
  }

  &__item-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  &__item-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;

    &--blue { background: #EFF6FF; }
    &--red { background: #FEF2F2; }
    &--orange { background: #FFF7ED; }
    &--mint { background: #E8F8F7; }
    &--gray { background: #F3F4F6; }
    &--purple { background: #FAF5FF; }
  }

  &__item-text {
    display: flex;
    flex-direction: column;
  }

  &__item-title {
    font-size: 14px;
    font-weight: 500;
    color: #1F2937;
  }

  &__item-desc {
    font-size: 12px;
    color: #6B7A8D;
    margin-top: 2px;
  }

  &__item-arrow {
    font-size: 18px;
    color: #6B7A8D;
  }

  &__footer {
    padding: 24px 24px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  &__version {
    font-size: 12px;
    color: #6B7A8D;
  }

  &__logout {
    width: 100%;
    height: 44px;
    background: #FFFFFF;
    border: 1px solid #E83838;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__logout-text {
    font-size: 14px;
    font-weight: 600;
    color: #E83838;
  }
}
</style>
