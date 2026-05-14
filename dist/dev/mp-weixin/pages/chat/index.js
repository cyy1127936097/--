"use strict";
const common_vendor = require("../../common/vendor.js");
const store_chat = require("../../store/chat.js");
const utils_safeArea = require("../../utils/safeArea.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const chatStore = store_chat.useChatStore();
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const safeBottom = utils_safeArea.getSafeAreaBottom();
    const inputText = common_vendor.ref("");
    const scrollTop = common_vendor.ref(0);
    common_vendor.watch(() => chatStore.messages.length, () => {
      scrollToBottom();
    });
    common_vendor.watch(() => {
      var _a;
      const last = chatStore.messages[chatStore.messages.length - 1];
      return (_a = last == null ? void 0 : last.content) == null ? void 0 : _a.length;
    }, () => {
      scrollToBottom();
    });
    function scrollToBottom() {
      common_vendor.nextTick$1(() => {
        scrollTop.value = scrollTop.value + 999;
      });
    }
    function sendMessage() {
      const text = inputText.value.trim();
      if (!text || chatStore.isStreaming) return;
      inputText.value = "";
      chatStore.sendMessage(text);
      scrollToBottom();
    }
    function clearChat() {
      common_vendor.index.showModal({
        title: "清空对话",
        content: "确定要清空所有对话记录吗？",
        success: (res) => {
          if (res.confirm) {
            chatStore.clearMessages();
          }
        }
      });
    }
    function goBack() {
      common_vendor.index.navigateBack({ delta: 1 });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.t(common_vendor.unref(chatStore).isStreaming ? "正在思考中..." : "在线"),
        c: common_vendor.o(clearChat),
        d: common_vendor.unref(statusBarHeight) + "px",
        e: common_vendor.f(common_vendor.unref(chatStore).messages, (msg, k0, i0) => {
          return common_vendor.e({
            a: msg.role === "assistant"
          }, msg.role === "assistant" ? {} : {}, {
            b: common_vendor.t(msg.content),
            c: msg.role === "user" ? 1 : "",
            d: msg.isStreaming && msg.content
          }, msg.isStreaming && msg.content ? {} : {}, {
            e: msg.isStreaming && !msg.content
          }, msg.isStreaming && !msg.content ? {} : {}, {
            f: msg.role === "assistant" ? 1 : "",
            g: msg.role === "user" ? 1 : "",
            h: msg.id,
            i: msg.role === "user" ? 1 : ""
          });
        }),
        f: scrollTop.value,
        g: common_vendor.o(sendMessage),
        h: inputText.value,
        i: common_vendor.o(($event) => inputText.value = $event.detail.value),
        j: inputText.value.trim() && !common_vendor.unref(chatStore).isStreaming ? 1 : "",
        k: common_vendor.o(sendMessage),
        l: common_vendor.unref(safeBottom) + "px"
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-da04a0a0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/index.js.map
