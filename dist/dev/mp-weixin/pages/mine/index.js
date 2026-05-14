"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const utils_safeArea = require("../../utils/safeArea.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const userStore = store_user.useUserStore();
    const userInfo = common_vendor.computed(() => userStore.userInfo || { isLoggedIn: false, nickName: "未登录", levelText: "点击登录", routeCount: 0, favoriteCount: 0, preferenceCount: 0 });
    function goSettings() {
      common_vendor.index.showToast({ title: "设置功能开发中", icon: "none" });
    }
    function editProfile() {
      if (!userStore.isLoggedIn) {
        common_vendor.index.navigateTo({ url: "/pages/login/index" });
        return;
      }
      common_vendor.index.showToast({ title: "编辑资料开发中", icon: "none" });
    }
    function goPage(page) {
      if (!userStore.isLoggedIn) {
        common_vendor.index.navigateTo({ url: "/pages/login/index" });
        return;
      }
      common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
    }
    function handleLogout() {
      if (!userStore.isLoggedIn) {
        common_vendor.index.navigateTo({ url: "/pages/login/index" });
        return;
      }
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            userStore.logout();
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goSettings),
        b: userInfo.value.avatar || "/static/default-avatar.png",
        c: common_vendor.o(editProfile),
        d: common_vendor.t(userInfo.value.nickName || "未登录"),
        e: common_vendor.t(userInfo.value.isLoggedIn ? userInfo.value.levelText : "点击登录"),
        f: common_vendor.unref(statusBarHeight) + 16 + "px",
        g: common_vendor.t(userInfo.value.routeCount || 0),
        h: common_vendor.t(userInfo.value.favoriteCount || 0),
        i: common_vendor.t(userInfo.value.preferenceCount || 0),
        j: common_vendor.o(($event) => goPage()),
        k: common_vendor.o(($event) => goPage()),
        l: common_vendor.o(($event) => goPage()),
        m: common_vendor.o(($event) => goPage()),
        n: common_vendor.o(($event) => goPage()),
        o: common_vendor.o(($event) => goPage()),
        p: common_vendor.o(handleLogout)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9023ef44"]]);
wx.createPage(MiniProgramPage);
