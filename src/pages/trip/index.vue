<template>
  <view class="trip-page">
    <!-- #ifdef H5 -->
    <view class="trip-page__web-title">
      <view class="trip-page__web-title-inner">
        <text class="trip-page__web-title-icon">🗺️</text>
        <text class="trip-page__web-title-text">我的行程</text>
        <view class="trip-page__web-title-spacer"></view>
        <view class="trip-page__web-add-btn" @click="createTrip">
          <text class="trip-page__web-add-icon">＋</text>
          <text class="trip-page__web-add-text">新建行程</text>
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="trip-page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="trip-page__header-content">
        <text class="trip-page__title">我的行程</text>
        <view class="trip-page__add-btn" @click="createTrip">
          <text class="trip-page__add-icon">＋</text>
          <text class="trip-page__add-text">新建</text>
        </view>
      </view>
      <view class="trip-page__city-tag" v-if="currentCity && filteredTrips.length > 0">
        <text class="trip-page__city-tag-icon">📍</text>
        <text class="trip-page__city-tag-text">{{ currentCity }}</text>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view
      class="trip-page__content"
      scroll-y
      refresher-enabled
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="onRefresh"
    >
      <view v-if="loading" class="trip-page__loading">
        <view v-for="i in 3" :key="i" class="trip-page__skeleton">
          <view class="trip-page__skeleton-cover"></view>
          <view class="trip-page__skeleton-info">
            <view class="trip-page__skeleton-line trip-page__skeleton-line--title"></view>
            <view class="trip-page__skeleton-line"></view>
            <view class="trip-page__skeleton-line trip-page__skeleton-line--short"></view>
          </view>
        </view>
      </view>

      <view v-else-if="filteredTrips.length === 0" class="trip-page__empty">
        <text class="trip-page__empty-icon">🗺️</text>
        <text class="trip-page__empty-text" v-if="currentCity">{{ currentCity }}暂无行程</text>
        <text class="trip-page__empty-text" v-else>还没有行程，快去AI规划吧~</text>
        <view class="trip-page__empty-btn" @click="goToChat">
          <text class="trip-page__empty-btn-text">AI 规划行程</text>
        </view>
      </view>

      <view v-else class="trip-page__list">
        <view
          v-for="trip in filteredTrips"
          :key="trip.id"
          class="trip-page__card-wrapper"
        >
          <view
            class="trip-page__card"
            :style="{ transform: swipeMap[trip.id] ? 'translateX(' + swipeMap[trip.id] + 'px)' : 'translateX(0)' }"
            @touchstart="onTouchStart($event, trip)"
            @touchmove="onTouchMove($event, trip)"
            @touchend="onTouchEnd($event, trip)"
            @click="goTripDetail(trip)"
          >
            <view class="trip-page__card-cover-wrap">
              <image class="trip-page__card-cover" v-if="trip.cover" :src="trip.cover" mode="aspectFill" />
              <view class="trip-page__card-cover trip-page__card-cover--empty" v-else>
                <text class="trip-page__card-cover-icon">🗺️</text>
              </view>
            </view>
            <view class="trip-page__card-info">
              <view class="trip-page__card-top">
                <text class="trip-page__card-name">{{ trip.name }}</text>
                <view class="trip-page__card-status">
                  <text
                    class="trip-page__card-status-text"
                    :class="'trip-page__card-status--' + trip.status"
                  >
                    {{ trip.status === 'completed' ? '已完成' : '计划中' }}
                  </text>
                </view>
              </view>
              <view class="trip-page__card-meta">
                <text class="trip-page__card-days">{{ getDayText(trip) }} · {{ getPoiText(trip) }}景点</text>
                <text class="trip-page__card-date" v-if="trip.createTime">{{ trip.createTime }}</text>
              </view>
            </view>
          </view>
          <view class="trip-page__card-delete" @click="confirmDelete(trip)">
            <text class="trip-page__card-delete-icon">🗑️</text>
            <text class="trip-page__card-delete-text">删除</text>
          </view>
        </view>
      </view>

      <view style="height: 80px;"></view>
    </scroll-view>
    <!-- #ifdef H5 -->
    <WebTopNav />
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <CustomTabBar />
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { getTripList, deleteTrip } from '@/api/user'
import { useAppStore } from '@/store/app'
import { getSystemInfo } from '@/utils/safeArea'
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue'
// #ifdef H5
import WebTopNav from '@/components/WebTopNav/WebTopNav.vue'
// #endif

const appStore = useAppStore()
const { currentCity } = storeToRefs(appStore)
const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const trips = ref([])
const loading = ref(true)
const refresherTriggered = ref(false)
const swipeMap = ref({})
const touchStartX = ref(0)
const touchStartY = ref(0)
const currentSwipeId = ref(null)
const isMoving = ref(false)
const DELETE_WIDTH = 80

const filteredTrips = computed(() => {
  if (!currentCity.value) return trips.value
  return trips.value.filter(t => !t.city || t.city === currentCity.value)
})

onShow(() => {
  loadTrips()
})

watch(currentCity, () => {
  loadTrips()
})

function getDayText(trip) {
  if (typeof trip.days === 'number') return trip.days + '天'
  if (Array.isArray(trip.days) && trip.days.length > 0) return trip.days.length + '天'
  return '1天'
}

function getPoiText(trip) {
  if (trip.poiCount) return trip.poiCount
  if (Array.isArray(trip.pois)) return trip.pois.length
  let count = 0
  if (Array.isArray(trip.days)) trip.days.forEach(d => { if (d.pois) count += d.pois.length })
  return count || 0
}

