<template>
  <view class="detail-page">
    <view class="detail-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="detail-page__nav">
        <view class="detail-page__back" @click="goBack">
          <text class="detail-page__back-icon">‹</text>
        </view>
        <text class="detail-page__title">行程详情</text>
        <view class="detail-page__back" style="opacity: 0;">
          <text class="detail-page__back-icon">‹</text>
        </view>
      </view>
    </view>

    <scroll-view class="detail-page__content" scroll-y v-if="trip">
      <image class="detail-page__cover" v-if="trip.cover" :src="trip.cover" mode="aspectFill" />
      <view class="detail-page__cover detail-page__cover--empty" v-else>
        <text class="detail-page__cover-icon">🗺️</text>
      </view>

      <view class="detail-page__info">
        <view class="detail-page__name-row">
          <text class="detail-page__name">{{ trip.name }}</text>
          <view class="detail-page__status-wrap">
            <text
              class="detail-page__status"
              :class="'detail-page__status--' + trip.status"
            >
              {{ trip.status === 'completed' ? '已完成' : '计划中' }}
            </text>
          </view>
        </view>

        <view class="detail-page__stats">
          <view class="detail-page__stat">
            <text class="detail-page__stat-value">{{ getDayCount(trip) }}</text>
            <text class="detail-page__stat-label">天数</text>
          </view>
          <view class="detail-page__stat">
            <text class="detail-page__stat-value">{{ trip.poiCount }}</text>
            <text class="detail-page__stat-label">景点</text>
          </view>
          <view class="detail-page__stat">
            <text class="detail-page__stat-value">{{ trip.city || '-' }}</text>
            <text class="detail-page__stat-label">城市</text>
          </view>
        </view>
      </view>

      <view class="detail-page__section" v-if="routeDays.length > 0">
        <text class="detail-page__section-title">📋 每日行程</text>
        <view class="detail-page__days">
          <view
            v-for="(day, di) in routeDays"
            :key="di"
            class="detail-page__day"
          >
            <view class="detail-page__day-header">
              <view class="detail-page__day-badge">
                <text class="detail-page__day-badge-text">Day {{ di + 1 }}</text>
              </view>
              <text class="detail-page__day-label">{{ day.title }}</text>
            </view>
            <view class="detail-page__pois">
              <view v-for="(poi, pi) in day.pois" :key="pi" class="detail-page__poi">
                <view class="detail-page__poi-dot" :style="{ background: routeColor }"></view>
                <view class="detail-page__poi-info">
                  <text class="detail-page__poi-name">{{ poi.name }}</text>
                  <text class="detail-page__poi-desc" v-if="poi.desc">{{ poi.desc }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="detail-page__section" v-else-if="routeError">
        <text class="detail-page__section-title">📋 每日行程</text>
        <view class="detail-page__empty-route">
          <text class="detail-page__empty-route-text">暂无路线数据</text>
        </view>
      </view>

      <view class="detail-page__actions">
        <view class="detail-page__action-btn detail-page__action-btn--danger" @click="confirmDelete">
          <text class="detail-page__action-text">删除此行程</text>
        </view>
      </view>

      <view style="height: 40px;"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getTripDetail, deleteTrip } from '@/api/user'
import { getRouteList } from '@/api/poi'
import { getSystemInfo } from '@/utils/safeArea'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const tripId = ref(null)
const trip = ref(null)
const routeDays = ref([])
const routeColor = ref('#4ECDC4')
const routeError = ref(false)

onLoad((options) => {
  tripId.value = options.id
  loadDetail()
})

function getDayCount(trip) {
  if (typeof trip.days === 'number') return trip.days
  if (Array.isArray(trip.days) && trip.days.length > 0) return trip.days.length
  return 1
}

async function loadDetail() {
  try {
    trip.value = await getTripDetail(tripId.value)
    if (trip.value && trip.value.city) {
      loadRoute(trip.value.city)
    }
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

async function loadRoute(city) {
  try {
    const routes = await getRouteList(city)
    if (routes && routes.length > 0) {
      const route = routes[0]
      routeColor.value = route.color || '#4ECDC4'
      if (route.days) {
        const daysData = typeof route.days === 'string' ? JSON.parse(route.days) : route.days
        routeDays.value = daysData
      }
    } else {
      routeError.value = true
    }
  } catch (e) {
    routeError.value = true
  }
}

function confirmDelete() {
  uni.showModal({
    title: '删除行程',
    content: `确定要删除「${trip.value.name}」吗？`,
    confirmColor: '#EF4444',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteTrip(trip.value.id)
          uni.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => {
            uni.navigateBack()
          }, 800)
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.detail-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F3F4F6;

  &__header {
    background: #FFFFFF;
    border-bottom: 1px solid #E5E7EB;
  }

  &__nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px;
  }

  &__back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__back-icon {
    font-size: 28px;
    color: #1F2937;
    font-weight: 300;
  }

  &__title {
    font-size: 17px;
    font-weight: 700;
    color: #1F2937;
  }

  &__content {
    flex: 1;
  }

  &__cover {
    width: 100%;
    height: 200px;
    background: #E5E7EB;
  }

  &__cover--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #E0F2F1, #B2DFDB);
  }

  &__cover-icon {
    font-size: 64px;
  }

  &__info {
    background: #FFFFFF;
    padding: 16px;
    margin-bottom: 10px;
  }

  &__name-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  &__name {
    font-size: 20px;
    font-weight: 700;
    color: #1F2937;
  }

  &__status-wrap {
    flex-shrink: 0;
  }

  &__status {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 10px;
  }

  &__status--completed {
    color: #059669;
    background: #ECFDF5;
  }

  &__status--planned {
    color: #D97706;
    background: #FEF3C7;
  }

  &__stats {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__stat-value {
    font-size: 16px;
    font-weight: 700;
    color: #1F2937;
  }

  &__stat-label {
    font-size: 11px;
    color: #9CA3AF;
    margin-top: 2px;
  }

  &__section {
    background: #FFFFFF;
    padding: 16px;
    margin-bottom: 10px;
  }

  &__section-title {
    font-size: 15px;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 14px;
  }

  &__days {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__day {
    padding: 12px;
    background: #F9FAFB;
    border-radius: 10px;
    border: 1px solid #E5E7EB;
  }

  &__day-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  &__day-badge {
    background: #4ECDC4;
    padding: 3px 10px;
    border-radius: 10px;
  }

  &__day-badge-text {
    font-size: 11px;
    font-weight: 700;
    color: #FFFFFF;
  }

  &__day-label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  &__pois {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  &__poi {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 8px 0;
    position: relative;
  }

  &__poi-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 5px;
    margin-right: 12px;
    flex-shrink: 0;
    background: #4ECDC4;
  }

  &__poi-name {
    font-size: 14px;
    font-weight: 500;
    color: #1F2937;
  }

  &__poi-desc {
    font-size: 12px;
    color: #9CA3AF;
    margin-top: 2px;
  }

  &__empty-route {
    padding: 30px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__empty-route-text {
    font-size: 13px;
    color: #9CA3AF;
  }

  &__actions {
    padding: 16px;
  }

  &__action-btn {
    padding: 14px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__action-btn--danger {
    background: #FEF2F2;
    border: 1px solid #FECACA;
  }

  &__action-text {
    font-size: 15px;
    font-weight: 600;
    color: #EF4444;
  }
}
</style>
