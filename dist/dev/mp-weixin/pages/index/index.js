"use strict";
const common_vendor = require("../../common/vendor.js");
const store_app = require("../../store/app.js");
const api_poi = require("../../api/poi.js");
const utils_safeArea = require("../../utils/safeArea.js");
if (!Math) {
  (PoiPopup + AiChatBox + AiFloatBall)();
}
const PoiPopup = () => "../../components/PoiPopup/PoiPopup.js";
const AiChatBox = () => "../../components/AiChatBox/AiChatBox.js";
const AiFloatBall = () => "../../components/AiFloatBall/AiFloatBall.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const appStore = store_app.useAppStore();
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    utils_safeArea.getSafeAreaBottom();
    const currentCity = common_vendor.computed(() => appStore.currentCity);
    const location = common_vendor.computed(() => appStore.currentLocation);
    const poiList = common_vendor.ref([]);
    const aiBoxExpanded = common_vendor.ref(false);
    const popupVisible = common_vendor.ref(false);
    const popupData = common_vendor.ref({});
    const popupTop = common_vendor.ref(150);
    const popupLeft = common_vendor.ref(50);
    const lastCity = common_vendor.ref("");
    const floatBallTop = common_vendor.computed(() => sysInfo.windowHeight - 200);
    const markers = common_vendor.computed(() => {
      return poiList.value.map((poi, index) => ({
        id: poi.id,
        latitude: poi.latitude,
        longitude: poi.longitude,
        title: poi.name,
        iconPath: poi.markerColor === "#FF9F43" ? "/static/marker-orange.png" : "/static/marker-mint.png",
        width: 32,
        height: 32,
        callout: {
          content: poi.name,
          color: "#1F2937",
          fontSize: 10,
          borderRadius: 4,
          bgColor: "#FFFFFF",
          padding: 4,
          display: "ALWAYS"
        }
      }));
    });
    const polylines = common_vendor.computed(() => {
      if (poiList.value.length < 2) return [];
      const points = poiList.value.map((poi) => ({
        latitude: poi.latitude,
        longitude: poi.longitude
      }));
      return [{
        points,
        color: "#4ECDC4",
        width: 4,
        dottedLine: true,
        arrowLine: true
      }];
    });
    common_vendor.onMounted(() => {
      loadPoiList();
      getCurrentLocation();
      lastCity.value = appStore.currentCity;
    });
    common_vendor.onShow(() => {
      aiBoxExpanded.value = appStore.aiBoxExpanded;
      if (lastCity.value !== appStore.currentCity) {
        lastCity.value = appStore.currentCity;
        moveMapToCity();
      }
    });
    async function loadPoiList() {
      try {
        const res = await api_poi.getPoiList();
        poiList.value = res.list;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:141", "加载景点列表失败", e);
      }
    }
    function onMarkerTap(e) {
      const markerId = e.detail.markerId || e.markerId;
      const poi = poiList.value.find((p) => p.id === markerId);
      if (poi) {
        popupData.value = poi;
        popupVisible.value = true;
        popupTop.value = 150;
        popupLeft.value = 50;
      }
    }
    function onRegionChange() {
    }
    function moveMapToCity() {
      const mapContext = common_vendor.index.createMapContext("homeMap");
      mapContext.moveToLocation({
        latitude: appStore.currentLocation.latitude,
        longitude: appStore.currentLocation.longitude,
        success: () => {
        },
        fail: () => {
        }
      });
    }
    function toggleAiBox() {
      aiBoxExpanded.value = !aiBoxExpanded.value;
      appStore.aiBoxExpanded = aiBoxExpanded.value;
    }
    function goToChat() {
      common_vendor.index.navigateTo({ url: "/pages/chat/index" });
    }
    function goPoiDetail(poi) {
      popupVisible.value = false;
      common_vendor.index.navigateTo({ url: `/pages/poi-detail/index?id=${poi.id}` });
    }
    function getCurrentLocation() {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: async (res) => {
          appStore.setLocation({ latitude: res.latitude, longitude: res.longitude });
          await getCityName(res.latitude, res.longitude);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:190", "获取位置失败", err);
        }
      });
    }
    function locateMe() {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: async (res) => {
          appStore.setLocation({ latitude: res.latitude, longitude: res.longitude });
          await getCityName(res.latitude, res.longitude);
          common_vendor.index.showToast({ title: "定位成功", icon: "success" });
        },
        fail: () => {
          common_vendor.index.showToast({ title: "定位失败，请检查权限", icon: "none" });
        }
      });
    }
    async function getCityName(latitude, longitude) {
      try {
        const res = await common_vendor.index.request({
          url: `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=313cf99032e645454c787cb07736e312&extensions=all`,
          method: "GET"
        });
        if (res.data && res.data.status === "1") {
          const city = res.data.regeocode.addressComponent.city || res.data.regeocode.addressComponent.province;
          if (city) {
            appStore.setCity(city.replace("市", ""));
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:222", "获取城市名称失败", e);
      }
    }
    function switchCity() {
      common_vendor.index.navigateTo({ url: "/pages/city/index" });
    }
    function showFilter() {
      common_vendor.index.showToast({ title: "筛选功能开发中", icon: "none" });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: location.value.latitude,
        b: location.value.longitude,
        c: markers.value,
        d: polylines.value,
        e: common_vendor.o(onMarkerTap),
        f: common_vendor.o(onRegionChange),
        g: common_vendor.t(currentCity.value),
        h: common_vendor.o(switchCity),
        i: common_vendor.o(locateMe),
        j: common_vendor.o(showFilter),
        k: common_vendor.unref(statusBarHeight) + "px",
        l: common_vendor.o(($event) => popupVisible.value = false),
        m: common_vendor.o(goPoiDetail),
        n: common_vendor.p({
          visible: popupVisible.value,
          data: popupData.value,
          top: popupTop.value,
          left: popupLeft.value
        }),
        o: aiBoxExpanded.value
      }, aiBoxExpanded.value ? {
        p: common_vendor.o(toggleAiBox),
        q: common_vendor.o(goToChat),
        r: common_vendor.p({
          expanded: true
        })
      } : {}, {
        s: !aiBoxExpanded.value
      }, !aiBoxExpanded.value ? {
        t: common_vendor.o(toggleAiBox),
        v: common_vendor.p({
          ["initial-top"]: floatBallTop.value
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
