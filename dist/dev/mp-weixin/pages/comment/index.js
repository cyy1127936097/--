"use strict";
const common_vendor = require("../../common/vendor.js");
const api_comment = require("../../api/comment.js");
const utils_safeArea = require("../../utils/safeArea.js");
if (!Math) {
  CommentItem();
}
const CommentItem = () => "../../components/CommentItem/CommentItem.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const safeBottom = utils_safeArea.getSafeAreaBottom();
    const poiId = common_vendor.ref(1);
    const sortBy = common_vendor.ref("hot");
    const commentList = common_vendor.ref([]);
    const inputText = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const loadingText = common_vendor.computed(() => loading.value ? "加载中..." : "— 已经到底啦 —");
    common_vendor.onMounted(() => {
      var _a;
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      poiId.value = parseInt(((_a = page.options) == null ? void 0 : _a.poiId) || "1");
      loadComments();
    });
    async function loadComments() {
      loading.value = true;
      try {
        commentList.value = await api_comment.getCommentList(poiId.value, sortBy.value);
      } catch (e) {
        console.error("加载评论失败", e);
      } finally {
        loading.value = false;
      }
    }
    function switchSort(sort) {
      sortBy.value = sort;
      loadComments();
    }
    function loadMore() {
    }
    function handleLike(id) {
      const comment = commentList.value.find((c) => c.id === id);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likeCount += comment.isLiked ? 1 : -1;
      }
    }
    function handleReply(data) {
      inputText.value = `@${data.userName} `;
    }
    async function submitComment() {
      const content = inputText.value.trim();
      if (!content) return;
      try {
        await api_comment.postComment({ poiId: poiId.value, content });
        inputText.value = "";
        common_vendor.index.showToast({ title: "评论成功", icon: "success" });
        loadComments();
      } catch (e) {
        console.error("评论失败", e);
      }
    }
    function goBack() {
      common_vendor.index.navigateBack({ delta: 1 });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.unref(statusBarHeight) + "px",
        c: sortBy.value === "hot" ? 1 : "",
        d: sortBy.value === "hot" ? 1 : "",
        e: common_vendor.o(($event) => switchSort("hot")),
        f: sortBy.value === "latest" ? 1 : "",
        g: sortBy.value === "latest" ? 1 : "",
        h: common_vendor.o(($event) => switchSort("latest")),
        i: common_vendor.f(commentList.value, (comment, k0, i0) => {
          return {
            a: comment.id,
            b: common_vendor.o(handleLike, comment.id),
            c: common_vendor.o(handleReply, comment.id),
            d: "975542cb-0-" + i0,
            e: common_vendor.p({
              data: comment
            })
          };
        }),
        j: common_vendor.t(loadingText.value),
        k: common_vendor.o(loadMore),
        l: inputText.value,
        m: common_vendor.o(($event) => inputText.value = $event.detail.value),
        n: common_vendor.o(submitComment),
        o: common_vendor.unref(safeBottom) + "px"
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-975542cb"]]);
wx.createPage(MiniProgramPage);
