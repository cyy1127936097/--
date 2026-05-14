<template>
  <view class="rank-page">
    <view class="rank-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="rank-page__header-content">
        <text class="rank-page__title">热度排行</text>
        <view class="rank-page__tab-bar">
          <view
            v-for="tab in tabs"
            :key="tab.key"
            class="rank-page__tab"
            :class="{ 'rank-page__tab--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <text class="rank-page__tab-text" :class="{ 'rank-page__tab-text--active': activeTab === tab.key }">{{ tab.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view class="rank-page__content" scroll-y @scrolltolower="loadMore">
      <view class="rank-page__list">
        <view
          v-for="(poi, index) in rankList"
          :key="poi.id"
          class="rank-page__item"
          @click="goPoiDetail(poi)"
        >
          <view class="rank-page__rank" :class="{ 'rank-page__rank--top': index < 3 }">
            <text class="rank-page__rank-num" :class="{ 'rank-page__rank-num--top': index < 3 }">{{ index + 1 }}</text>
          </view>
          <image class="rank-page__img" :src="poi.images[0]" mode="aspectFill" />
          <view class="rank-page__info">
            <view class="rank-page__name-row">
              <text class="rank-page__name">{{ poi.name }}</text>
              <view v-if="poi.topRank" class="rank-page__badge">
                <text class="rank-page__badge-icon">🔥</text>
                <text class="rank-page__badge-text">{{ poi.topRank }}</text>
              </view>
            </view>
            <view class="rank-page__meta">
              <text class="rank-page__star">★</text>
              <text class="rank-page__rating">{{ poi.rating }}</text>
              <text class="rank-page__category">{{ poi.category }}</text>
            </view>
            <text class="rank-page__desc">{{ poi.description }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getHotPoi } from '@/api/poi'
import { getSystemInfo } from '@/utils/safeArea'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const tabs = [
  { key: 'hot', label: '最热' },
  { key: 'rating', label: '评分' },
  { key: 'near', label: '最近' }
]
const activeTab = ref('hot')
const rankList = ref([])

onMounted(() => {
  loadRankList()
})

watch(activeTab, () => {
  loadRankList()
})

async function loadRankList() {
  try {
    rankList.value = await getHotPoi(20)
  } catch (e) {
    console.error('加载排行失败', e)
  }
}

function loadMore() {}

function goPoiDetail(poi) {
  uni.navigateTo({ url: `/pages/poi-detail/index?id=${poi.id}` })
}
</script>

<style lang="scss" scoped>
.rank-page {
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
    padding: 8px 16px;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 12px;
  }

  &__tab-bar {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  &__tab {
    padding: 6px 20px;
    border-radius: 20px;
    background: #F3F4F6;

    &--active {
      background: #E8F8F7;
    }
  }

  &__tab-text {
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
    padding: 16px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__item {
    display: flex;
    flex-direction: row;
    background: #FFFFFF;
    border-radius: 12px;
    padding: 12px;
    gap: 12px;
    border: 1px solid #DDE2E8;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  &__rank {
    width: 28px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 4px;

    &--top {
      padding-top: 0;
    }
  }

  &__rank-num {
    font-size: 18px;
    font-weight: 700;
    color: #9CA3AF;

    &--top {
      font-size: 22px;
      color: #FF9F43;
    }
  }

  &__img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    flex-shrink: 0;
    background: #E5E7EB;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__name-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  &__name {
    font-size: 16px;
    font-weight: 700;
    color: #1F2937;
  }

  &__badge {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;
    background: #FFF3E6;
    padding: 2px 8px;
    border-radius: 6px;
  }

  &__badge-icon {
    font-size: 12px;
  }

  &__badge-text {
    font-size: 11px;
    color: #FF9F43;
    font-weight: 700;
  }

  &__meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
  }

  &__star {
    font-size: 14px;
    color: #FF9F43;
  }

  &__rating {
    font-size: 14px;
    font-weight: 700;
    color: #374151;
  }

  &__category {
    font-size: 12px;
    color: #6B7A8D;
    margin-left: 4px;
  }

  &__desc {
    font-size: 12px;
    color: #9CA3AF;
    margin-top: 4px;
    lines: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
