<template>
  <view class="pref-page">
    <view class="pref-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="pref-page__header-content">
        <view class="pref-page__back" @click="goBack">
          <text class="pref-page__back-icon">‹</text>
        </view>
        <text class="pref-page__title">偏好设置</text>
        <view class="pref-page__header-action" @click="handleReset">
          <text class="pref-page__reset-text">重置</text>
        </view>
      </view>
    </view>

    <scroll-view
      class="pref-page__body"
      scroll-y
      :style="{ height: scrollHeight + 'px' }"
    >
      <view v-if="!prefStore.hasPreference" class="pref-page__guide">
        <text class="pref-page__guide-icon">🎛️</text>
        <text class="pref-page__guide-text">选择你的旅行偏好，让 AI 小智更懂你</text>
      </view>

      <view class="pref-page__section">
        <view class="pref-page__section-header">
          <text class="pref-page__section-icon">🎯</text>
          <text class="pref-page__section-title">旅行主题</text>
          <text class="pref-page__section-hint">可多选</text>
        </view>
        <view class="pref-page__tags">
          <view
            v-for="item in themeOptions"
            :key="item.key"
            class="pref-page__tag"
            :class="{ 'pref-page__tag--active': isActive('themes', item.key) }"
            @click="toggleTheme(item.key)"
          >
            <text class="pref-page__tag-icon">{{ item.icon }}</text>
            <text class="pref-page__tag-label">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="pref-page__section">
        <view class="pref-page__section-header">
          <text class="pref-page__section-icon">🧳</text>
          <text class="pref-page__section-title">旅行方式</text>
          <text class="pref-page__section-hint">可多选</text>
        </view>
        <view class="pref-page__tags">
          <view
            v-for="item in travelStyleOptions"
            :key="item.key"
            class="pref-page__tag"
            :class="{ 'pref-page__tag--active': isActive('travelStyle', item.key) }"
            @click="toggleTravelStyle(item.key)"
          >
            <text class="pref-page__tag-icon">{{ item.icon }}</text>
            <text class="pref-page__tag-label">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="pref-page__section">
        <view class="pref-page__section-header">
          <text class="pref-page__section-icon">👥</text>
          <text class="pref-page__section-title">出行人群</text>
          <text class="pref-page__section-hint">可多选</text>
        </view>
        <view class="pref-page__tags">
          <view
            v-for="item in companionOptions"
            :key="item.key"
            class="pref-page__tag"
            :class="{ 'pref-page__tag--active': isActive('companion', item.key) }"
            @click="toggleCompanion(item.key)"
          >
            <text class="pref-page__tag-icon">{{ item.icon }}</text>
            <text class="pref-page__tag-label">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="pref-page__section">
        <view class="pref-page__section-header">
          <text class="pref-page__section-icon">💳</text>
          <text class="pref-page__section-title">预算档位</text>
          <text class="pref-page__section-hint">可多选</text>
        </view>
        <view class="pref-page__tags pref-page__tags--budget">
          <view
            v-for="item in budgetOptions"
            :key="item.key"
            class="pref-page__tag pref-page__tag--budget"
            :class="{ 'pref-page__tag--active': isActive('budget', item.key) }"
            @click="toggleBudget(item.key)"
          >
            <text class="pref-page__tag-icon">{{ item.icon }}</text>
            <view class="pref-page__tag-text">
              <text class="pref-page__tag-label">{{ item.label }}</text>
              <text class="pref-page__tag-desc">{{ item.desc }}元</text>
            </view>
          </view>
        </view>
      </view>

      <view class="pref-page__summary" v-if="prefStore.hasPreference">
        <view class="pref-page__summary-header">
          <text class="pref-page__summary-icon">🧠</text>
          <text class="pref-page__summary-title">AI 小智将根据以下偏好为你推荐</text>
        </view>
        <text class="pref-page__summary-content">{{ prefStore.preferenceSummary }}</text>
      </view>

      <view class="pref-page__bottom-spacer"></view>
    </scroll-view>

    <view class="pref-page__footer" :style="{ paddingBottom: safeBottom + 'px' }">
      <view class="pref-page__save-btn" :class="{ 'pref-page__save-btn--active': prefStore.hasPreference }" @click="handleSave">
        <text class="pref-page__save-text">{{ prefStore.hasPreference ? '保存偏好设置' : '请选择至少一项偏好' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { usePreferenceStore, THEME_OPTIONS, TRAVEL_STYLE_OPTIONS, COMPANION_OPTIONS, BUDGET_OPTIONS } from '@/store/preference'
import { useUserStore } from '@/store/user'
import { getSystemInfo, getSafeAreaBottom } from '@/utils/safeArea'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const safeBottom = getSafeAreaBottom()

const prefStore = usePreferenceStore()
const userStore = useUserStore()

const themeOptions = THEME_OPTIONS
const travelStyleOptions = TRAVEL_STYLE_OPTIONS
const companionOptions = COMPANION_OPTIONS
const budgetOptions = BUDGET_OPTIONS

const scrollHeight = computed(() => {
  const headerH = statusBarHeight + 44
  const footerH = 48 + 24 + safeBottom
  return sysInfo.windowHeight - headerH - footerH
})

function isActive(field, key) {
  return prefStore[field].includes(key)
}

function toggleTheme(key) {
  prefStore.toggleTheme(key)
}

function toggleTravelStyle(key) {
  prefStore.toggleTravelStyle(key)
}

function toggleCompanion(key) {
  prefStore.toggleCompanion(key)
}

function toggleBudget(key) {
  prefStore.toggleBudget(key)
}

function goBack() {
  uni.navigateBack()
}

function handleReset() {
  if (!prefStore.hasPreference) return
  uni.showModal({
    title: '提示',
    content: '确定要重置所有偏好设置吗？',
    success: (res) => {
      if (res.confirm) {
        prefStore.reset()
        uni.showToast({ title: '已重置', icon: 'success' })
      }
    }
  })
}

function handleSave() {
  if (!prefStore.hasPreference) {
    uni.showToast({ title: '请选择至少一项偏好', icon: 'none' })
    return
  }
  prefStore.save()
  userStore.updateLocalInfo({ preferenceCount: prefStore.preferenceCount })
  uni.showToast({ title: '偏好已保存', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack()
  }, 800)
}
</script>

<style lang="scss" scoped>
.pref-page {
  width: 100vw;
  height: 100vh;
  background: #F3F4F6;
  display: flex;
  flex-direction: column;

  &__header {
    background: #FFFFFF;
    border-bottom: 1px solid #DDE2E8;
    flex-shrink: 0;
  }

  &__header-content {
    height: 44px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }

  &__back {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__back-icon {
    font-size: 24px;
    color: #1F2937;
    font-weight: 300;
  }

  &__title {
    font-size: 17px;
    font-weight: 600;
    color: #1F2937;
  }

  &__header-action {
    padding: 4px 8px;
  }

  &__reset-text {
    font-size: 14px;
    color: #6B7A8D;
  }

  &__body {
    flex: 1;
  }

  &__guide {
    margin: 20px 24px 0;
    background: linear-gradient(135deg, #E8F8F7, #FFF7ED);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  &__guide-icon {
    font-size: 28px;
    flex-shrink: 0;
  }

  &__guide-text {
    font-size: 14px;
    color: #2A9D8F;
    font-weight: 500;
    line-height: 20px;
  }

  &__section {
    margin: 20px 24px 0;
    background: #FFFFFF;
    border-radius: 12px;
    border: 1px solid #DDE2E8;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  &__section-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    margin-bottom: 14px;
  }

  &__section-icon {
    font-size: 18px;
  }

  &__section-title {
    font-size: 15px;
    font-weight: 600;
    color: #1F2937;
  }

  &__section-hint {
    font-size: 11px;
    color: #9CA3AF;
    margin-left: auto;
    background: #F3F4F6;
    padding: 2px 8px;
    border-radius: 8px;
  }

  &__tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;

    &--budget {
      flex-wrap: wrap;
    }
  }

  &__tag {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 8px 14px;
    background: #F9FAFB;
    border: 1.5px solid #DDE2E8;
    border-radius: 20px;

    &--active {
      background: #E8F8F7;
      border-color: #4ECDC4;
    }

    &--budget {
      padding: 10px 14px;
      border-radius: 12px;
    }
  }

  &__tag-icon {
    font-size: 16px;
  }

  &__tag-label {
    font-size: 13px;
    font-weight: 500;
    color: #1F2937;
  }

  &__tag--active &__tag-label {
    color: #2A9D8F;
  }

  &__tag-text {
    display: flex;
    flex-direction: column;
  }

  &__tag-desc {
    font-size: 11px;
    color: #9CA3AF;
    margin-top: 1px;
  }

  &__tag--active &__tag-desc {
    color: #4ECDC4;
  }

  &__summary {
    margin: 20px 24px 0;
    background: #FFFFFF;
    border-radius: 12px;
    border: 1px solid #DDE2E8;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  &__summary-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }

  &__summary-icon {
    font-size: 18px;
  }

  &__summary-title {
    font-size: 13px;
    color: #6B7A8D;
    font-weight: 500;
  }

  &__summary-content {
    font-size: 14px;
    color: #2A9D8F;
    font-weight: 600;
    line-height: 22px;
  }

  &__bottom-spacer {
    height: 24px;
  }

  &__footer {
    background: #FFFFFF;
    border-top: 1px solid #DDE2E8;
    padding: 12px 24px;
    flex-shrink: 0;
  }

  &__save-btn {
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #D1D5DB;

    &--active {
      background: linear-gradient(135deg, #4ECDC4, #2A9D8F);
      box-shadow: 0 4px 16px rgba(78, 205, 196, 0.3);
    }
  }

  &__save-text {
    font-size: 16px;
    font-weight: 700;
    color: #FFFFFF;
  }
}
</style>
