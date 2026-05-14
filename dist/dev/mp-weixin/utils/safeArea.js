"use strict";
const common_vendor = require("../common/vendor.js");
let systemInfo = null;
function getSystemInfo() {
  if (systemInfo) return systemInfo;
  const info = common_vendor.index.getSystemInfoSync();
  systemInfo = {
    statusBarHeight: info.statusBarHeight || 0,
    navBarHeight: 44,
    totalNavHeight: (info.statusBarHeight || 0) + 44,
    windowHeight: info.windowHeight || 0,
    screenHeight: info.screenHeight || 0,
    safeAreaBottom: info.safeArea ? info.safeArea.bottom : info.screenHeight,
    safeAreaInsetBottom: info.screenHeight - (info.safeArea ? info.safeArea.bottom : info.screenHeight),
    platform: info.platform || "unknown",
    isIOS: info.platform === "ios",
    isAndroid: info.platform === "android"
  };
  return systemInfo;
}
function getSafeAreaBottom() {
  return getSystemInfo().safeAreaInsetBottom;
}
exports.getSafeAreaBottom = getSafeAreaBottom;
exports.getSystemInfo = getSystemInfo;
