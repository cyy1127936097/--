"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const utils_safeArea = require("../../utils/safeArea.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/CustomTabBar/CustomTabBar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const trips = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      loadTrips();
    });
    async function loadTrips() {
      try {
        trips.value = await api_user.getTripList();
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/trip/index.vue:70", "加载行程失败", e);
      }
    }
    function createTrip() {
      common_vendor.index.navigateTo({ url: "/pages/chat/index" });
    }
    function goToChat() {
      common_vendor.index.navigateTo({ url: "/pages/chat/index" });
    }
    function goTripDetail(trip) {
      common_vendor.index.showToast({ title: "行程详情开发中", icon: "none" });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(createTrip),
        b: common_vendor.unref(statusBarHeight) + "px",
        c: trips.value.length === 0
      }, trips.value.length === 0 ? {
        d: common_vendor.o(goToChat)
      } : {
        e: common_vendor.f(trips.value, (trip, k0, i0) => {
          return {
            a: trip.cover,
            b: common_vendor.t(trip.name),
            c: common_vendor.t(trip.days),
            d: common_vendor.t(trip.poiCount),
            e: common_vendor.t(trip.status === "completed" ? "已完成" : "计划中"),
            f: common_vendor.n("trip-page__card-status--" + trip.status),
            g: trip.id,
            h: common_vendor.o(($event) => goTripDetail(), trip.id)
          };
        })
      }, {
        f: common_vendor.p({
          selected: 2
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-684f8290"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/trip/index.js.map
