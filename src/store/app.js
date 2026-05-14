import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSystemInfo } from '@/utils/safeArea'

export const useAppStore = defineStore('app', () => {
  const systemInfo = ref(getSystemInfo())
  const currentCity = ref('厦门市')
  const currentLocation = ref({ latitude: 24.4798, longitude: 118.0894 })
  const aiBoxExpanded = ref(false)
  const activeTab = ref(0)

  function setCity(city) {
    currentCity.value = city
  }

  function setLocation(location) {
    currentLocation.value = location
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
    aiBoxExpanded,
    activeTab,
    setCity,
    setLocation,
    toggleAiBox,
    setActiveTab,
    refreshSystemInfo
  }
})
