let systemInfo = null

export function getSystemInfo() {
  if (systemInfo) return systemInfo
  const info = uni.getSystemInfoSync()
  systemInfo = {
    statusBarHeight: info.statusBarHeight || 0,
    navBarHeight: 44,
    totalNavHeight: (info.statusBarHeight || 0) + 44,
    windowHeight: info.windowHeight || 0,
    screenHeight: info.screenHeight || 0,
    safeAreaBottom: info.safeArea ? info.safeArea.bottom : info.screenHeight,
    safeAreaInsetBottom: info.screenHeight - (info.safeArea ? info.safeArea.bottom : info.screenHeight),
    platform: info.platform || 'unknown',
    isIOS: info.platform === 'ios',
    isAndroid: info.platform === 'android'
  }
  return systemInfo
}

export function getStatusBarHeight() {
  return getSystemInfo().statusBarHeight
}

export function getNavBarHeight() {
  return getSystemInfo().totalNavHeight
}

export function getSafeAreaBottom() {
  return getSystemInfo().safeAreaInsetBottom
}

export function getTabBarHeight() {
  return 50 + getSafeAreaBottom()
}
