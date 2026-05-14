"use strict";
const common_vendor = require("../common/vendor.js");
const TOKEN_KEY = "zhi_lv_token";
const USER_INFO_KEY = "zhi_lv_user_info";
function getToken() {
  return common_vendor.index.getStorageSync(TOKEN_KEY) || "";
}
function setToken(token) {
  common_vendor.index.setStorageSync(TOKEN_KEY, token);
}
function removeToken() {
  common_vendor.index.removeStorageSync(TOKEN_KEY);
}
function getUserInfo() {
  const info = common_vendor.index.getStorageSync(USER_INFO_KEY);
  return info ? JSON.parse(info) : null;
}
function setUserInfo(info) {
  common_vendor.index.setStorageSync(USER_INFO_KEY, JSON.stringify(info));
}
function removeUserInfo() {
  common_vendor.index.removeStorageSync(USER_INFO_KEY);
}
exports.getToken = getToken;
exports.getUserInfo = getUserInfo;
exports.removeToken = removeToken;
exports.removeUserInfo = removeUserInfo;
exports.setToken = setToken;
exports.setUserInfo = setUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/auth.js.map
