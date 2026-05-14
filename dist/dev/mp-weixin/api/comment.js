"use strict";
const mock_comment = require("../mock/comment.js");
function getCommentList(poiId, sortBy = "hot") {
  return Promise.resolve(mock_comment.getCommentsByPoiId(poiId, sortBy));
}
function postComment(data) {
  return Promise.resolve({ id: Date.now(), ...data, likeCount: 0, isLiked: false, createTime: (/* @__PURE__ */ new Date()).toISOString() });
}
exports.getCommentList = getCommentList;
exports.postComment = postComment;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/comment.js.map
