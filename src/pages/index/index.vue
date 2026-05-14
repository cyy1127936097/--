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

    <view class="home-page__toolbar" :style="{ paddingTop: toolbarTop + 'px' }">
      <view class="home-page__toolbar-content">
        <view class="home-page__city" @click="switchCity">
          <text class="home-page__city-icon">📍</text>
          <text class="home-page__city-name">{{ displayCity }}</text>
        </view>
        <view class="home-page__toolbar-btns">
          <view class="home-page__tool-btn" @click="locateMe">
            <text class="home-page__tool-icon">⊙</text>
          </view>
          <view class="home-page__tool-btn" @click="showFilter">
            <text class="home-page__tool-icon">⇶</text>
          </view>
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

    <AiFloatBall
      v-if="!aiBoxExpanded"
      :initial-top="floatBallTop"
      @click="toggleAiBox"
    />

    <CustomTabBar :selected="0" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/app'
import { getPoiList } from '@/api/poi'
import { getSystemInfo, getSafeAreaBottom } from '@/utils/safeArea'
import { reverseGeocode, getCurrentLocation } from '@/utils/location'
import PoiPopup from '@/components/PoiPopup/PoiPopup.vue'
import AiChatBox from '@/components/AiChatBox/AiChatBox.vue'
import AiFloatBall from '@/components/AiFloatBall/AiFloatBall.vue'
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue'

const appStore = useAppStore()
const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const safeBottom = getSafeAreaBottom()

const currentCity = computed(() => appStore.currentCity)
const location = computed(() => appStore.currentLocation)
const locationReady = computed(() => appStore.locationReady)

const displayCity = computed(() => {
  if (!locationReady.value) return '定位中...'
  return currentCity.value || '未知'
})

const poiList = ref([])
const aiBoxExpanded = ref(false)
const popupVisible = ref(false)
const popupData = ref({})
const popupTop = ref(150)
const popupLeft = ref(50)
const lastCity = ref('')

const toolbarTop = computed(() => {
  // 状态栏高度 + 额外间距（避免与小程序右上角按钮重合）
  return statusBarHeight + 20
})

const floatBallTop = computed(() => sysInfo.windowHeight - 200)

const markers = computed(() => {
  return poiList.value.map((poi) => ({
    id: poi.id,
    latitude: poi.latitude,
    longitude: poi.longitude,
    title: poi.name,
    iconPath: poi.markerColor === '#FF9F43' ? '/static/marker-orange.png' : '/static/marker-mint.png',
    width: 32,
    height: 32,
    callout: {
      content: poi.name,
      color: '#1F2937',
      fontSize: 10,
      borderRadius: 4,
      bgColor: '#FFFFFF',
      padding: 4,
      display: 'ALWAYS'
    }
  }))
})

const polylines = computed(() => {
  if (poiList.value.length < 2) return []
  const points = poiList.value.map(poi => ({
    latitude: poi.latitude,
    longitude: poi.longitude
  }))
  return [{
    points,
    color: '#4ECDC4',
    width: 4,
    dottedLine: true,
    arrowLine: true
  }]
})

onMounted(() => {
  loadPoiList()
  fetchLocation()
  lastCity.value = appStore.currentCity
})

onShow(() => {
  aiBoxExpanded.value = appStore.aiBoxExpanded
  if (lastCity.value !== appStore.currentCity && appStore.locationReady) {
    lastCity.value = appStore.currentCity
    moveMapToLocation()
  }
})

async function loadPoiList() {
  try {
    const res = await getPoiList()
    poiList.value = res.list
  } catch (e) {
    console.error('加载景点列表失败', e)
  }
}

function onMarkerTap(e) {
  const markerId = e.detail.markerId || e.markerId
  const poi = poiList.value.find(p => p.id === markerId)
  if (poi) {
    popupData.value = poi
    popupVisible.value = true
    popupTop.value = 150
    popupLeft.value = 50
  }
}

function onRegionChange() {}

function moveMapToLocation() {
  const mapContext = uni.createMapContext('homeMap')
  const loc = appStore.currentLocation
  if (loc.latitude && loc.longitude) {
    mapContext.moveToLocation({
      latitude: loc.latitude,
      longitude: loc.longitude,
      success: () => {},
      fail: () => {}
    })
  }
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

function fetchLocation() {
  getCurrentLocation()
    .then((loc) => {
      appStore.setLocation({ latitude: loc.latitude, longitude: loc.longitude })
      moveMapToLocation()
      return reverseGeocode(loc.latitude, loc.longitude)
    })
    .then((city) => {
      if (city) {
        appStore.setCity(city)
      }
      appStore.setLocationReady(true)
    })
    .catch(() => {
      if (!appStore.currentLocation.latitude) {
        fallbackLocation()
      }
      appStore.setLocationReady(true)
    })
}

function locateMe() {
  uni.showLoading({ title: '定位中...' })
  getCurrentLocation()
    .then((loc) => {
      appStore.setLocation({ latitude: loc.latitude, longitude: loc.longitude })
      moveMapToLocation()
      return reverseGeocode(loc.latitude, loc.longitude)
    })
    .then((city) => {
      if (city) {
        appStore.setCity(city)
      }
      appStore.setLocationReady(true)
      uni.hideLoading()
      uni.showToast({ title: '定位成功', icon: 'success' })
    })
    .catch(() => {
      appStore.setLocationReady(true)
      uni.hideLoading()
      uni.showToast({ title: '定位失败，请检查权限', icon: 'none' })
    })
}

function fallbackLocation() {
  appStore.setLocation({ latitude: 24.4798, longitude: 118.0894 })
  appStore.setCity('厦门')
}

function switchCity() {
  uni.navigateTo({ url: '/pages/city/index' })
}

function showFilter() {
  uni.showToast({ title: '筛选功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;

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
  }

  &__city-name {
    font-size: 14px;
    font-weight: 700;
    color: #1F2937;
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

}
</style>
