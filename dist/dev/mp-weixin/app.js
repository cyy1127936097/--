"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/discover/index.js";
  "./pages/trip/index.js";
  "./pages/rank/index.js";
  "./pages/mine/index.js";
  "./pages/chat/index.js";
  "./pages/poi-detail/index.js";
  "./pages/comment/index.js";
  "./pages/login/index.js";
  "./pages/city/index.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      common_vendor.index.__f__("log", "at App.vue:5", "App Launch");
      initApp();
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:10", "App Show");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:14", "App Hide");
    });
    function initApp() {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      common_vendor.index.setStorageSync("systemInfo", {
        statusBarHeight: sysInfo.statusBarHeight || 0,
        windowHeight: sysInfo.windowHeight || 0,
        screenHeight: sysInfo.screenHeight || 0,
        safeAreaBottom: sysInfo.safeArea ? sysInfo.safeArea.bottom : sysInfo.screenHeight,
        platform: sysInfo.platform || "unknown"
      });
    }
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
