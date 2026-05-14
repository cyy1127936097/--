"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "CommunityCard",
  props: {
    data: { type: Object, required: true }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function handleClick() {
      emit("click", props.data);
    }
    function formatCount(count) {
      if (count >= 1e4) return (count / 1e4).toFixed(1) + "w";
      if (count >= 1e3) return (count / 1e3).toFixed(1) + "k";
      return count;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.data.cover
      }, __props.data.cover ? {
        b: __props.data.cover
      } : {}, {
        c: __props.data.gradient,
        d: __props.data.avatar,
        e: common_vendor.t(__props.data.userName),
        f: common_vendor.t(__props.data.title),
        g: common_vendor.t(formatCount(__props.data.likeCount)),
        h: common_vendor.t(__props.data.commentCount),
        i: common_vendor.o(handleClick)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-92a2cfad"]]);
wx.createComponent(Component);