async function loadTrips() {
  try {
    loading.value = true
    trips.value = await getTripList(currentCity.value)
  } catch (e) {
    console.error('加载行程失败', e)
  } finally {
    loading.value = false
  }
}

async function onRefresh() {
  refresherTriggered.value = true
  await loadTrips()
  refresherTriggered.value = false
}

function onTouchStart(e, trip) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  currentSwipeId.value = trip.id
  isMoving.value = false
}

function onTouchMove(e, trip) {
  if (currentSwipeId.value !== trip.id) return
  const dx = e.touches[0].clientX - touchStartX.value
  const dy = e.touches[0].clientY - touchStartY.value

  if (!isMoving.value && Math.abs(dy) < Math.abs(dx)) {
    isMoving.value = true
  }
  if (!isMoving.value) return

  const offset = Math.min(0, Math.max(-DELETE_WIDTH, dx))
  swipeMap.value = { ...swipeMap.value, [trip.id]: offset }
}

function onTouchEnd(e, trip) {
  if (!isMoving.value) return
  const currentOffset = swipeMap.value[trip.id] || 0
  const threshold = -DELETE_WIDTH * 0.4
  if (currentOffset < threshold) {
    swipeMap.value = { ...swipeMap.value, [trip.id]: -DELETE_WIDTH }
  } else {
    swipeMap.value = { ...swipeMap.value, [trip.id]: 0 }
  }
  currentSwipeId.value = null
  isMoving.value = false
}

function confirmDelete(trip) {
  swipeMap.value = { ...swipeMap.value, [trip.id]: 0 }
  uni.showModal({
    title: '删除行程',
    content: `确定要删除「${trip.name}」吗？`,
    confirmColor: '#EF4444',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteTrip(trip.id)
          trips.value = trips.value.filter(t => t.id !== trip.id)
          uni.showToast({ title: '已删除', icon: 'success' })
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

function createTrip() {
  uni.navigateTo({ url: '/pages/chat/index' })
}

function goToChat() {
  uni.navigateTo({ url: '/pages/chat/index' })
}

function goTripDetail(trip) {
  if (isMoving.value) return
  uni.navigateTo({ url: '/pages/trip-detail/index?id=' + trip.id })
}
</script>

<style lang="scss" scoped>
.trip-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F3F4F6;

  &__header {
    background: #FFFFFF;
    border-bottom: 1px solid #E5E7EB;
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

  &__city-tag {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 0 16px 10px;
  }

  &__city-tag-icon {
    font-size: 12px;
  }

  &__city-tag-text {
    font-size: 12px;
    color: #6B7280;
    font-weight: 500;
  }

  &__content {
    flex: 1;
    padding: 12px 16px;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__skeleton {
    display: flex;
    flex-direction: row;
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
  }

  &__skeleton-cover {
    width: 120px;
    height: 100px;
    background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    flex-shrink: 0;
  }

  &__skeleton-info {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__skeleton-line {
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  &__skeleton-line--title {
    width: 70%;
    height: 16px;
  }

  &__skeleton-line--short {
    width: 40%;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 100px;
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

  &__card-wrapper {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
  }

  &__card {
    display: flex;
    flex-direction: row;
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    z-index: 2;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__card-delete {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 80px;
    background: #EF4444;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    z-index: 1;
  }

  &__card-delete-icon {
    font-size: 20px;
  }

  &__card-delete-text {
    font-size: 11px;
    color: #FFFFFF;
    font-weight: 600;
  }

  &__card-cover-wrap { width: 110px; height: 100px; flex-shrink: 0; }
  &__card-cover { width: 110px; height: 100px; background: #E5E7EB; }
  &__card-cover--empty { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #E0F2F1, #B2DFDB); }
  &__card-cover-icon { font-size: 32px; }

  &__card-info {
    flex: 1;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__card-top {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
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
    justify-content: space-between;
    margin-top: 4px;
  }

  &__card-days {
    font-size: 12px;
    color: #6B7280;
  }

  &__card-date {
    font-size: 11px;
    color: #9CA3AF;
  }

  &__card-status-text {
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
  }

  &__card-status--completed {
    color: #059669;
    background: #ECFDF5;
  }

  &__card-status--planned {
    color: #D97706;
    background: #FEF3C7;
  }
}

/* #ifdef H5 */
.trip-page__web-title {
  background: #FFFFFF;
  border-bottom: 1px solid #EEF0F4;
}

.trip-page__web-title-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px 24px 20px;
}

.trip-page__web-title-icon {
  font-size: 28px;
}

.trip-page__web-title-text {
  font-size: 24px;
  font-weight: 800;
  color: #1F2937;
}

.trip-page__web-title-spacer {
  flex: 1;
}

.trip-page__web-add-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background: #4ECDC4;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3DBDB5;
    box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
  }
}

.trip-page__web-add-icon {
  font-size: 18px;
  color: #FFFFFF;
  font-weight: 700;
}

.trip-page__web-add-text {
  font-size: 14px;
  color: #FFFFFF;
  font-weight: 600;
}

.trip-page__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px !important;
}

.trip-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.trip-page__card-wrapper {
  border-radius: 14px;
}

.trip-page__card {
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

.trip-page__card-cover-wrap { width: 140px; height: 110px; }
.trip-page__card-cover { width: 140px; height: 110px; }

.trip-page__empty {
  padding-top: 120px;
}

.trip-page__loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}
/* #endif */
</style>
