"use strict";
const mock_community = require("../mock/community.js");
function getCommunityData(tag = "") {
  return Promise.resolve({ list: mock_community.getCommunityList(tag), tags: mock_community.tagList });
}
exports.getCommunityData = getCommunityData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/community.js.map
