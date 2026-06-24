<template>
  <view class="home-page">
    <map
      id="homeMap"
      class="home-page__map"
      :latitude="location.latitude"
      :longitude="location.longitude"
      :scale="13"
      :markers="markers"
      :polyline="polylines"
      :show-location="true"
      :enable-traffic="true"
      @markertap="onMarkerTap"
      @regionchange="onRegionChange"
    />

    <view class="home-page__toolbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="home-page__toolbar-content">
        <view class="home-page__city" @click="switchCity">
          <text class="home-page__city-icon">📍</text>
          <view class="home-page__city-text">
            <text class="home-page__city-name">{{ currentCity }}</text>
            <text class="home-page__city-sub" v-if="currentAddress.district">{{ currentAddress.district }}{{ currentAddress.township ? ' · ' + currentAddress.township : '' }}</text>
          </view>
        </view>
        <view class="home-page__toolbar-btns">
          <view class="home-page__tool-btn" @click="locateMe">
            <text class="home-page__tool-icon">◎</text>
          </view>
          <view class="home-page__tool-btn home-page__tool-btn--filter" @click="showFilter">
            <text class="home-page__tool-icon">☰</text>
            <view v-if="hasActiveFilters" class="home-page__filter-dot"></view>
          </view>
        </view>
      </view>
    </view>

    <view
      v-if="filterVisible"
      class="home-page__filter-mask"
      @click="closeFilter"
    ></view>

    <view
      class="home-page__filter-panel"
      :class="{ 'home-page__filter-panel--visible': filterVisible }"
      :style="{ paddingTop: (statusBarHeight + 52) + 'px' }"
    >
      <view class="home-page__filter-header">
        <text class="home-page__filter-title">筛选景点</text>
        <view v-if="hasActiveFilters" class="home-page__filter-clear" @click="clearFilters">
          <text>清除全部</text>
        </view>
      </view>

      <scroll-view class="home-page__filter-body" scroll-y :show-scrollbar="false">
        <!-- 分类筛选 -->
        <view class="home-page__filter-section">
          <text class="home-page__filter-section-title">分类</text>
          <view class="home-page__filter-chips">
            <view
              class="home-page__filter-chip"
              :class="{ 'home-page__filter-chip--active': activeCategories.length === 0 }"
              @click="activeCategories = []"
            >
              <text class="home-page__filter-chip-text" :class="{ 'home-page__filter-chip-text--active': activeCategories.length === 0 }">全部</text>
            </view>
            <view
              v-for="cat in availableCategories"
              :key="cat.key"
              class="home-page__filter-chip"
              :class="{ 'home-page__filter-chip--active': activeCategories.includes(cat.key) }"
              @click="toggleCategory(cat.key)"
            >
              <text class="home-page__filter-chip-emoji">{{ cat.icon }}</text>
              <text class="home-page__filter-chip-text" :class="{ 'home-page__filter-chip-text--active': activeCategories.includes(cat.key) }">{{ cat.label }}</text>
            </view>
          </view>
        </view>

        <!-- 评分筛选 -->
        <view class="home-page__filter-section">
          <text class="home-page__filter-section-title">评分</text>
          <view class="home-page__filter-chips">
            <view
              class="home-page__filter-chip"
              :class="{ 'home-page__filter-chip--active': activeRating === 0 }"
              @click="activeRating = 0"
            >
              <text class="home-page__filter-chip-text" :class="{ 'home-page__filter-chip-text--active': activeRating === 0 }">全部</text>
            </view>
            <view
              v-for="opt in ratingOptions"
              :key="opt.value"
              class="home-page__filter-chip"
              :class="{ 'home-page__filter-chip--active': activeRating === opt.value }"
              @click="activeRating = opt.value"
            >
              <text class="home-page__filter-chip-text" :class="{ 'home-page__filter-chip-text--active': activeRating === opt.value }">{{ opt.label }}</text>
            </view>
          </view>
        </view>

        <!-- 门票筛选 -->
        <view class="home-page__filter-section">
          <text class="home-page__filter-section-title">门票</text>
          <view class="home-page__filter-chips">
            <view
              class="home-page__filter-chip"
              :class="{ 'home-page__filter-chip--active': activeTicket === 'all' }"
              @click="activeTicket = 'all'"
            >
              <text class="home-page__filter-chip-text" :class="{ 'home-page__filter-chip-text--active': activeTicket === 'all' }">全部</text>
            </view>
            <view
              class="home-page__filter-chip"
              :class="{ 'home-page__filter-chip--active': activeTicket === 'free' }"
              @click="activeTicket = 'free'"
            >
              <text class="home-page__filter-chip-emoji">🆓</text>
              <text class="home-page__filter-chip-text" :class="{ 'home-page__filter-chip-text--active': activeTicket === 'free' }">免费</text>
            </view>
            <view
              class="home-page__filter-chip"
              :class="{ 'home-page__filter-chip--active': activeTicket === 'paid' }"
              @click="activeTicket = 'paid'"
            >
              <text class="home-page__filter-chip-emoji">🎫</text>
              <text class="home-page__filter-chip-text" :class="{ 'home-page__filter-chip-text--active': activeTicket === 'paid' }">收费</text>
            </view>
          </view>
        </view>

        <!-- 排序方式 -->
        <view class="home-page__filter-section">
          <text class="home-page__filter-section-title">排序</text>
          <view class="home-page__filter-chips">
            <view
              v-for="opt in sortOptions"
              :key="opt.value"
              class="home-page__filter-chip"
              :class="{ 'home-page__filter-chip--active': activeSort === opt.value }"
              @click="activeSort = opt.value"
            >
              <text class="home-page__filter-chip-emoji">{{ opt.icon }}</text>
              <text class="home-page__filter-chip-text" :class="{ 'home-page__filter-chip-text--active': activeSort === opt.value }">{{ opt.label }}</text>
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="home-page__filter-footer">
        <text class="home-page__filter-count">共 {{ displayList.length }} 个景点</text>
        <view class="home-page__filter-done" @click="closeFilter">
          <text class="home-page__filter-done-text">完成</text>
        </view>
      </view>
    </view>

    <PoiPopup
      :visible="popupVisible"
      :data="popupData"
      :top="popupTop"
      :left="popupLeft"
      @close="popupVisible = false"
      @detail="goPoiDetail"
    />

    <AiChatBox
      v-if="aiBoxExpanded"
      :expanded="true"
      @toggle="toggleAiBox"
      @goChat="goToChat"
    />

    <!-- #ifdef H5 -->
    <WebTopNav />
    <!-- #endif -->

    <AiFloatBall
      v-if="!aiBoxExpanded"
      :initial-top="floatBallTop"
      @click="toggleAiBox"
    />

    <!-- #ifndef H5 -->
    <CustomTabBar />
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { getPoiList } from '@/api/poi'
import { getSystemInfo } from '@/utils/safeArea'
import { getLocation as getDeviceLocation, getCityName, getAddressDetail } from '@/utils/location'
import PoiPopup from '@/components/PoiPopup/PoiPopup.vue'
import AiChatBox from '@/components/AiChatBox/AiChatBox.vue'
import AiFloatBall from '@/components/AiFloatBall/AiFloatBall.vue'
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue'
// #ifdef H5
import WebTopNav from '@/components/WebTopNav/WebTopNav.vue'
// #endif

