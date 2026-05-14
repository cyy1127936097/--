import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from '@/utils/auth'
import { mockUser } from '@/mock/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')
  const userInfo = ref(getUserInfo() || null)

  const isLoggedIn = computed(() => !!token.value)

  function login(loginData) {
    token.value = 'mock_token_' + Date.now()
    userInfo.value = { ...mockUser, ...loginData }
    setToken(token.value)
    setUserInfo(userInfo.value)
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    removeToken()
    removeUserInfo()
  }

  function updateUserInfo(data) {
    userInfo.value = { ...userInfo.value, ...data }
    setUserInfo(userInfo.value)
  }

  function toggleFavorite(poiId) {
    if (!userInfo.value) return
    const favorites = userInfo.value.favorites || []
    const index = favorites.indexOf(poiId)
    if (index > -1) {
      favorites.splice(index, 1)
    } else {
      favorites.push(poiId)
    }
    userInfo.value.favoriteCount = favorites.length
    updateUserInfo({ favorites })
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    updateUserInfo,
    toggleFavorite
  }
})
