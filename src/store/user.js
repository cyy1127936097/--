import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from '@/utils/auth'
import { getUserInfo as apiGetUserInfo, loginByPhone, loginByWechat, updateUserInfo as apiUpdateUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')
  const userInfo = ref(getUserInfo() || null)

  const isLoggedIn = computed(() => !!token.value)

  async function fetchUserInfo() {
    try {
      const user = await apiGetUserInfo()
      if (user) {
        userInfo.value = user
        setUserInfo(user)
      }
    } catch (e) {
      console.error('获取用户信息失败:', e)
    }
  }

  async function loginByPhoneAction(data) {
    const res = await loginByPhone(data)
    token.value = res.token
    userInfo.value = res.userInfo
    setToken(res.token)
    setUserInfo(res.userInfo)
    return res
  }

  async function loginByWechatAction() {
    const res = await loginByWechat()
    token.value = res.token
    userInfo.value = res.userInfo
    setToken(res.token)
    setUserInfo(res.userInfo)
    return res
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    removeToken()
    removeUserInfo()
  }

  async function updateProfile(data) {
    const updated = await apiUpdateUserInfo(data)
    if (updated) {
      userInfo.value = { ...userInfo.value, ...updated }
      setUserInfo(userInfo.value)
    }
  }

  function updateLocalInfo(data) {
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
    setUserInfo(userInfo.value)
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    fetchUserInfo,
    loginByPhoneAction,
    loginByWechatAction,
    logout,
    updateProfile,
    updateLocalInfo,
    toggleFavorite
  }
})
