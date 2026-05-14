let systemInfo = null

function isH5() {
  // #ifdef H5
  return true
  // #endif
  // #ifndef H5
  return false
  // #endif
}

export function getSystemInfo() {
  if (systemInfo) return systemInfo
  const info = uni.getSystemInfoSync()
  const statusBarHeight = info.statusBarHeight || 0
  const h5StatusBar = isH5() ? 44 : 0
  systemInfo = {
    statusBarHeight: statusBarHeight || h5StatusBar,
    navBarHeight: 44,
    totalNavHeight: (statusBarHeight || h5StatusBar) + 44,
    windowHeight: info.windowHeight || 0,
    screenHeight: info.screenHeight || 0,
    safeAreaBottom: info.safeArea ? info.safeArea.bottom : info.screenHeight,
    safeAreaInsetBottom: info.screenHeight - (info.safeArea ? info.safeArea.bottom : info.screenHeight),
    platform: info.platform || 'unknown',
    isIOS: info.platform === 'ios',
    isAndroid: info.platform === 'android',
    isH5: isH5()
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