const appStore = useAppStore()
const { currentCity, currentAddress, currentLocation } = storeToRefs(appStore)
const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight

const location = computed(() => currentLocation.value)

const poiList = ref([])
const aiBoxExpanded = ref(false)
const popupVisible = ref(false)
const popupData = ref({})
const popupTop = ref(150)
const popupLeft = ref(50)
const lastCity = ref('')
const filterVisible = ref(false)
const activeCategories = ref([])
const activeRating = ref(0)
const activeTicket = ref('all')
const activeSort = ref('rating')

const ratingOptions = [
  { value: 4.5, label: '4.5分+' },
  { value: 4.7, label: '4.7分+' },
  { value: 4.8, label: '4.8分+' }
]

const sortOptions = [
  { value: 'rating', label: '评分优先', icon: '⭐' },
  { value: 'popularity', label: '人气优先', icon: '🔥' },
  { value: 'distance', label: '距离优先', icon: '📍' }
]

const floatBallTop = computed(() => sysInfo.windowHeight - 200)

const CATEGORY_CONFIG = {
  '户外': { icon: '🏔️', label: '户外' },
  '美食': { icon: '🍜', label: '美食' },
  '人文': { icon: '🏛️', label: '人文' },
  '历史': { icon: '🏯', label: '历史' },
  '风光': { icon: '🌅', label: '风光' },
  '园林': { icon: '🌿', label: '园林' },
  '宗教': { icon: '🛕', label: '宗教' },
  '自然': { icon: '🌲', label: '自然' },
  '游乐园': { icon: '🎢', label: '游乐园' },
  '演艺': { icon: '🎭', label: '演艺' },
  '亲子': { icon: '👨‍👩‍👧', label: '亲子' },
  '都市': { icon: '🏙️', label: '都市' },
  '民俗': { icon: '🧧', label: '民俗' },
  '骑行': { icon: '🚴', label: '骑行' },
  '校园': { icon: '🎓', label: '校园' },
  '文创': { icon: '🎨', label: '文创' },
  '文艺': { icon: '✨', label: '文艺' },
  '建筑': { icon: '🏗️', label: '建筑' },
  '文化': { icon: '📚', label: '文化' }
}

