"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
const color = "#6B7A8D";
const selectedColor = "#4ECDC4";
const _sfc_main = {
  __name: "CustomTabBar",
  props: {
    selected: { type: Number, default: 0 }
  },
  setup(__props) {
    const props = __props;
    const safeBottom = common_vendor.computed(() => {
      try {
        const info = common_vendor.index.getSystemInfoSync();
        return info.screenHeight - (info.safeArea ? info.safeArea.bottom : info.screenHeight);
      } catch {
        return 0;
      }
    });
    const selectedIndex = common_vendor.ref(props.selected);
    const tabs = [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        icon: "home",
        selectedIcon: "home-filled"
      },
      {
        pagePath: "/pages/discover/index",
        text: "发现",
        icon: "compass",
        selectedIcon: "compass-filled"
      },
      {
        pagePath: "/pages/trip/index",
        text: "行程",
        icon: "map",
        selectedIcon: "map-filled"
      },
      {
        pagePath: "/pages/rank/index",
        text: "排行",
        icon: "bars",
        selectedIcon: "bars"
      },
      {
        pagePath: "/pages/mine/index",
        text: "我的",
        icon: "person",
        selectedIcon: "person-filled"
      }
    ];
    function switchTab(index) {
      if (selectedIndex.value === index) return;
      selectedIndex.value = index;
      common_vendor.index.switchTab({ url: tabs[index].pagePath });
    }
    common_vendor.onMounted(() => {
      selectedIndex.value = props.selected;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (tab, index, i0) => {
          return {
            a: "f1426587-0-" + i0,
            b: common_vendor.p({
              type: selectedIndex.value === index ? tab.selectedIcon : tab.icon,
              size: 24,
              color: selectedIndex.value === index ? selectedColor : color
            }),
            c: common_vendor.t(tab.text),
            d: selectedIndex.value === index ? selectedColor : color,
            e: tab.pagePath,
            f: selectedIndex.value === index ? 1 : "",
            g: common_vendor.o(($event) => switchTab(index), tab.pagePath)
          };
        }),
        b: safeBottom.value + "px"
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f1426587"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/CustomTabBar/CustomTabBar.js.map
