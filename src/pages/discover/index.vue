<template>
  <view class="discover-page">
    <view class="discover-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="discover-page__header-content">
        <text class="discover-page__title">发现精彩</text>
        <view class="discover-page__header-btns">
          <view class="discover-page__header-btn" @click="showToast('搜索功能开发中')">
            <text class="discover-page__header-icon">🔍</text>
          </view>
          <view class="discover-page__header-btn" @click="showToast('消息中心开发中')">
            <text class="discover-page__header-icon">🔔</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view class="discover-page__tags" scroll-x :show-scrollbar="false">
      <view class="discover-page__tags-inner">
        <view
          v-for="tag in tags"
          :key="tag"
          class="discover-page__tag"
          :class="{ 'discover-page__tag--active': activeTag === tag }"
          @click="selectTag(tag)"
        >
          <text class="discover-page__tag-text" :class="{ 'discover-page__tag-text--active': activeTag === tag }">{{ tag }}</text>
        </view>
      </view>
    </scroll-view>

    <scroll-view
      class="discover-page__content"
      scroll-y
      @scrolltolower="loadMore"
    >
      <view class="discover-page__waterfall">
        <view class="discover-page__col">
          <CommunityCard
            v-for="item in leftList"
            :key="item.id"
            :data="item"
            @click="goCommunityDetail"
          />
        </view>
        <view class="discover-page__col">
          <CommunityCard
            v-for="item in rightList"
            :key="item.id"
            :data="item"
            @click="goCommunityDetail"
          />
        </view>
      </view>
      <view class="discover-page__loading">
        <text class="discover-page__loading-text">{{ loadingText }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCommunityData } from '@/api/community'
import { getSystemInfo } from '@/utils/safeArea'
import CommunityCard from '@/components/CommunityCard/CommunityCard.vue'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const tags = ref([])
const activeTag = ref('推荐')
const communityList = ref([])
const loading = ref(false)

const leftList = computed(() => {
  return communityList.value.filter((_, i) => i % 2 === 0)
})

const rightList = computed(() => {
  return communityList.value.filter((_, i) => i % 2 === 1)
})

const loadingText = computed(() => {
  return loading.value ? '加载中...' : '— 已经到底啦 —'
})

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await getCommunityData(activeTag.value)
    tags.value = res.tags
    communityList.value = res.list
  } catch (e) {
    console.error('加载社区数据失败', e)
  } finally {
    loading.value = false
  }
}

async function selectTag(tag) {
  activeTag.value = tag
  await loadData()
}

function loadMore() {
  if (loading.value) return
}

function goCommunityDetail(item) {
  uni.showToast({ title: '查看详情', icon: 'none' })
}

function showToast(msg) {
  uni.showToast({ title: msg, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.discover-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F3F4F6;

  &__header {
    background: #FFFFFF;
    border-bottom: 1px solid #DDE2E8;
  }

  &__header-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: #1F2937;
  }

  &__header-btns {
    display: flex;
    flex-direction: row;
    gap: 12px;
  }

  &__header-btn {
    padding: 4px;
  }

  &__header-icon {
    font-size: 20px;
  }

  &__tags {
    background: #FFFFFF;
    border-bottom: 1px solid #DDE2E8;
    white-space: nowrap;
  }

  &__tags-inner {
    display: flex;
    flex-direction: row;
    padding: 12px 16px;
    gap: 12px;
  }

  &__tag {
    padding: 6px 16px;
    border-radius: 20px;
    background: #F3F4F6;
    flex-shrink: 0;

    &--active {
      background: #E8F8F7;
    }
  }

  &__tag-text {
    font-size: 13px;
    color: #6B7A8D;
    font-weight: 500;

    &--active {
      color: #4ECDC4;
      font-weight: 700;
    }
  }

  &__content {
    flex: 1;
    padding: 12px 12px 0;
  }

  &__waterfall {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  &__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__loading {
    padding: 20px 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__loading-text {
    font-size: 12px;
    color: #9CA3AF;
  }
}
</style>
