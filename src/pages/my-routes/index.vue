<template>
  <view class="page">
    <!-- #ifdef H5 -->
    <view class="page__web-title">
      <view class="page__web-title-inner">
        <view class="page__web-back" @click="goBack"><text class="page__web-back-icon">‹</text></view>
        <text class="page__web-title-icon">🗺️</text>
        <text class="page__web-title-text">我的路线</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="page__nav">
        <view class="page__back" @click="goBack"><text class="page__back-icon">‹</text></view>
        <text class="page__title">我的路线</text>
        <view class="page__back" style="opacity:0"><text class="page__back-icon">‹</text></view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view class="page__body" scroll-y>
      <view class="page__content">
        <view v-if="loading" class="page__skeleton">
          <view v-for="i in 2" :key="i" class="page__skeleton-card"></view>
        </view>
        <view class="page__grid" v-else-if="routes.length > 0">
          <view class="route-card" v-for="route in routes" :key="route.id" @click="goRouteDetail(route)">
            <view class="route-card__header">
              <view class="route-card__badge">
                <text class="route-card__badge-text">{{ getDayCount(route) }}日</text>
              </view>
              <text class="route-card__name">{{ route.name }}</text>
            </view>
            <view class="route-card__meta">
              <text class="route-card__city">📍 {{ route.city }}</text>
              <text class="route-card__poi-count">{{ getPoiCount(route) }}个景点</text>
            </view>
            <!-- 行程天数展示 -->
            <view class="route-card__days" v-if="route.days && route.days.length > 0">
              <view class="route-card__day" v-for="(day, dIdx) in route.days" :key="dIdx">
                <view class="route-card__day-header">
                  <text class="route-card__day-label">DAY {{ dIdx + 1 }}</text>
                  <text class="route-card__day-title">{{ day.title }}</text>
                </view>
                <view class="route-card__day-pois" v-if="day.pois && day.pois.length">
                  <view class="route-card__day-poi" v-for="(poi, pIdx) in day.pois" :key="pIdx">
                    <text class="route-card__day-poi-dot">{{ pIdx === day.pois.length - 1 ? '◉' : '●' }}</text>
                    <text class="route-card__day-poi-name">{{ poi.name }}</text>
                    <text class="route-card__day-poi-desc" v-if="poi.desc">{{ poi.desc }}</text>
                  </view>
                </view>
              </view>
            </view>
            <!-- 景点列表（无days时fallback） -->
            <view class="route-card__pois" v-else-if="route.pois && route.pois.length > 0">
              <view class="route-card__poi" v-for="(poi, idx) in route.pois.slice(0, 5)" :key="idx">
                <text class="route-card__poi-dot">●</text>
                <text class="route-card__poi-name">{{ typeof poi === 'string' ? poi : poi.name }}</text>
              </view>
              <text class="route-card__poi-more" v-if="route.pois.length > 5">+{{ route.pois.length - 5 }}更多</text>
            </view>
            <view class="route-card__footer">
              <text class="route-card__date">{{ route.createTime || '' }}</text>
              <view class="route-card__delete" @click.stop="deleteRoute(route)">
                <text class="route-card__delete-text">删除</text>
              </view>
            </view>
          </view>
        </view>
        <view class="page__empty" v-else>
          <text class="page__empty-icon">🗺️</text>
          <text class="page__empty-text">暂无路线，去发现页面添加景点到行程吧</text>
          <view class="page__empty-btn" @click="goDiscover">
            <text class="page__empty-btn-text">去发现</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSystemInfo } from '@/utils/safeArea'
import { get, del } from '@/utils/request'

const statusBarHeight = getSystemInfo().statusBarHeight
const routes = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadRoutes()
})

function getDayCount(route) {
  if (route.days && Array.isArray(route.days) && route.days.length > 0) return route.days.length
  if (typeof route.days === 'number') return route.days
  return 1
}

function getPoiCount(route) {
  if (route.pois && Array.isArray(route.pois)) return route.pois.length
  if (route.poiCount) return route.poiCount
  let count = 0
  if (route.days && Array.isArray(route.days)) {
    route.days.forEach(d => { if (d.pois) count += d.pois.length })
  }
  return count || 0
}

async function loadRoutes() {
  loading.value = true
  try {
    routes.value = await get('/user/trips')
  } catch (e) {
    routes.value = []
  } finally {
    loading.value = false
  }
}

async function deleteRoute(route) {
  try {
    await del(`/user/trip/${route.id}`)
    routes.value = routes.value.filter(r => r.id !== route.id)
    uni.showToast({ title: '已删除', icon: 'none' })
  } catch (e) {
    uni.showToast({ title: '删除失败', icon: 'none' })
  }
}

