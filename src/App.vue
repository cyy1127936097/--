<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
  initApp()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})

function initApp() {
  const sysInfo = uni.getSystemInfoSync()
  uni.setStorageSync('systemInfo', {
    statusBarHeight: sysInfo.statusBarHeight || 0,
    windowHeight: sysInfo.windowHeight || 0,
    screenHeight: sysInfo.screenHeight || 0,
    safeAreaBottom: sysInfo.safeArea ? sysInfo.safeArea.bottom : sysInfo.screenHeight,
    platform: sysInfo.platform || 'unknown'
  })
}
</script>

<style lang="scss">
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
  font-size: 14px;
  color: #1F2937;
  background-color: #F3F4F6;
  -webkit-font-smoothing: antialiased;
}

view, text, image {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* H5端适配 */
/* #ifdef H5 */
uni-page-body {
  height: 100% !important;
}

page {
  height: 100vh;
  height: 100dvh;
  width: 100%;
}

uni-app {
  width: 100%;
  min-height: 100vh;
  background: #F3F4F6;
  padding-top: 56px;
}

uni-page-body, uni-page-wrapper {
  width: 100% !important;
  max-width: 100% !important;
}

uni-tabbar {
  display: none !important;
}
/* #endif */
</style>
