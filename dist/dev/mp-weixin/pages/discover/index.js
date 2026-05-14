"use strict";
const common_vendor = require("../../common/vendor.js");
const api_community = require("../../api/community.js");
const utils_safeArea = require("../../utils/safeArea.js");
if (!Math) {
  (CommunityCard + CustomTabBar)();
}
const CommunityCard = () => "../../components/CommunityCard/CommunityCard.js";
const CustomTabBar = () => "../../components/CustomTabBar/CustomTabBar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const tags = common_vendor.ref([]);
    const activeTag = common_vendor.ref("推荐");
    const communityList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const leftList = common_vendor.computed(() => {
      return communityList.value.filter((_, i) => i % 2 === 0);
    });
    const rightList = common_vendor.computed(() => {
      return communityList.value.filter((_, i) => i % 2 === 1);
    });
    const loadingText = common_vendor.computed(() => {
      return loading.value ? "加载中..." : "— 已经到底啦 —";
    });
    common_vendor.onMounted(() => {
      loadData();
    });
    async function loadData() {
      loading.value = true;
      try {
        const res = await api_community.getCommunityData(activeTag.value);
        tags.value = res.tags;
        communityList.value = res.list;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/discover/index.vue:101", "加载社区数据失败", e);
      } finally {
        loading.value = false;
      }
    }
    async function selectTag(tag) {
      activeTag.value = tag;
      await loadData();
    }
    function loadMore() {
      if (loading.value) return;
    }
    function goCommunityDetail(item) {
      common_vendor.index.showToast({ title: "查看详情", icon: "none" });
    }
    function showToast(msg) {
      common_vendor.index.showToast({ title: msg, icon: "none" });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => showToast("搜索功能开发中")),
        b: common_vendor.o(($event) => showToast("消息中心开发中")),
        c: common_vendor.unref(statusBarHeight) + "px",
        d: common_vendor.f(tags.value, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag),
            b: activeTag.value === tag ? 1 : "",
            c: tag,
            d: activeTag.value === tag ? 1 : "",
            e: common_vendor.o(($event) => selectTag(tag), tag)
          };
        }),
        e: common_vendor.f(leftList.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(goCommunityDetail, item.id),
            c: "20534a7c-0-" + i0,
            d: common_vendor.p({
              data: item
            })
          };
        }),
        f: common_vendor.f(rightList.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(goCommunityDetail, item.id),
            c: "20534a7c-1-" + i0,
            d: common_vendor.p({
              data: item
            })
          };
        }),
        g: common_vendor.t(loadingText.value),
        h: common_vendor.o(loadMore),
        i: common_vendor.p({
          selected: 1
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-20534a7c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/discover/index.js.map
