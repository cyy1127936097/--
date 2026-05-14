"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "StarRating",
  props: {
    modelValue: { type: Number, default: 0 },
    size: { type: Number, default: 14 },
    gap: { type: Number, default: 2 },
    activeColor: { type: String, default: "#FF9F43" },
    inactiveColor: { type: String, default: "#DDE2E8" },
    readonly: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const current = common_vendor.ref(props.modelValue);
    common_vendor.watch(() => props.modelValue, (val) => {
      current.value = val;
    });
    function handleClick(index) {
      if (props.readonly) return;
      current.value = index;
      emit("update:modelValue", index);
      emit("change", index);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(5, (i, k0, i0) => {
          return {
            a: i <= current.value ? __props.activeColor : __props.inactiveColor,
            b: i,
            c: common_vendor.o(($event) => handleClick(i), i)
          };
        }),
        b: __props.size + "px",
        c: __props.gap + "px"
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fff419fc"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/StarRating/StarRating.js.map
