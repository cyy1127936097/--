"use strict";
const common_vendor = require("../../common/vendor.js");
const store_chat = require("../../store/chat.js");
const boxWidth = 340;
const tabBarHeight = 50;
const _sfc_main = {
  __name: "AiChatBox",
  props: {
    expanded: { type: Boolean, default: false }
  },
  emits: ["toggle", "goChat"],
  setup(__props, { emit: __emit }) {
    const chatStore = store_chat.useChatStore();
    const emit = __emit;
    const posX = common_vendor.ref(0);
    const posY = common_vendor.ref(0);
    const isDragging = common_vendor.ref(false);
    const isAnimating = common_vendor.ref(false);
    const inputText = common_vendor.ref("");
    const msgScrollTop = common_vendor.ref(0);
    let sysInfoCache = null;
    function getSysInfo() {
      if (!sysInfoCache) {
        sysInfoCache = common_vendor.index.getSystemInfoSync();
      }
      return sysInfoCache;
    }
    function getViewportHeight() {
      if (typeof window !== "undefined" && window.innerHeight) {
        return window.innerHeight;
      }
      const sys = getSysInfo();
      return sys.screenHeight;
    }
    const boxStyle = common_vendor.computed(() => ({
      left: posX.value + "px",
      top: posY.value + "px"
    }));
    common_vendor.onMounted(() => {
      const sysInfo = getSysInfo();
      posX.value = (sysInfo.windowWidth - boxWidth) / 2;
      posY.value = getViewportHeight() - tabBarHeight - 8 - 250;
    });
    common_vendor.onBeforeUnmount(() => {
    });
    common_vendor.watch(() => chatStore.messages.length, () => {
      scrollMsgToBottom();
    });
    common_vendor.watch(() => {
      var _a;
      const last = chatStore.messages[chatStore.messages.length - 1];
      return (_a = last == null ? void 0 : last.content) == null ? void 0 : _a.length;
    }, () => {
      scrollMsgToBottom();
    });
    function scrollMsgToBottom() {
      common_vendor.nextTick$1(() => {
        msgScrollTop.value = msgScrollTop.value + 999;
      });
    }
    function handleSend() {
      const text = inputText.value.trim();
      if (!text || chatStore.isStreaming) return;
      inputText.value = "";
      chatStore.sendMessage(text);
      scrollMsgToBottom();
    }
    function onPointerDown(e) {
      const point = e.touches ? e.touches[0] : e;
      point.clientX;
      point.clientY;
      posX.value;
      posY.value;
      isDragging.value = true;
      isAnimating.value = false;
    }
    function toggleExpand() {
      emit("toggle");
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(chatStore).isStreaming ? "正在思考中..." : "在线"),
        b: common_vendor.o(toggleExpand),
        c: common_vendor.o(onPointerDown),
        d: common_vendor.o(onPointerDown),
        e: __props.expanded
      }, __props.expanded ? {
        f: common_vendor.f(common_vendor.unref(chatStore).messages, (msg, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(msg.content),
            b: msg.role === "user" ? 1 : "",
            c: msg.isStreaming && msg.content
          }, msg.isStreaming && msg.content ? {} : {}, {
            d: msg.isStreaming && !msg.content
          }, msg.isStreaming && !msg.content ? {} : {}, {
            e: msg.role === "assistant" ? 1 : "",
            f: msg.role === "user" ? 1 : "",
            g: msg.id,
            h: msg.role === "user" ? 1 : ""
          });
        }),
        g: msgScrollTop.value,
        h: common_vendor.o(handleSend),
        i: inputText.value,
        j: common_vendor.o(($event) => inputText.value = $event.detail.value),
        k: inputText.value.trim() && !common_vendor.unref(chatStore).isStreaming ? 1 : "",
        l: common_vendor.o(handleSend)
      } : {}, {
        m: __props.expanded ? 1 : "",
        n: isDragging.value ? 1 : "",
        o: isAnimating.value ? 1 : "",
        p: common_vendor.s(boxStyle.value)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d32c522b"]]);
wx.createComponent(Component);
