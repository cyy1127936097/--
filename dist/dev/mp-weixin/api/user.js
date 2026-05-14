"use strict";
const mock_user = require("../mock/user.js");
function getTripList() {
  return Promise.resolve(mock_user.tripList);
}
function loginByPhone(data) {
  return Promise.resolve({ token: "mock_token_" + Date.now(), userInfo: { ...mock_user.mockUser, phone: data.phone } });
}
function loginByWechat() {
  return Promise.resolve({ token: "mock_token_wx_" + Date.now(), userInfo: mock_user.mockUser });
}
exports.getTripList = getTripList;
exports.loginByPhone = loginByPhone;
exports.loginByWechat = loginByWechat;
