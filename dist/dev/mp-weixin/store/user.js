"use strict";
const common_vendor = require("../common/vendor.js");
const utils_auth = require("../utils/auth.js");
const mock_user = require("../mock/user.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const token = common_vendor.ref(utils_auth.getToken() || "");
  const userInfo = common_vendor.ref(utils_auth.getUserInfo() || null);
  const isLoggedIn = common_vendor.computed(() => !!token.value);
  function login(loginData) {
    token.value = "mock_token_" + Date.now();
    userInfo.value = { ...mock_user.mockUser, ...loginData };
    utils_auth.setToken(token.value);
    utils_auth.setUserInfo(userInfo.value);
  }
  function logout() {
    token.value = "";
    userInfo.value = null;
    utils_auth.removeToken();
    utils_auth.removeUserInfo();
  }
  function updateUserInfo(data) {
    userInfo.value = { ...userInfo.value, ...data };
    utils_auth.setUserInfo(userInfo.value);
  }
  function toggleFavorite(poiId) {
    if (!userInfo.value) return;
    const favorites = userInfo.value.favorites || [];
    const index = favorites.indexOf(poiId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(poiId);
    }
    userInfo.value.favoriteCount = favorites.length;
    updateUserInfo({ favorites });
  }
  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    updateUserInfo,
    toggleFavorite
  };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/user.js.map