function goRouteDetail(route) {
  uni.navigateTo({ url: `/pages/route-detail/index?id=${route.id}` })
}

function goBack() { uni.navigateBack() }
function goDiscover() { uni.switchTab({ url: '/pages/discover/index' }) }
</script>

<style lang="scss" scoped>
.page {
  width: 100%; height: 100vh; background: #F3F4F6; display: flex; flex-direction: column; overflow-x: hidden;
  &__header { background: #fff; border-bottom: 1px solid #E5E7EB; }
  &__nav { display: flex; justify-content: space-between; align-items: center; padding: 8px; }
  &__back { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
  &__back-icon { font-size: 28px; color: #1F2937; font-weight: 300; }
  &__title { font-size: 17px; font-weight: 700; color: #1F2937; }
  &__body { flex: 1; padding: 12px 16px; box-sizing: border-box; }
  &__grid { display: flex; flex-direction: column; gap: 12px; }
  &__empty { display: flex; flex-direction: column; align-items: center; padding-top: 80px; }
  &__empty-icon { font-size: 48px; }
  &__empty-text { font-size: 14px; color: #9CA3AF; margin-top: 12px; }
  &__empty-btn { margin-top: 20px; background: #4ECDC4; padding: 10px 28px; border-radius: 20px; }
  &__empty-btn-text { font-size: 14px; color: #fff; font-weight: 600; }
  &__skeleton { display: flex; flex-direction: column; gap: 12px; }
  &__skeleton-card { height: 160px; background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }
}
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.route-card {
  background: #fff; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;
  overflow: hidden;

  &__header { display: flex; align-items: center; gap: 8px; }
  &__badge { background: #4ECDC4; padding: 2px 8px; border-radius: 10px; flex-shrink: 0; }
  &__badge-text { font-size: 11px; color: #fff; font-weight: 700; }
  &__name { font-size: 16px; font-weight: 700; color: #1F2937; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  &__meta { display: flex; align-items: center; gap: 12px; }
  &__city { font-size: 12px; color: #6B7A8D; }
  &__poi-count { font-size: 12px; color: #9CA3AF; }

  &__days { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; background: #F9FAFB; border-radius: 8px; }
  &__day { display: flex; flex-direction: column; gap: 4px; }
  &__day-header { display: flex; align-items: center; gap: 8px; }
  &__day-label { font-size: 11px; font-weight: 700; color: #4ECDC4; background: rgba(78,205,196,0.1); padding: 1px 6px; border-radius: 4px; flex-shrink: 0; }
  &__day-title { font-size: 13px; color: #374151; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &__day-pois { display: flex; flex-direction: column; gap: 3px; padding-left: 8px; }
  &__day-poi { display: flex; align-items: center; gap: 6px; }
  &__day-poi-dot { font-size: 6px; color: #4ECDC4; flex-shrink: 0; }
  &__day-poi-name { font-size: 12px; color: #374151; }
  &__day-poi-desc { font-size: 11px; color: #9CA3AF; margin-left: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  &__pois { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; background: #F9FAFB; border-radius: 8px; }
  &__poi { display: flex; align-items: center; gap: 6px; }
  &__poi-dot { font-size: 6px; color: #4ECDC4; }
  &__poi-name { font-size: 13px; color: #374151; }
  &__poi-more { font-size: 12px; color: #9CA3AF; margin-left: 12px; }

  &__footer { display: flex; justify-content: space-between; align-items: center; }
  &__date { font-size: 11px; color: #9CA3AF; }
  &__delete { padding: 4px 12px; border-radius: 12px; background: #FEF2F2; }
  &__delete-text { font-size: 12px; color: #EF4444; }
}

/* #ifdef H5 */
.page__web-title { background: #FFFFFF; border-bottom: 1px solid #EEF0F4; }
.page__web-title-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 8px; padding: 24px 24px 20px; }
.page__web-back { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; cursor: pointer; transition: background 0.2s; margin-right: 4px; &:hover { background: #F3F4F6; } }
.page__web-back-icon { font-size: 24px; color: #1F2937; font-weight: 300; }
.page__web-title-icon { font-size: 28px; }
.page__web-title-text { font-size: 24px; font-weight: 800; color: #1F2937; }
.page__body { padding: 0 !important; }
.page__content { max-width: 1200px; margin: 0 auto; padding: 24px; }
.page__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px; }
.route-card { border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; &:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); } }
.route-card__delete { cursor: pointer; transition: background 0.2s; &:hover { background: #FEE2E2; } }
.route-card__day-title { white-space: normal; }
.route-card__day-poi-desc { max-width: 200px; }
.page__skeleton { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px; }
.page__skeleton-card { height: 180px; }
/* #endif */
</style>
