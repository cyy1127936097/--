<template>
  <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px', backgroundColor: bgColor }">
    <view class="nav-bar__content" :style="{ height: navBarHeight + 'px' }">
      <view class="nav-bar__left" @click="handleBack">
        <slot name="left">
          <view v-if="showBack" class="nav-bar__back">
            <text class="nav-bar__back-icon" :style="{ color: textColor }">&#xe60a;</text>
          </view>
        </slot>
      </view>
      <view class="nav-bar__center">
        <slot name="center">
          <text class="nav-bar__title" :style="{ color: textColor }">{{ title }}</text>
        </slot>
      </view>
      <view class="nav-bar__right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
  <view :style="{ height: (statusBarHeight + navBarHeight) + 'px' }"></view>
</template>

<script setup>
import { getSystemInfo } from '@/utils/safeArea'

const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
  bgColor: { type: String, default: '#FFFFFF' },
  textColor: { type: String, default: '#1F2937' }
})

const emit = defineEmits(['back'])

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const navBarHeight = sysInfo.navBarHeight

function handleBack() {
  emit('back')
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }

  &__left {
    width: 60px;
    display: flex;
    align-items: center;
  }

  &__back {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
  }

  &__back-icon {
    font-size: 18px;
    font-family: inherit;
  }

  &__center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
  }

  &__right {
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
