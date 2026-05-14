"use strict";
const common_vendor = require("../common/vendor.js");
const utils_safeArea = require("../utils/safeArea.js");
const useAppStore = common_vendor.defineStore("app", () => {
  const systemInfo = common_vendor.ref(utils_safeArea.getSystemInfo());
  const currentCity = common_vendor.ref("厦门市");
  const currentLocation = common_vendor.ref({ latitude: 24.4798, longitude: 118.0894 });
  const aiBoxExpanded = common_vendor.ref(false);
  const activeTab = common_vendor.ref(0);
  function setCity(city) {
    currentCity.value = city;
  }
  function setLocation(location) {
    currentLocation.value = location;
  }
  function toggleAiBox() {
    aiBoxExpanded.value = !aiBoxExpanded.value;
  }
  function setActiveTab(index) {
    activeTab.value = index;
  }
  function refreshSystemInfo() {
    systemInfo.value = utils_safeArea.getSystemInfo();
  }
  return {
    systemInfo,
    currentCity,
    currentLocation,
    aiBoxExpanded,
    activeTab,
    setCity,
    setLocation,
    toggleAiBox,
    setActiveTab,
    refreshSystemInfo
  };
});
exports.useAppStore = useAppStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/app.js.map
