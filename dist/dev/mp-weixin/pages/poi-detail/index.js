"use strict";
const common_vendor = require("../../common/vendor.js");
const api_poi = require("../../api/poi.js");
const api_comment = require("../../api/comment.js");
const utils_safeArea = require("../../utils/safeArea.js");
if (!Math) {
  CommentItem();
}
const CommentItem = () => "../../components/CommentItem/CommentItem.js";
const bannerHeight = 280;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sysInfo = utils_safeArea.getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const safeBottom = utils_safeArea.getSafeAreaBottom();
    const poiId = common_vendor.ref(0);
    const poiData = common_vendor.ref({
      name: "",
      images: [],
      rating: 0,
      commentCount: 0,
      topRank: "",
      openTime: "",
      ticketPrice: "",
      traffic: "",
      aiSummary: "",
      isFavorite: false
    });
    const isFavorite = common_vendor.ref(false);
    const comments = common_vendor.ref([]);
    const commentSort = common_vendor.ref("hot");
    common_vendor.onMounted(() => {
      var _a;
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      poiId.value = parseInt(((_a = page.options) == null ? void 0 : _a.id) || "1");
      loadPoiDetail();
      loadComments();
    });
    common_vendor.watch(commentSort, () => {
      loadComments();
    });
    async function loadPoiDetail() {
      try {
        const data = await api_poi.getPoiDetail(poiId.value);
        if (data) {
          poiData.value = data;
          isFavorite.value = data.isFavorite;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/poi-detail/index.vue:183", "加载景点详情失败", e);
      }
    }
    async function loadComments() {
      try {
        const list = await api_comment.getCommentList(poiId.value, commentSort.value);
        comments.value = list.slice(0, 3);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/poi-detail/index.vue:192", "加载评论失败", e);
      }
    }
    function goBack() {
      common_vendor.index.navigateBack({ delta: 1 });
    }
    function toggleFavorite() {
      isFavorite.value = !isFavorite.value;
      common_vendor.index.showToast({
        title: isFavorite.value ? "已收藏" : "取消收藏",
        icon: "none"
      });
    }
    function handleCommentLike(id) {
      const comment = comments.value.find((c) => c.id === id);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likeCount += comment.isLiked ? 1 : -1;
      }
    }
    function handleCommentReply(data) {
      common_vendor.index.showToast({ title: "回复功能开发中", icon: "none" });
    }
    function goCommentList() {
      common_vendor.index.navigateTo({ url: `/pages/comment/index?poiId=${poiId.value}` });
    }
    function navigateTo() {
      common_vendor.index.openLocation({
        latitude: poiData.value.latitude || 24.4483,
        longitude: poiData.value.longitude || 118.065,
        name: poiData.value.name,
        address: poiData.value.traffic || ""
      });
    }
    function sharePoi() {
      common_vendor.index.showToast({ title: "分享功能开发中", icon: "none" });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(poiData.value.images, (img, idx, i0) => {
          return {
            a: img,
            b: idx
          };
        }),
        b: common_vendor.o(goBack),
        c: common_vendor.t(isFavorite.value ? "♥" : "♡"),
        d: common_vendor.o(toggleFavorite),
        e: common_vendor.unref(statusBarHeight) + "px",
        f: bannerHeight + "px",
        g: common_vendor.t(poiData.value.name),
        h: poiData.value.topRank
      }, poiData.value.topRank ? {
        i: common_vendor.t(poiData.value.topRank)
      } : {}, {
        j: common_vendor.t(poiData.value.rating),
        k: common_vendor.t(poiData.value.commentCount),
        l: common_vendor.t(poiData.value.openTime),
        m: common_vendor.t(poiData.value.ticketPrice),
        n: common_vendor.t(poiData.value.traffic),
        o: common_vendor.t(poiData.value.aiSummary),
        p: common_vendor.t(poiData.value.commentCount),
        q: commentSort.value === "latest" ? 1 : "",
        r: commentSort.value === "latest" ? 1 : "",
        s: common_vendor.o(($event) => commentSort.value = "latest"),
        t: commentSort.value === "hot" ? 1 : "",
        v: commentSort.value === "hot" ? 1 : "",
        w: common_vendor.o(($event) => commentSort.value = "hot"),
        x: common_vendor.f(comments.value, (comment, k0, i0) => {
          return {
            a: comment.id,
            b: common_vendor.o(handleCommentLike, comment.id),
            c: common_vendor.o(handleCommentReply, comment.id),
            d: "4916c438-0-" + i0,
            e: common_vendor.p({
              data: comment
            })
          };
        }),
        y: common_vendor.o(goCommentList),
        z: common_vendor.o(navigateTo),
        A: common_vendor.o(goCommentList),
        B: common_vendor.o(sharePoi),
        C: common_vendor.unref(safeBottom) + "px"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4916c438"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/poi-detail/index.js.map