const availableCategories = computed(() => {
  const catSet = new Set()
  poiList.value.forEach(poi => {
    if (poi.category) {
      const parts = poi.category.split('/')
      parts.forEach(p => { if (p) catSet.add(p) })
    }
  })
  return [...catSet].map(key => ({
    key,
    icon: CATEGORY_CONFIG[key]?.icon || '📍',
    label: CATEGORY_CONFIG[key]?.label || key
  }))
})

const hasActiveFilters = computed(() => {
  return activeCategories.value.length > 0 ||
    activeRating.value > 0 ||
    activeTicket.value !== 'all' ||
    activeSort.value !== 'rating'
})

function isFreeTicket(price) {
  if (!price) return true
  return /免费|free/i.test(String(price))
}

function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const displayList = computed(() => {
  let list = poiList.value.slice()

  // 分类筛选
  if (activeCategories.value.length > 0) {
    list = list.filter(poi => {
      if (!poi.category) return false
      const parts = poi.category.split('/')
      return parts.some(p => activeCategories.value.includes(p))
    })
  }

  // 评分筛选
  if (activeRating.value > 0) {
    list = list.filter(poi => poi.rating >= activeRating.value)
  }

  // 门票筛选
  if (activeTicket.value === 'free') {
    list = list.filter(poi => isFreeTicket(poi.ticketPrice))
  } else if (activeTicket.value === 'paid') {
    list = list.filter(poi => !isFreeTicket(poi.ticketPrice))
  }

  // 排序
  if (activeSort.value === 'rating') {
    list.sort((a, b) => b.rating - a.rating)
  } else if (activeSort.value === 'popularity') {
    list.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
  } else if (activeSort.value === 'distance') {
    const cur = currentLocation.value
    if (cur && cur.latitude && cur.longitude) {
      list.sort((a, b) => {
        const da = calcDistance(cur.latitude, cur.longitude, a.latitude, a.longitude)
        const db = calcDistance(cur.latitude, cur.longitude, b.latitude, b.longitude)
        return da - db
      })
    }
  }

  return list
})

const markers = computed(() => {
  return displayList.value.map((poi) => ({
    id: poi.id,
    latitude: poi.latitude,
    longitude: poi.longitude,
    title: poi.name,
    iconPath: poi.markerColor === '#FF9F43' ? '/static/marker-orange.png' : '/static/marker-mint.png',
    width: 36,
    height: 36,
    callout: {
      content: poi.name,
      color: '#1F2937',
      fontSize: 11,
      borderRadius: 8,
      bgColor: '#FFFFFF',
      padding: 6,
      display: 'ALWAYS'
    }
  }))
})

