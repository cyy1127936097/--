"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  StarRating();
}
const StarRating = () => "../StarRating/StarRating.js";
const _sfc_main = {
  __name: "CommentItem",
  props: {
    data: { type: Object, required: true },
    showReply: { type: Boolean, default: true }
  },
  emits: ["like", "reply"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function handleLike() {
      emit("like", props.data.id);
    }
    function handleReply() {
      emit("reply", props.data);
    }
    function previewImage(urls, index) {
      common_vendor.index.previewImage({
        urls,
        current: urls[index]
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.data.avatar || "/static/default-avatar.png",
        b: common_vendor.t(__props.data.userName),
        c: common_vendor.t(__props.data.createTime),
        d: common_vendor.p({
          ["model-value"]: __props.data.rating,
          size: 12,
          gap: 1,
          readonly: true
        }),
        e: common_vendor.t(__props.data.content),
        f: __props.data.images && __props.data.images.length
      }, __props.data.images && __props.data.images.length ? {
        g: common_vendor.f(__props.data.images, (img, idx, i0) => {
          return {
            a: idx,
            b: img,
            c: common_vendor.o(($event) => previewImage(__props.data.images, idx), idx)
          };
        })
      } : {}, {
        h: __props.data.isLiked ? "#FF9F43" : "#9CA3AF",
        i: common_vendor.t(__props.data.likeCount || ""),
        j: common_vendor.o(handleLike),
        k: __props.showReply
      }, __props.showReply ? {
        l: common_vendor.o(handleReply)
      } : {}, {
        m: __props.data.replies && __props.data.replies.length
      }, __props.data.replies && __props.data.replies.length ? {
        n: common_vendor.f(__props.data.replies, (reply, k0, i0) => {
          return {
            a: common_vendor.t(reply.userName),
            b: common_vendor.t(reply.content),
            c: reply.id
          };
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1d6646d6"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/CommentItem/CommentItem.js.map
