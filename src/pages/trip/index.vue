<template>
  <view class="trip-page">
    <view class="trip-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="trip-page__header-content">
        <text class="trip-page__title">我的行程</text>
        <view class="trip-page__add-btn" @click="createTrip">
          <text class="trip-page__add-icon">＋</text>
          <text class="trip-page__add-text">新建行程</text>
        </view>
      </view>
    </view>

    <scroll-view class="trip-page__content" scroll-y>
      <view v-if="trips.length === 0" class="trip-page__empty">
        <text class="trip-page__empty-icon">🗺️</text>
        <text class="trip-page__empty-text">还没有行程，快去AI规划吧~</text>
        <view class="trip-page__empty-btn" @click="goToChat">
          <text class="trip-page__empty-btn-text">AI 规划行程</text>
        </view>
      </view>

      <view v-else class="trip-page__list">
        <view
          v-for="trip in trips"
          :key="trip.id"
          class="trip-page__card"
          @click="goTripDetail(trip)"
        >
          <image class="trip-page__card-cover" :src="trip.cover" mode="aspectFill" />
          <view class="trip-page__card-info">
            <text class="trip-page__card-name">{{ trip.name }}</text>
            <view class="trip-page__card-meta">
              <text class="trip-page__card-days">{{ trip.days }}天</text>
              <text class="trip-page__card-dot">·</text>
              <text class="trip-page__card-pois">{{ trip.poiCount }}个景点</text>
            </view>
            <view class="trip-page__card-status">
              <text class="trip-page__card-status-text" :class="'trip-page__card-status--' + trip.status">
                {{ trip.status === 'completed' ? '已完成' : '计划中' }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTripList } from '@/api/user'
import { getSystemInfo } from '@/utils/safeArea'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const trips = ref([])

onMounted(() => {
  loadTrips()
})

async function loadTrips() {
  try {
    trips.value = await getTripList()
  } catch (e) {
    console.error('加载行程失败', e)
  }
}

function createTrip() {
  uni.navigateTo({ url: '/pages/chat/index' })
}

function goToChat() {
  uni.navigateTo({ url: '/pages/chat/index' })
}

function goTripDetail(trip) {
  uni.showToast({ title: '行程详情开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.trip-page {
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

  &__add-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    background: #4ECDC4;
    padding: 8px 16px;
    border-radius: 20px;
  }

  &__add-icon {
    font-size: 16px;
    color: #FFFFFF;
  }

  &__add-text {
    font-size: 13px;
    color: #FFFFFF;
    font-weight: 600;
  }

  &__content {
    flex: 1;
    padding: 16px;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120px;
  }

  &__empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  &__empty-text {
    font-size: 14px;
    color: #9CA3AF;
    margin-bottom: 24px;
  }

  &__empty-btn {
    background: #4ECDC4;
    padding: 12px 32px;
    border-radius: 24px;
  }

  &__empty-btn-text {
    font-size: 15px;
    color: #FFFFFF;
    font-weight: 600;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__card {
    display: flex;
    flex-direction: row;
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #DDE2E8;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  &__card-cover {
    width: 120px;
    height: 100px;
    flex-shrink: 0;
    background: #E5E7EB;
  }

  &__card-info {
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__card-name {
    font-size: 15px;
    font-weight: 700;
    color: #1F2937;
  }

  &__card-meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
  }

  &__card-days, &__card-dot, &__card-pois {
    font-size: 12px;
    color: #6B7A8D;
  }

  &__card-status-text {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
  }

  &__card-status--completed {
    color: #4ECDC4;
    background: #E8F8F7;
  }

  &__card-status--planned {
    color: #FF9F43;
    background: #FFF3E6;
  }
}
</style>
