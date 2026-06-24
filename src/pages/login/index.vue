<template>
  <view class="login-page">
    <view class="login-page__header" :style="{ paddingTop: (statusBarHeight + 60) + 'px' }">
      <text class="login-page__logo">🗺️</text>
      <text class="login-page__app-name">智旅AI</text>
      <text class="login-page__slogan">AI 驱动的旅行规划助手</text>
    </view>

    <view class="login-page__form">
      <view class="login-page__phone-input">
        <text class="login-page__prefix">+86</text>
        <view class="login-page__divider"></view>
        <input
          class="login-page__input"
          v-model="phone"
          type="number"
          placeholder="请输入手机号"
          placeholder-class="login-page__placeholder"
        />
      </view>

      <view class="login-page__code-input">
        <input
          class="login-page__input"
          v-model="code"
          type="number"
          placeholder="请输入验证码"
          placeholder-class="login-page__placeholder"
        />
        <view class="login-page__code-btn" @click="sendCode">
          <text class="login-page__code-text" :class="{ 'login-page__code-text--disabled': codeCooldown > 0 }">
            {{ codeCooldown > 0 ? `${codeCooldown}s` : '获取验证码' }}
          </text>
        </view>
      </view>

      <view class="login-page__submit" @click="loginByPhone">
        <text class="login-page__submit-text">登 录</text>
      </view>
    </view>

    <view class="login-page__divider-row">
      <view class="login-page__divider-line"></view>
      <text class="login-page__divider-text">其他登录方式</text>
      <view class="login-page__divider-line"></view>
    </view>

    <view class="login-page__social">
      <!-- #ifndef H5 -->
      <view class="login-page__wechat" @click="loginByWechat">
        <text class="login-page__wechat-icon">💬</text>
        <text class="login-page__wechat-text">微信登录</text>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="login-page__wechat" @click="loginByWechat">
        <text class="login-page__wechat-icon">🌐</text>
        <text class="login-page__wechat-text">快捷登录</text>
      </view>
      <!-- #endif -->
    </view>

    <view class="login-page__agreement">
      <view class="login-page__checkbox" @click="agreed = !agreed">
        <view class="login-page__check" :class="{ 'login-page__check--active': agreed }">
          <text v-if="agreed" class="login-page__check-icon">✓</text>
        </view>
      </view>
      <text class="login-page__agreement-text">
        我已阅读并同意
        <text class="login-page__link">《用户协议》</text>
        和
        <text class="login-page__link">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { getSystemInfo } from '@/utils/safeArea'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const agreed = ref(false)
const codeCooldown = ref(0)

async function sendCode() {
  if (codeCooldown.value > 0) return
  if (!phone.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  uni.showToast({ title: '验证码已发送', icon: 'success' })
  codeCooldown.value = 60
  const timer = setInterval(() => {
    codeCooldown.value--
    if (codeCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

async function loginByPhone() {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return
  }
  if (!phone.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  if (!code.value) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }
  try {
    await userStore.loginByPhoneAction({ phone: phone.value, code: code.value })
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (e) {
    uni.showToast({ title: e.message || '登录失败', icon: 'none' })
  }
}

async function loginByWechat() {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' })
    return
  }
  try {
    await userStore.loginByWechatAction()
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (e) {
    console.error('微信登录失败', e)
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  padding: 0 32px;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 48px;
  }

  &__logo {
    font-size: 64px;
    margin-bottom: 12px;
  }

  &__app-name {
    font-size: 28px;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 8px;
  }

  &__slogan {
    font-size: 14px;
    color: #6B7A8D;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
  }

  &__phone-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 52px;
    background: #F9FAFB;
    border-radius: 12px;
    padding: 0 16px;
    border: 1px solid #DDE2E8;
  }

  &__prefix {
    font-size: 15px;
    font-weight: 600;
    color: #1F2937;
  }

  &__divider {
    width: 1px;
    height: 24px;
    background: #DDE2E8;
    margin: 0 12px;
  }

  &__input {
    flex: 1;
    height: 52px;
    font-size: 15px;
    color: #1F2937;
  }

  &__placeholder {
    color: #9CA3AF;
    font-size: 15px;
  }

  &__code-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 52px;
    background: #F9FAFB;
    border-radius: 12px;
    padding: 0 16px;
    border: 1px solid #DDE2E8;
  }

  &__code-btn {
    flex-shrink: 0;
    padding: 8px 0;
  }

  &__code-text {
    font-size: 14px;
    color: #4ECDC4;
    font-weight: 600;

    &--disabled {
      color: #9CA3AF;
    }
  }

  &__submit {
    height: 52px;
    background: linear-gradient(135deg, #4ECDC4, #2A9D8F);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    box-shadow: 0 4px 16px rgba(78, 205, 196, 0.3);
  }

  &__submit-text {
    font-size: 17px;
    font-weight: 700;
    color: #FFFFFF;
  }

  &__divider-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  &__divider-line {
    flex: 1;
    height: 1px;
    background: #DDE2E8;
  }

  &__divider-text {
    font-size: 12px;
    color: #9CA3AF;
  }

  &__social {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  }

  &__wechat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
  }

  &__wechat-icon {
    font-size: 36px;
  }

  &__wechat-text {
    font-size: 12px;
    color: #6B7A8D;
  }

  &__agreement {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
    padding: 0 8px;
  }

  &__checkbox {
    padding-top: 2px;
  }

  &__check {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1.5px solid #DDE2E8;
    display: flex;
    align-items: center;
    justify-content: center;

    &--active {
      background: #4ECDC4;
      border-color: #4ECDC4;
    }
  }

  &__check-icon {
    font-size: 12px;
    color: #FFFFFF;
    font-weight: 700;
  }

  &__agreement-text {
    font-size: 12px;
    color: #9CA3AF;
    line-height: 18px;
  }

  &__link {
    color: #4ECDC4;
  }
}
</style>
