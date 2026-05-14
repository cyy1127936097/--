<template>
  <view class="custom-tab-bar" :style="{ paddingBottom: safeBottom + 'px' }">
    <view
      v-for="(tab, index) in tabs"
      :key="tab.pagePath"
      class="custom-tab-bar__item"
      :class="{ 'custom-tab-bar__item--active': selectedIndex === index }"
      @click="switchTab(index)"
    >
      <text
        class="uni-icons"
        :class="selectedIndex === index ? tab.selectedIcon : tab.icon"
        :style="{ color: selectedIndex === index ? selectedColor : color, fontSize: '24px' }"
      ></text>
      <text
        class="custom-tab-bar__label"
        :style="{ color: selectedIndex === index ? selectedColor : color }"
      >{{ tab.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  selected: { type: Number, default: 0 }
})

const color = '#6B7A8D'
const selectedColor = '#4ECDC4'

const safeBottom = computed(() => {
  try {
    const info = uni.getSystemInfoSync()
    return info.screenHeight - (info.safeArea ? info.safeArea.bottom : info.screenHeight)
  } catch {
    return 0
  }
})

const selectedIndex = ref(props.selected)

const tabs = [
  {
    pagePath: '/pages/index/index',
    text: '首页',
    icon: 'uniui-home',
    selectedIcon: 'uniui-home-filled'
  },
  {
    pagePath: '/pages/discover/index',
    text: '发现',
    icon: 'uniui-star',
    selectedIcon: 'uniui-star-filled'
  },
  {
    pagePath: '/pages/trip/index',
    text: '行程',
    icon: 'uniui-map',
    selectedIcon: 'uniui-map-filled'
  },
  {
    pagePath: '/pages/rank/index',
    text: '排行',
    icon: 'uniui-bars',
    selectedIcon: 'uniui-bars'
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: 'uniui-person',
    selectedIcon: 'uniui-person-filled'
  }
]

function switchTab(index) {
  if (selectedIndex.value === index) return
  selectedIndex.value = index
  uni.switchTab({ url: tabs[index].pagePath })
}

onMounted(() => {
  selectedIndex.value = props.selected
})
</script>

<style lang="scss">
.uniui-home:before { content: "\e662"; }
.uniui-home-filled:before { content: "\e663"; }
.uniui-star:before { content: "\e688"; }
.uniui-star-filled:before { content: "\e68f"; }
.uniui-map:before { content: "\e667"; }
.uniui-map-filled:before { content: "\e666"; }
.uniui-bars:before { content: "\e627"; }
.uniui-person:before { content: "\e699"; }
.uniui-person-filled:before { content: "\e69d"; }
</style>

<style lang="scss" scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 998;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 50px;
  background: #FFFFFF;
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 50px;
    gap: 2px;

    &--active {
      .custom-tab-bar__label {
        font-weight: 600;
      }
    }
  }

  &__label {
    font-size: 10px;
    line-height: 14px;
  }
}
</style>
