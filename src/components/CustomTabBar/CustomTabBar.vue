<template>
  <view class="custom-tabbar">
    <view
      v-for="(tab, index) in tabs"
      :key="tab.pagePath"
      class="custom-tabbar__item"
      :class="[tab.iconClass, { 'custom-tabbar__item--active': currentIndex === index }]"
      @click="switchTab(index)"
    >
      <text
        class="custom-tabbar__label"
        :class="{ 'custom-tabbar__label--active': currentIndex === index }"
      >{{ tab.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const tabs = [
  { pagePath: '/pages/index/index', text: '首页', iconClass: 'custom-tabbar__item--home' },
  { pagePath: '/pages/discover/index', text: '发现', iconClass: 'custom-tabbar__item--discover' },
  { pagePath: '/pages/trip/index', text: '行程', iconClass: 'custom-tabbar__item--trip' },
  { pagePath: '/pages/rank/index', text: '排行', iconClass: 'custom-tabbar__item--rank' },
  { pagePath: '/pages/mine/index', text: '我的', iconClass: 'custom-tabbar__item--mine' }
]

const currentIndex = ref(0)

function getPageIndex() {
  const pages = getCurrentPages()
  const currentRoute = '/' + pages[pages.length - 1].route
  const index = tabs.findIndex(t => t.pagePath === currentRoute)
  return index >= 0 ? index : 0
}

onShow(() => {
  currentIndex.value = getPageIndex()
})

function switchTab(index) {
  if (currentIndex.value === index) return
  currentIndex.value = index
  uni.switchTab({ url: tabs[index].pagePath })
}
</script>

<style lang="scss" scoped>
.custom-tabbar {
  flex-shrink: 0;
  width: 100%;
  height: 54px;
  background: #FFFFFF;
  border-top: 0.5px solid #E5E7EB;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 998;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 8px 0 4px;
    cursor: pointer;

    &:active {
      transform: scale(0.92);
    }

    &::before {
      content: '';
      display: block;
      width: 24px;
      height: 24px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    &--home::before {
      background-image: url(/static/tabbar/home.svg);
    }
    &--home.custom-tabbar__item--active::before {
      background-image: url(/static/tabbar/home-active.svg);
    }

    &--discover::before {
      background-image: url(/static/tabbar/discover.svg);
    }
    &--discover.custom-tabbar__item--active::before {
      background-image: url(/static/tabbar/discover-active.svg);
    }

    &--trip::before {
      background-image: url(/static/tabbar/trip.svg);
    }
    &--trip.custom-tabbar__item--active::before {
      background-image: url(/static/tabbar/trip-active.svg);
    }

    &--rank::before {
      background-image: url(/static/tabbar/rank.svg);
    }
    &--rank.custom-tabbar__item--active::before {
      background-image: url(/static/tabbar/rank-active.svg);
    }

    &--mine::before {
      background-image: url(/static/tabbar/mine.svg);
    }
    &--mine.custom-tabbar__item--active::before {
      background-image: url(/static/tabbar/mine-active.svg);
    }
  }

  &__label {
    font-size: 10px;
    color: #6B7A8D;
    line-height: 1;
    transition: color 0.2s ease;

    &--active {
      color: #4ECDC4;
      font-weight: 600;
    }
  }
}
</style>
