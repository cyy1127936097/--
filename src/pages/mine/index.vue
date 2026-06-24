<template>
  <view class="mine-page">
    <!-- #ifdef H5 -->
    <view class="mine-page__web-container">
      <!-- 页面标题栏 -->
      <view class="mine-page__web-header">
        <view class="mine-page__web-header-inner">
          <text class="mine-page__web-header-icon">👤</text>
          <text class="mine-page__web-header-text">个人中心</text>
        </view>
      </view>

      <view class="mine-page__web-body">
        <!-- 左侧：个人资料卡片 -->
        <view class="mine-page__web-sidebar">
          <view class="mine-page__web-profile">
            <view class="mine-page__web-profile-bg"></view>
            <view class="mine-page__web-profile-main">
              <view class="mine-page__avatar-wrap" @click="changeAvatar">
                <image class="mine-page__avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" />
                <view class="mine-page__avatar-overlay">
                  <text class="mine-page__camera-icon">📷</text>
                </view>
              </view>
              <view class="mine-page__web-profile-info" @click="editProfile">
                <view class="mine-page__name-row">
                  <text class="mine-page__name">{{ userInfo.nickName || '未登录' }}</text>
                  <text class="mine-page__edit-icon">✎</text>
                </view>
                <view class="mine-page__level-badge">
                  <text class="mine-page__level-text">{{ userInfo.isLoggedIn ? userInfo.levelText : '点击登录体验更多功能' }}</text>
                </view>
                <view class="mine-page__bio" v-if="userInfo.bio">
                  <text class="mine-page__bio-text">{{ userInfo.bio }}</text>
                </view>
              </view>
            </view>
            <view class="mine-page__web-profile-stats">
              <view class="mine-page__web-profile-stat" @click="goPage('route')">
                <text class="mine-page__web-profile-stat-num">{{ userInfo.routeCount || 0 }}</text>
                <text class="mine-page__web-profile-stat-label">路线</text>
              </view>
              <view class="mine-page__web-profile-stat" @click="goPage('favorite')">
                <text class="mine-page__web-profile-stat-num">{{ userInfo.favoriteCount || 0 }}</text>
                <text class="mine-page__web-profile-stat-label">收藏</text>
              </view>
              <view class="mine-page__web-profile-stat" @click="goPage('preference')">
                <text class="mine-page__web-profile-stat-num">{{ userInfo.preferenceCount || 0 }}</text>
                <text class="mine-page__web-profile-stat-label">偏好</text>
              </view>
            </view>
          </view>
          <view class="mine-page__web-sidebar-actions">
            <view class="mine-page__web-sidebar-btn" @click="goSettings">
              <text class="mine-page__web-sidebar-btn-icon">⚙️</text>
              <text class="mine-page__web-sidebar-btn-text">系统设置</text>
            </view>
            <view class="mine-page__web-sidebar-btn" @click="handleShare">
              <text class="mine-page__web-sidebar-btn-icon">↗️</text>
              <text class="mine-page__web-sidebar-btn-text">分享应用</text>
            </view>
            <view class="mine-page__web-sidebar-btn mine-page__web-sidebar-btn--logout" @click="handleLogout">
              <text class="mine-page__web-sidebar-btn-text">{{ userInfo.isLoggedIn ? '退出登录' : '立即登录' }}</text>
            </view>
          </view>
        </view>

        <!-- 右侧：功能列表 -->
        <view class="mine-page__web-main">
          <view class="mine-page__web-section">
            <text class="mine-page__web-section-title">常用功能</text>
            <view class="mine-page__web-list">
              <view class="mine-page__web-list-item" @click="goPage('route')">
                <view class="mine-page__menu-icon mine-page__menu-icon--blue">
                  <text class="mine-page__menu-emoji">🗺️</text>
                </view>
                <view class="mine-page__menu-body">
                  <text class="mine-page__menu-title">我的路线</text>
                  <text class="mine-page__menu-desc">查看已创建的旅行路线</text>
                </view>
                <view class="mine-page__menu-badge" v-if="userInfo.routeCount > 0">{{ userInfo.routeCount }}</view>
                <text class="mine-page__menu-arrow">›</text>
              </view>
              <view class="mine-page__web-list-item" @click="goPage('favorite')">
                <view class="mine-page__menu-icon mine-page__menu-icon--red">
                  <text class="mine-page__menu-emoji">❤️</text>
                </view>
                <view class="mine-page__menu-body">
                  <text class="mine-page__menu-title">我的收藏</text>
                  <text class="mine-page__menu-desc">收藏的景点与路线</text>
                </view>
                <text class="mine-page__menu-arrow">›</text>
              </view>
              <view class="mine-page__web-list-item" @click="goPage('preference')">
                <view class="mine-page__menu-icon mine-page__menu-icon--orange">
                  <text class="mine-page__menu-emoji">⚡</text>
                </view>
                <view class="mine-page__menu-body">
                  <text class="mine-page__menu-title">偏好设置</text>
                  <text class="mine-page__menu-desc">个性化旅行偏好推荐</text>
                </view>
                <text class="mine-page__menu-arrow">›</text>
              </view>
            </view>
          </view>

          <view class="mine-page__web-section">
            <text class="mine-page__web-section-title">数据与服务</text>
            <view class="mine-page__web-list">
              <view class="mine-page__web-list-item" @click="goPage('offline')">
                <view class="mine-page__menu-icon mine-page__menu-icon--mint">
                  <text class="mine-page__menu-emoji">💾</text>
                </view>
                <view class="mine-page__menu-body">
                  <text class="mine-page__menu-title">离线缓存</text>
                  <text class="mine-page__menu-desc">离线地图与数据下载</text>
                </view>
                <text class="mine-page__menu-arrow">›</text>
              </view>
              <view class="mine-page__web-list-item" @click="goPage('privacy')">
                <view class="mine-page__menu-icon mine-page__menu-icon--gray">
                  <text class="mine-page__menu-emoji">🔒</text>
                </view>
                <view class="mine-page__menu-body">
                  <text class="mine-page__menu-title">隐私设置</text>
                  <text class="mine-page__menu-desc">管理账号与数据隐私</text>
                </view>
                <text class="mine-page__menu-arrow">›</text>
              </view>
            </view>
          </view>

          <view class="mine-page__web-section">
            <text class="mine-page__web-section-title">帮助与反馈</text>
            <view class="mine-page__web-list">
              <view class="mine-page__web-list-item" @click="goPage('feedback')">
                <view class="mine-page__menu-icon mine-page__menu-icon--purple">
                  <text class="mine-page__menu-emoji">💬</text>
                </view>
                <view class="mine-page__menu-body">
                  <text class="mine-page__menu-title">意见反馈</text>
                  <text class="mine-page__menu-desc">告诉我们您的想法</text>
                </view>
                <text class="mine-page__menu-arrow">›</text>
              </view>
              <view class="mine-page__web-list-item" @click="goPage('about')">
                <view class="mine-page__menu-icon mine-page__menu-icon--blue">
                  <text class="mine-page__menu-emoji">ℹ️</text>
                </view>
                <view class="mine-page__menu-body">
                  <text class="mine-page__menu-title">关于我们</text>
                  <text class="mine-page__menu-desc">了解智旅AI团队</text>
                </view>
                <text class="mine-page__menu-arrow">›</text>
              </view>
            </view>
          </view>

          <view class="mine-page__web-footer">
            <text class="mine-page__web-footer-version">智旅AI v1.0.0</text>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <scroll-view class="mine-page__scroll" scroll-y refresher-enabled :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh">
      <view class="mine-page__header" :style="{ paddingTop: (statusBarHeight + 20) + 'px' }">
        <view class="mine-page__header-bg"></view>
        <view class="mine-page__header-top">
          <view class="mine-page__header-spacer"></view>
          <view class="mine-page__header-actions">
            <view class="mine-page__action-btn" @click="goSettings">
              <text class="mine-page__action-icon">⚙</text>
            </view>
            <view class="mine-page__action-btn" @click="handleShare">
              <text class="mine-page__action-icon">↗</text>
            </view>
          </view>
        </view>
        <view class="mine-page__user">
          <view class="mine-page__avatar-wrap" @click="changeAvatar">
            <image class="mine-page__avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" />
            <view class="mine-page__avatar-overlay">
              <text class="mine-page__camera-icon">📷</text>
            </view>
          </view>
          <view class="mine-page__user-info" @click="editProfile">
            <view class="mine-page__name-row">
              <text class="mine-page__name">{{ userInfo.nickName || '未登录' }}</text>
              <text class="mine-page__edit-icon">✎</text>
            </view>
            <view class="mine-page__level-badge">
              <text class="mine-page__level-text">{{ userInfo.isLoggedIn ? userInfo.levelText : '点击登录体验更多功能' }}</text>
            </view>
            <view class="mine-page__bio" v-if="userInfo.bio">
              <text class="mine-page__bio-text">{{ userInfo.bio }}</text>
            </view>
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
              <text class="mine-page__menu-emoji">🗺️</text>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">我的路线</text>
              <text class="mine-page__menu-desc">查看已创建的旅行路线</text>
            </view>
            <view class="mine-page__menu-badge" v-if="userInfo.routeCount > 0">{{ userInfo.routeCount }}</view>
            <text class="mine-page__menu-arrow">›</text>
          </view>
          <view class="mine-page__menu-divider"></view>
          <view class="mine-page__menu-item" @click="goPage('favorite')">
            <view class="mine-page__menu-icon mine-page__menu-icon--red">
              <text class="mine-page__menu-emoji">❤️</text>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">我的收藏</text>
              <text class="mine-page__menu-desc">收藏的景点与路线</text>
            </view>
            <text class="mine-page__menu-arrow">›</text>
          </view>
          <view class="mine-page__menu-divider"></view>
          <view class="mine-page__menu-item" @click="goPage('preference')">
            <view class="mine-page__menu-icon mine-page__menu-icon--orange">
              <text class="mine-page__menu-emoji">⚡</text>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">偏好设置</text>
              <text class="mine-page__menu-desc">个性化旅行偏好推荐</text>
            </view>
            <text class="mine-page__menu-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="mine-page__section">
        <text class="mine-page__section-title">数据与服务</text>
        <view class="mine-page__card">
          <view class="mine-page__menu-item" @click="goPage('offline')">
            <view class="mine-page__menu-icon mine-page__menu-icon--mint">
              <text class="mine-page__menu-emoji">💾</text>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">离线缓存</text>
              <text class="mine-page__menu-desc">离线地图与数据下载</text>
            </view>
            <text class="mine-page__menu-arrow">›</text>
          </view>
          <view class="mine-page__menu-divider"></view>
          <view class="mine-page__menu-item" @click="goPage('privacy')">
            <view class="mine-page__menu-icon mine-page__menu-icon--gray">
              <text class="mine-page__menu-emoji">🔒</text>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">隐私设置</text>
              <text class="mine-page__menu-desc">管理账号与数据隐私</text>
            </view>
            <text class="mine-page__menu-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="mine-page__section">
        <text class="mine-page__section-title">帮助与反馈</text>
        <view class="mine-page__card">
          <view class="mine-page__menu-item" @click="goPage('feedback')">
            <view class="mine-page__menu-icon mine-page__menu-icon--purple">
              <text class="mine-page__menu-emoji">💬</text>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">意见反馈</text>
              <text class="mine-page__menu-desc">告诉我们您的想法</text>
            </view>
            <text class="mine-page__menu-arrow">›</text>
          </view>
          <view class="mine-page__menu-divider"></view>
          <view class="mine-page__menu-item" @click="goPage('about')">
            <view class="mine-page__menu-icon mine-page__menu-icon--blue">
              <text class="mine-page__menu-emoji">ℹ️</text>
            </view>
            <view class="mine-page__menu-body">
              <text class="mine-page__menu-title">关于我们</text>
              <text class="mine-page__menu-desc">了解智旅AI团队</text>
            </view>
            <text class="mine-page__menu-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="mine-page__footer">
        <text class="mine-page__version">智旅AI v1.0.0</text>
        <view class="mine-page__logout" @click="handleLogout">
          <text class="mine-page__logout-text">{{ userInfo.isLoggedIn ? '退出登录' : '立即登录' }}</text>
        </view>
      </view>
    </scroll-view>
    <!-- #endif -->

    <view v-if="showEditModal" class="mine-page__modal-overlay" @click="closeEditModal">
      <view class="mine-page__modal" @click.stop>
        <view class="mine-page__modal-header">
          <text class="mine-page__modal-title">编辑资料</text>
          <text class="mine-page__modal-close" @click="closeEditModal">✕</text>
        </view>
        <view class="mine-page__modal-body">
          <view class="mine-page__modal-avatar-row">
            <image class="mine-page__modal-avatar" :src="editForm.avatar || '/static/default-avatar.png'" mode="aspectFill" @click="changeAvatar" />
            <text class="mine-page__modal-avatar-hint">点击更换头像</text>
          </view>
          <view class="mine-page__modal-field">
            <text class="mine-page__modal-label">昵称</text>
            <input class="mine-page__modal-input" v-model="editForm.nickName" placeholder="请输入昵称" />
          </view>
          <view class="mine-page__modal-field">
            <text class="mine-page__modal-label">个签</text>
            <input class="mine-page__modal-input" v-model="editForm.bio" placeholder="介绍一下自己吧~" />
          </view>
        </view>
        <view class="mine-page__modal-footer">
          <view class="mine-page__modal-btn mine-page__modal-btn--cancel" @click="closeEditModal">
            <text>取消</text>
          </view>
          <view class="mine-page__modal-btn mine-page__modal-btn--confirm" @click="saveProfile">
            <text>保存</text>
          </view>
        </view>
      </view>
    </view>

    <!-- #ifdef H5 -->
    <WebTopNav />
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <CustomTabBar />
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import { getSystemInfo } from '@/utils/safeArea'
import { uploadAvatar, updateUserInfo } from '@/api/user'
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue'
// #ifdef H5
import WebTopNav from '@/components/WebTopNav/WebTopNav.vue'
// #endif

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo || { isLoggedIn: false, nickName: '未登录', levelText: '点击登录', routeCount: 0, favoriteCount: 0, preferenceCount: 0 })

