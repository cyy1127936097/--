import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSystemInfo } from '@/utils/safeArea'

export const useAppStore = defineStore('app', () => {
  const systemInfo = ref(getSystemInfo())
  const currentCity = ref('厦门')
  const currentAddress = ref({ city: '厦门', district: '', township: '' })
  const currentLocation = ref({ latitude: 24.4798, longitude: 118.0894 })
  const aiBoxExpanded = ref(false)
  const activeTab = ref(0)

  function setCity(city) {
    currentCity.value = city
  }

  function setAddress(addr) {
    currentAddress.value = addr
    if (addr.city) currentCity.value = addr.city
  }

  function setLocation(location) {
    currentLocation.value = location
  }

  function setActiveTab(index) {
    activeTab.value = index
  }

  return {
    systemInfo,
    currentCity,
    currentAddress,
    currentLocation,
    aiBoxExpanded,
    activeTab,
    setCity,
    setAddress,
    setLocation,
    setActiveTab
  }
})