const polylines = ref([])

onMounted(() => {
  loadPoiList()
  getCurrentLocation()
  lastCity.value = currentCity.value
})

onShow(() => {
  aiBoxExpanded.value = appStore.aiBoxExpanded
  if (lastCity.value !== currentCity.value) {
    lastCity.value = currentCity.value
    loadPoiList()
    moveMapToCity()
  }
})

async function loadPoiList() {
  try {
    const res = await getPoiList({ city: currentCity.value || '' })
    poiList.value = Array.isArray(res) ? res : (res?.list || [])
  } catch (e) {
    console.error('加载景点列表失败', e)
  }
}

function onMarkerTap(e) {
  const markerId = e.detail?.markerId || e.markerId
  const poi = displayList.value.find(p => p.id === markerId)
  if (poi) {
    popupData.value = poi
    popupVisible.value = true
    popupTop.value = 150
    popupLeft.value = 50
  }
}

let regionChangeTimer = null

function onRegionChange(e) {
  if (e.type === 'end' || e.causedBy === 'gesture' || e.detail?.type === 'end') {
    if (regionChangeTimer) clearTimeout(regionChangeTimer)
    regionChangeTimer = setTimeout(() => {
      const mapContext = uni.createMapContext('homeMap')
      mapContext.getCenterLocation({
        success: async (res) => {
          const city = await getCityName(res.latitude, res.longitude)
          if (city) {
            appStore.setCity(city)
            appStore.setLocation({ latitude: res.latitude, longitude: res.longitude })
          }
          const addr = await getAddressDetail(res.latitude, res.longitude)
          if (addr) appStore.setAddress(addr)
        }
      })
    }, 300)
  }
}

function moveMapToCity() {
  const mapContext = uni.createMapContext('homeMap')
  mapContext.moveToLocation({
    latitude: appStore.currentLocation.latitude,
    longitude: appStore.currentLocation.longitude,
    success: () => {},
    fail: () => {}
  })
}

function toggleAiBox() {
  aiBoxExpanded.value = !aiBoxExpanded.value
  appStore.aiBoxExpanded = aiBoxExpanded.value
}

function goToChat() {
  uni.navigateTo({ url: '/pages/chat/index' })
}

function goPoiDetail(poi) {
  popupVisible.value = false
  uni.navigateTo({ url: `/pages/poi-detail/index?id=${poi.id}` })
}

async function getCurrentLocation() {
  try {
    const pos = await getDeviceLocation()
    appStore.setLocation({ latitude: pos.latitude, longitude: pos.longitude })
    const city = await getCityName(pos.latitude, pos.longitude, pos.coordType)
    if (city) {
      appStore.setCity(city)
      moveMapToLocation(pos.latitude, pos.longitude)
    }
    const addr = await getAddressDetail(pos.latitude, pos.longitude, pos.coordType)
    if (addr) appStore.setAddress(addr)
  } catch (e) {
    console.error('获取位置失败，使用默认位置', e)
    const city = await getCityName(currentLocation.value.latitude, currentLocation.value.longitude)
    if (city) appStore.setCity(city)
  }
}

function moveMapToLocation(latitude, longitude) {
  const mapContext = uni.createMapContext('homeMap')
  mapContext.moveToLocation({
    latitude,
    longitude,
    success: () => {},
    fail: () => {}
  })
}

async function locateMe() {
  try {
    const pos = await getDeviceLocation()
    appStore.setLocation({ latitude: pos.latitude, longitude: pos.longitude })
    const city = await getCityName(pos.latitude, pos.longitude, pos.coordType)
    if (city) {
      appStore.setCity(city)
      moveMapToLocation(pos.latitude, pos.longitude)
    }
    const addr = await getAddressDetail(pos.latitude, pos.longitude, pos.coordType)
    if (addr) appStore.setAddress(addr)
    uni.showToast({ title: '定位成功', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: e.message || '定位失败，请检查权限', icon: 'none' })
  }
}
function switchCity() {
  uni.navigateTo({ url: '/pages/city/index' })
}