const showEditModal = ref(false)
const isRefreshing = ref(false)

const editForm = reactive({
  nickName: '',
  avatar: '',
  bio: ''
})

function goSettings() {
  uni.navigateTo({ url: '/pages/settings/index' })
}

function handleShare() {
  uni.showToast({ title: '感谢分享智旅AI 🎉', icon: 'none' })
}

function changeAvatar() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      try {
        uni.showLoading({ title: '上传中...' })
        const uploadRes = await uploadAvatar(tempFilePath)
        uni.hideLoading()
        const avatarUrl = uploadRes.url
        await updateUserInfo({ avatar: avatarUrl })
        userStore.updateLocalInfo({ avatar: avatarUrl })
        editForm.avatar = avatarUrl
        uni.showToast({ title: '头像已更新', icon: 'success' })
      } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: '上传失败，请重试', icon: 'none' })
      }
    }
  })
}

function editProfile() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  editForm.nickName = userInfo.value.nickName || ''
  editForm.avatar = userInfo.value.avatar || ''
  editForm.bio = userInfo.value.bio || ''
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
}

async function saveProfile() {
  try {
    uni.showLoading({ title: '保存中...' })
    await updateUserInfo({
      nickName: editForm.nickName,
      bio: editForm.bio
    })
    uni.hideLoading()
    userStore.updateLocalInfo({
      nickName: editForm.nickName,
      bio: editForm.bio
    })
    uni.showToast({ title: '资料已更新', icon: 'success' })
  } catch (e) {
    uni.hideLoading()
    userStore.updateLocalInfo({
      nickName: editForm.nickName,
      bio: editForm.bio
    })
    uni.showToast({ title: '已本地保存', icon: 'success' })
  }
  showEditModal.value = false
}

