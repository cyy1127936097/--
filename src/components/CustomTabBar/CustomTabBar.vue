<template>
  <view class="custom-tab-bar" :style="{ paddingBottom: safeBottom + 'px' }">
    <view
      v-for="(tab, index) in tabs"
      :key="tab.pagePath"
      class="custom-tab-bar__item"
      :class="{ 'custom-tab-bar__item--active': selectedIndex === index }"
      @click="switchTab(index)"
    >
      <uni-icons
        :type="selectedIndex === index ? tab.selectedIcon : tab.icon"
        :size="24"
        :color="selectedIndex === index ? selectedColor : color"
      />
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
    icon: 'home',
    selectedIcon: 'home-filled'
  },
  {
    pagePath: '/pages/discover/index',
    text: '发现',
    icon: 'compass',
    selectedIcon: 'compass-filled'
  },
  {
    pagePath: '/pages/trip/index',
    text: '行程',
    icon: 'map',
    selectedIcon: 'map-filled'
  },
  {
    pagePath: '/pages/rank/index',
    text: '排行',
    icon: 'bars',
    selectedIcon: 'bars'
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: 'person',
    selectedIcon: 'person-filled'
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