function showFilter() {
  filterVisible.value = !filterVisible.value
}

function closeFilter() {
  filterVisible.value = false
}

function toggleCategory(catKey) {
  const idx = activeCategories.value.indexOf(catKey)
  if (idx > -1) {
    activeCategories.value.splice(idx, 1)
  } else {
    activeCategories.value.push(catKey)
  }
}

function clearFilters() {
  activeCategories.value = []
  activeRating.value = 0
  activeTicket.value = 'all'
  activeSort.value = 'rating'
}
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100vh;
  position: relative;

  /* #ifdef H5 */
  overflow: visible;
  /* #endif */
  /* #ifndef H5 */
  overflow: hidden;
  /* #endif */

  &__map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__toolbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
  }

  &__toolbar-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
  }

  &__city {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    background: #FFFFFF;
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &__city-icon {
    font-size: 14px;
    flex-shrink: 0;
  }

  &__city-text {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
  }

  &__city-name {
    font-size: 14px;
    font-weight: 700;
    color: #1F2937;
  }

  &__city-sub {
    font-size: 10px;
    color: #9CA3AF;
    margin-top: 1px;
  }

  &__toolbar-btns {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  &__tool-btn {
    width: 40px;
    height: 40px;
    background: #FFFFFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &__tool-icon {
    font-size: 18px;
    color: #6B7A8D;
  }

  &__tool-btn--filter {
    position: relative;
  }

  &__filter-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 8px;
    height: 8px;
    background: #FF6B6B;
    border-radius: 50%;
    border: 2px solid #FFFFFF;
  }

  &__filter-mask {
    position: absolute;
    inset: 0;
    z-index: 25;
    background: rgba(0, 0, 0, 0.3);
  }

  &__filter-panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    background: #FFFFFF;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    padding: 10px 16px 0;
    transform: translateY(-100%);
    opacity: 0;
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease;
    max-height: 70vh;
    display: flex;
    flex-direction: column;

    &--visible {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &__filter-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    flex-shrink: 0;
  }

  &__filter-title {
    font-size: 15px;
    font-weight: 700;
    color: #1F2937;
  }

  &__filter-clear {
    padding: 4px 12px;
    background: #FEF2F2;
    border-radius: 12px;
  }

  &__filter-clear text {
    font-size: 12px;
    color: #EF4444;
    font-weight: 500;
  }

  &__filter-body {
    flex: 1;
    overflow: hidden;
  }

  &__filter-section {
    padding: 12px 0;
    border-bottom: 1px solid #F3F4F6;

    &:last-child {
      border-bottom: none;
    }
  }

  &__filter-section-title {
    font-size: 12px;
    font-weight: 600;
    color: #9CA3AF;
    margin-bottom: 10px;
    display: block;
  }

  &__filter-chips {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__filter-chip {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    padding: 7px 14px;
    border-radius: 18px;
    background: #F3F4F6;
    border: 1.5px solid transparent;
    transition: all 0.2s ease;

    &--active {
      background: #ECFDF5;
      border-color: #4ECDC4;
    }
  }

  &__filter-chip-emoji {
    font-size: 13px;
  }

  &__filter-chip-text {
    font-size: 13px;
    color: #6B7280;
    font-weight: 500;

    &--active {
      color: #0D9488;
      font-weight: 600;
    }
  }

  &__filter-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid #F3F4F6;
    flex-shrink: 0;
  }

  &__filter-count {
    font-size: 13px;
    color: #6B7280;
    font-weight: 500;
  }

  &__filter-done {
    padding: 8px 28px;
    background: #4ECDC4;
    border-radius: 20px;
  }

  &__filter-done-text {
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 600;
  }
}
</style>