function goPage(page) {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  const routes = {
    route: '/pages/my-routes/index',
    favorite: '/pages/my-favorites/index',
    preference: '/pages/preference/index',
    offline: '/pages/offline/index',
    privacy: '/pages/privacy/index',
    feedback: '/pages/feedback/index',
    about: '/pages/about/index'
  }
  const url = routes[page]
  if (url) {
    uni.navigateTo({ url })
  } else {
    uni.showToast({ title: '功能开发中', icon: 'none' })
  }
}

function handleLogout() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    confirmColor: '#FF6B6B',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'none' })
      }
    }
  })
}

async function onRefresh() {
  isRefreshing.value = true
  await userStore.fetchUserInfo()
  isRefreshing.value = false
}
</script>

<style lang="scss" scoped>
.mine-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F0F2F5;

  &__scroll {
    flex: 1;
  }

  &__header {
    background: linear-gradient(135deg, #1A1A2E 0%, #16213E 40%, #0F3460 100%);
    position: relative;
    overflow: hidden;
    padding-bottom: 24px;
  }

  &__header-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 80%, rgba(78, 205, 196, 0.12), transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(255, 159, 67, 0.1), transparent 50%);
  }

  &__header-top {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 0 16px 8px;
    position: relative;
    z-index: 1;
  }

  &__header-spacer {
    flex: 1;
  }

  &__header-actions {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }

  &__action-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__action-icon {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
  }

  &__user {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 12px 20px 0;
    position: relative;
    z-index: 1;
  }

  &__avatar-wrap {
    position: relative;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
    flex-shrink: 0;
  }

  &__avatar {
    width: 100%;
    height: 100%;
    background: #E5E7EB;
  }

  &__avatar-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &__avatar-wrap:active &__avatar-overlay {
    opacity: 1;
  }

  &__camera-icon {
    font-size: 20px;
  }

  &__user-info {
    flex: 1;
    min-width: 0;
  }

  &__name-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  &__name {
    font-size: 20px;
    font-weight: 800;
    color: #FFFFFF;
  }

  &__edit-icon {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }

  &__level-badge {
    margin-top: 4px;
    display: inline-block;
    background: rgba(78, 205, 196, 0.2);
    border-radius: 10px;
    padding: 3px 10px;
  }

  &__level-text {
    font-size: 11px;
    color: #4ECDC4;
    font-weight: 600;
  }

  &__bio {
    margin-top: 6px;
  }

  &__bio-text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  &__stats {
    display: flex;
    flex-direction: row;
    background: #FFFFFF;
    margin: -12px 16px 12px;
    border-radius: 16px;
    padding: 16px 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 2;
  }

  &__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  &__stat-divider {
    width: 1px;
    background: #EEF0F4;
  }

  &__stat-num {
    font-size: 22px;
    font-weight: 800;
    color: #1F2937;
  }

  &__stat-label {
    font-size: 11px;
    color: #9CA3AF;
    font-weight: 500;
  }

  &__section {
    padding: 0 16px;
    margin-bottom: 12px;
  }

  &__section-title {
    font-size: 13px;
    font-weight: 700;
    color: #6B7A8D;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    display: block;
    padding-left: 4px;
  }

  &__card {
    background: #FFFFFF;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  }

  &__menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;

    &:active {
      background: #F9FAFB;
    }
  }

  &__menu-divider {
    height: 1px;
    background: #F3F4F6;
    margin: 0 16px;
  }

  &__menu-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--blue { background: linear-gradient(135deg, #DBEAFE, #BFDBFE); }
    &--red { background: linear-gradient(135deg, #FEE2E2, #FECACA); }
    &--orange { background: linear-gradient(135deg, #FFEDD5, #FED7AA); }
    &--mint { background: linear-gradient(135deg, #CCFBF1, #99F6E4); }
    &--gray { background: linear-gradient(135deg, #F3F4F6, #E5E7EB); }
    &--purple { background: linear-gradient(135deg, #EDE9FE, #DDD6FE); }
  }

  &__menu-emoji {
    font-size: 18px;
  }

  &__menu-body {
    flex: 1;
    min-width: 0;
  }

  &__menu-title {
    font-size: 15px;
    font-weight: 600;
    color: #1F2937;
    display: block;
  }

  &__menu-desc {
    font-size: 11px;
    color: #9CA3AF;
    display: block;
    margin-top: 2px;
  }

  &__menu-badge {
    background: #FF6B6B;
    border-radius: 10px;
    padding: 2px 8px;

    text {
      font-size: 11px;
      color: #FFFFFF;
      font-weight: 700;
    }
  }

  &__menu-arrow {
    font-size: 22px;
    color: #D1D5DB;
    font-weight: 300;
  }

  &__footer {
    padding: 20px 16px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  &__version {
    font-size: 12px;
    color: #C0C7D0;
  }

  &__logout {
    width: 100%;
    background: #FFFFFF;
    border-radius: 14px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

    &:active {
      background: #FEF2F2;
    }
  }

  &__logout-text {
    font-size: 15px;
    color: #FF6B6B;
    font-weight: 600;
  }

  &__modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fade-in 0.2s ease;
  }

  &__modal {
    width: 100%;
    background: #FFFFFF;
    border-radius: 20px 20px 0 0;
    padding: 24px 20px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    animation: slide-up 0.3s ease;
  }

  &__modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  &__modal-title {
    font-size: 18px;
    font-weight: 800;
    color: #1F2937;
  }

  &__modal-close {
    font-size: 18px;
    color: #9CA3AF;
    padding: 4px;
  }

  &__modal-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__modal-avatar-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__modal-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #E5E7EB;
    border: 3px solid #4ECDC4;
  }

  &__modal-avatar-hint {
    font-size: 12px;
    color: #4ECDC4;
  }

  &__modal-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__modal-label {
    font-size: 13px;
    font-weight: 600;
    color: #6B7A8D;
  }

  &__modal-input {
    background: #F3F4F6;
    border-radius: 10px;
    padding: 12px;
    font-size: 15px;
    color: #1F2937;
    border: 1.5px solid transparent;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #4ECDC4;
      background: #FFFFFF;
    }
  }

  &__modal-footer {
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin-top: 28px;
  }

  &__modal-btn {
    flex: 1;
    padding: 14px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;

    &--cancel {
      background: #F3F4F6;
      color: #6B7A8D;
    }

    &--confirm {
      background: linear-gradient(135deg, #4ECDC4, #2A9D8F);
      color: #FFFFFF;
    }

    &:active {
      opacity: 0.8;
    }
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* #ifdef H5 */
.mine-page {
  background: #F0F2F5;
}

.mine-page__web-container {
  min-height: 100vh;
}

/* 页面标题栏 - 与发现页标题栏风格一致 */
.mine-page__web-header {
  background: #FFFFFF;
  border-bottom: 1px solid #EEF0F4;
}

.mine-page__web-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px 24px 20px;
}

.mine-page__web-header-icon {
  font-size: 28px;
}

.mine-page__web-header-text {
  font-size: 24px;
  font-weight: 800;
  color: #1F2937;
}

/* 主体双栏布局 */
.mine-page__web-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: flex-start;
}

/* 左侧边栏 */
.mine-page__web-sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 80px;
}

.mine-page__web-profile {
  background: #FFFFFF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.mine-page__web-profile-bg {
  height: 72px;
  background: linear-gradient(135deg, #1A1A2E 0%, #16213E 40%, #0F3460 100%);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 80%, rgba(78, 205, 196, 0.15), transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(255, 159, 67, 0.1), transparent 50%);
  }
}

.mine-page__web-profile-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -32px;
  position: relative;
  z-index: 1;
  padding: 0 20px;
}

.mine-page__web-profile-main .mine-page__avatar-wrap {
  width: 64px;
  height: 64px;
  border: 3px solid #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.mine-page__web-profile-main .mine-page__avatar-wrap:hover .mine-page__avatar-overlay {
  opacity: 1;
}

.mine-page__web-profile-info {
  margin-top: 10px;
  text-align: center;
  cursor: pointer;
  padding-bottom: 4px;
}

.mine-page__web-profile-info .mine-page__name-row {
  justify-content: center;
}

.mine-page__web-profile-info .mine-page__name {
  font-size: 18px;
  color: #1F2937;
}

.mine-page__web-profile-info .mine-page__edit-icon {
  color: #9CA3AF;
}

.mine-page__web-profile-info .mine-page__bio-text {
  color: #9CA3AF;
}

.mine-page__web-profile-stats {
  display: flex;
  flex-direction: row;
  padding: 16px 0;
  margin: 12px 20px 0;
  border-top: 1px solid #F3F4F6;
}

.mine-page__web-profile-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
}

.mine-page__web-profile-stat-num {
  font-size: 20px;
  font-weight: 800;
  color: #1F2937;
}

.mine-page__web-profile-stat-label {
  font-size: 11px;
  color: #9CA3AF;
  font-weight: 500;
}

/* 侧边栏操作按钮 */
.mine-page__web-sidebar-actions {
  background: #FFFFFF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.mine-page__web-sidebar-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #F3F4F6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #F9FAFB;
  }
}

.mine-page__web-sidebar-btn-icon {
  font-size: 16px;
}

.mine-page__web-sidebar-btn-text {
  font-size: 14px;
  color: #1F2937;
  font-weight: 500;
}

.mine-page__web-sidebar-btn--logout {
  justify-content: center;

  .mine-page__web-sidebar-btn-text {
    color: #EF4444;
    font-weight: 600;
  }

  &:hover {
    background: #FEF2F2;
  }
}

/* 右侧主内容区 */
.mine-page__web-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mine-page__web-section {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.mine-page__web-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 12px;
  display: block;
}

.mine-page__web-list {
  display: flex;
  flex-direction: column;
}

.mine-page__web-list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 14px 8px;
  border-bottom: 1px solid #F3F4F6;
  cursor: pointer;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #F9FAFB;
    border-radius: 8px;
  }
}

.mine-page__web-list-item:hover .mine-page__menu-arrow {
  color: #4ECDC4;
  transform: translateX(2px);
}

.mine-page__web-list-item .mine-page__menu-arrow {
  transition: all 0.2s;
}

.mine-page__web-footer {
  text-align: center;
  padding: 8px 0;
}

.mine-page__web-footer-version {
  font-size: 12px;
  color: #C0C7D0;
}

/* 弹窗居中 */
.mine-page__modal-overlay {
  align-items: center !important;
}

.mine-page__modal {
  max-width: 440px;
  border-radius: 20px !important;
  animation: scale-in 0.25s ease !important;
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

/* 响应式 */
@media (max-width: 900px) {
  .mine-page__web-body {
    flex-direction: column;
    padding: 16px;
  }

  .mine-page__web-sidebar {
    width: 100%;
    position: static;
  }

  .mine-page__web-profile-main {
    flex-direction: row;
    align-items: flex-end;
    gap: 16px;
    margin-top: -24px;
    padding: 0 20px;
  }

  .mine-page__web-profile-info {
    text-align: left;
    margin-top: 0;
    padding-bottom: 0;
  }

  .mine-page__web-profile-info .mine-page__name-row {
    justify-content: flex-start;
  }

  .mine-page__web-profile-stats {
    margin: 0 20px;
  }

  .mine-page__web-sidebar-actions {
    display: flex;
    flex-direction: row;
  }

  .mine-page__web-sidebar-btn {
    flex: 1;
    justify-content: center;
    border-bottom: none;
    border-right: 1px solid #F3F4F6;

    &:last-child {
      border-right: none;
    }
  }
}
/* #endif */
</style>
