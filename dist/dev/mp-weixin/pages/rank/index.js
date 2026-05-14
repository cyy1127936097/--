"use strict";
const common_vendor = require("../../common/vendor.js");
const api_poi = require("../../api/poi.js");
const utils_safeArea = require("../../utils/safeArea.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const tabs = [
      { key: "hot", label: "最热" },
      { key: "rating", label: "评分" },
      { key: "near", label: "最近" }
    ];
    const activeTab = common_vendor.ref("hot");
    const rankList = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      loadRankList();
    });
    common_vendor.watch(activeTab, () => {
      loadRankList();
    });
    async function loadRankList() {
      try {
        rankList.value = await api_poi.getHotPoi(20);
      } catch (e) {
        console.error("加载排行失败", e);
      }
    }
    function loadMore() {
    }
    function goPoiDetail(poi) {
      common_vendor.index.navigateTo({ url: `/pages/poi-detail/index?id=${poi.id}` });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.label),
            b: activeTab.value === tab.key ? 1 : "",
            c: tab.key,
            d: activeTab.value === tab.key ? 1 : "",
            e: common_vendor.o(($event) => activeTab.value = tab.key, tab.key)
          };
        }),
        b: common_vendor.unref(statusBarHeight) + "px",
        c: common_vendor.f(rankList.value, (poi, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(index + 1),
            b: index < 3 ? 1 : "",
            c: index < 3 ? 1 : "",
            d: poi.images[0],
            e: common_vendor.t(poi.name),
            f: poi.topRank
          }, poi.topRank ? {
            g: common_vendor.t(poi.topRank)
          } : {}, {
            h: common_vendor.t(poi.rating),
            i: common_vendor.t(poi.category),
            j: common_vendor.t(poi.description),
            k: poi.id,
            l: common_vendor.o(($event) => goPoiDetail(poi), poi.id)
          });
        }),
        d: common_vendor.o(loadMore)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aa654e54"]]);
wx.createPage(MiniProgramPage);
