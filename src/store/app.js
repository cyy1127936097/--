import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSystemInfo } from '@/utils/safeArea'

export const useAppStore = defineStore('app', () => {
  const systemInfo = ref(getSystemInfo())
  const currentCity = ref('')
  const currentLocation = ref({ latitude: 0, longitude: 0 })
  const locationReady = ref(false)
  const aiBoxExpanded = ref(false)
  const activeTab = ref(0)

  function setCity(city) {
    currentCity.value = city
  }

  function setLocation(location) {
    currentLocation.value = location
  }

  function setLocationReady(ready) {
    locationReady.value = ready
  }

  function toggleAiBox() {
    aiBoxExpanded.value = !aiBoxExpanded.value
  }

  function setActiveTab(index) {
    activeTab.value = index
  }

  function refreshSystemInfo() {
    systemInfo.value = getSystemInfo()
  }

  return {
    systemInfo,
    currentCity,
    currentLocation,
    locationReady,
    aiBoxExpanded,
    activeTab,
    setCity,
    setLocation,
    setLocationReady,
    toggleAiBox,
    setActiveTab,
    refreshSystemInfo
  }
})
