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
}

@media (min-width: 750px) {
  uni-app {
    display: flex;
    justify-content: center;
    background: #E5E7EB;
  }
  uni-page-body {
    max-width: 750px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    position: relative;
  }
}
/* #endif */
</style>
