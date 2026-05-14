"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "PoiPopup",
  props: {
    visible: { type: Boolean, default: false },
    data: { type: Object, default: () => ({}) },
    top: { type: Number, default: 150 },
    left: { type: Number, default: 50 }
  },
  emits: ["close", "detail"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function handleClose() {
      emit("close");
    }
    function handleDetail() {
      emit("detail", props.data);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.visible
      }, __props.visible ? {
        b: common_vendor.t(__props.data.name),
        c: common_vendor.o(handleClose),
        d: common_vendor.t(__props.data.rating),
        e: common_vendor.t(__props.data.category),
        f: common_vendor.t(__props.data.description),
        g: common_vendor.o(handleDetail),
        h: __props.top + "px",
        i: __props.left + "px"
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1b1d890a"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/PoiPopup/PoiPopup.js.map
