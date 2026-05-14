"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const api_user = require("../../api/user.js");
const utils_safeArea = require("../../utils/safeArea.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const userStore = store_user.useUserStore();
    const phone = common_vendor.ref("");
    const code = common_vendor.ref("");
    const agreed = common_vendor.ref(false);
    const codeCooldown = common_vendor.ref(0);
    async function sendCode() {
      if (codeCooldown.value > 0) return;
      if (!phone.value || phone.value.length !== 11) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: "验证码已发送", icon: "success" });
      codeCooldown.value = 60;
      const timer = setInterval(() => {
        codeCooldown.value--;
        if (codeCooldown.value <= 0) {
          clearInterval(timer);
        }
      }, 1e3);
    }
    async function loginByPhone() {
      if (!agreed.value) {
        common_vendor.index.showToast({ title: "请先同意用户协议", icon: "none" });
        return;
      }
      if (!phone.value || phone.value.length !== 11) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!code.value || code.value.length < 4) {
        common_vendor.index.showToast({ title: "请输入验证码", icon: "none" });
        return;
      }
      try {
        const res = await api_user.loginByPhone({ phone: phone.value });
        userStore.login(res.userInfo);
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/index/index" });
        }, 1e3);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/login/index.vue:126", "登录失败", e);
      }
    }
    async function loginByWechat() {
      if (!agreed.value) {
        common_vendor.index.showToast({ title: "请先同意用户协议", icon: "none" });
        return;
      }
      try {
        const res = await api_user.loginByWechat();
        userStore.login(res.userInfo);
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/index/index" });
        }, 1e3);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/login/index.vue:143", "微信登录失败", e);
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(statusBarHeight) + 60 + "px",
        b: phone.value,
        c: common_vendor.o(($event) => phone.value = $event.detail.value),
        d: code.value,
        e: common_vendor.o(($event) => code.value = $event.detail.value),
        f: common_vendor.t(codeCooldown.value > 0 ? `${codeCooldown.value}s` : "获取验证码"),
        g: codeCooldown.value > 0 ? 1 : "",
        h: common_vendor.o(sendCode),
        i: common_vendor.o(loginByPhone),
        j: common_vendor.o(loginByWechat),
        k: agreed.value
      }, agreed.value ? {} : {}, {
        l: agreed.value ? 1 : "",
        m: common_vendor.o(($event) => agreed.value = !agreed.value)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-45258083"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
