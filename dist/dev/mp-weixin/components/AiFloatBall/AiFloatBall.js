"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "AiFloatBall",
  props: {
    initialLeft: { type: Number, default: 0 },
    initialTop: { type: Number, default: 0 }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const posX = common_vendor.ref(0);
    const posY = common_vendor.ref(0);
    const isDragging = common_vendor.ref(false);
    const isAnimating = common_vendor.ref(false);
    const showPulse = common_vendor.ref(true);
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let hasMoved = false;
    common_vendor.onMounted(() => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      posX.value = props.initialLeft || sysInfo.windowWidth - 70;
      posY.value = props.initialTop || sysInfo.windowHeight - 200;
    });
    function onTouchStart(e) {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startLeft = posX.value;
      startTop = posY.value;
      isDragging.value = true;
      isAnimating.value = false;
      hasMoved = false;
    }
    function onTouchMove(e) {
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
      }
      if (!hasMoved) return;
      const sysInfo = common_vendor.index.getSystemInfoSync();
      let newLeft = startLeft + dx;
      let newTop = startTop + dy;
      newLeft = Math.max(0, Math.min(newLeft, sysInfo.windowWidth - 56));
      newTop = Math.max(80, Math.min(newTop, sysInfo.windowHeight - 120));
      posX.value = newLeft;
      posY.value = newTop;
    }
    function onTouchEnd() {
      isDragging.value = false;
      if (!hasMoved) return;
      isAnimating.value = true;
      const sysInfo = common_vendor.index.getSystemInfoSync();
      const centerX = sysInfo.windowWidth / 2;
      posX.value = posX.value < centerX ? 14 : sysInfo.windowWidth - 70;
      setTimeout(() => {
        isAnimating.value = false;
      }, 300);
    }
    function handleClick() {
      if (!hasMoved) {
        showPulse.value = false;
        emit("click");
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isDragging.value ? 1 : "",
        b: showPulse.value
      }, showPulse.value ? {} : {}, {
        c: isDragging.value ? 1 : "",
        d: isAnimating.value ? 1 : "",
        e: posX.value + "px",
        f: posY.value + "px",
        g: common_vendor.o(onTouchStart),
        h: common_vendor.o(onTouchMove),
        i: common_vendor.o(onTouchEnd),
        j: common_vendor.o(handleClick)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1c9c5466"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/AiFloatBall/AiFloatBall.js.map
