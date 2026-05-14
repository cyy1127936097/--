const TOKEN_KEY = 'zhi_lv_token'
const USER_INFO_KEY = 'zhi_lv_user_info'

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

export function removeToken() {
  uni.removeStorageSync(TOKEN_KEY)
}

export function getUserInfo() {
  const info = uni.getStorageSync(USER_INFO_KEY)
  return info ? JSON.parse(info) : null
}

export function setUserInfo(info) {
  uni.setStorageSync(USER_INFO_KEY, JSON.stringify(info))
}

export function removeUserInfo() {
  uni.removeStorageSync(USER_INFO_KEY)
}

export function isLoggedIn() {
  return !!getToken()
}

export function logout() {
  removeToken()
  removeUserInfo()
  uni.reLaunch({ url: '/pages/login/index' })
}
