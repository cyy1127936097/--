<template>
  <view class="page">
    <!-- #ifdef H5 -->
    <view class="page__web-title">
      <view class="page__web-title-inner">
        <view class="page__web-back" @click="goBack"><text class="page__web-back-icon">‹</text></view>
        <text class="page__web-title-icon">📝</text>
        <text class="page__web-title-text">帖子详情</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="page__nav">
        <view class="page__back" @click="goBack"><text class="page__back-icon">‹</text></view>
        <text class="page__title">帖子详情</text>
        <view class="page__back" style="opacity:0"><text class="page__back-icon">‹</text></view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view class="page__body" scroll-y>
      <view class="page__content">
        <!-- 作者信息 -->
        <view class="author">
          <image class="author__avatar" :src="post.avatar" mode="aspectFill" />
          <view class="author__info">
            <text class="author__name">{{ post.userName }}</text>
            <text class="author__time">{{ post.createTime }}</text>
          </view>
          <view class="author__follow" :class="{ 'author__follow--active': post.isFollowed }" @click="toggleFollow">
            <text class="author__follow-text">{{ post.isFollowed ? '已关注' : '+ 关注' }}</text>
          </view>
        </view>

        <!-- 帖子标题 -->
        <text class="post__title">{{ post.title }}</text>

        <!-- 帖子正文 -->
        <text class="post__content">{{ post.content }}</text>

        <!-- 图片列表 -->
        <view class="post__images" v-if="post.images && post.images.length > 0">
          <image
            v-for="(img, idx) in post.images"
            :key="idx"
            class="post__image"
            :src="img"
            mode="widthFix"
            @click="previewImage(idx)"
          />
        </view>

        <!-- 关联景点卡片（增强版：含收藏+加入行程） -->
        <view class="post__poi" v-if="post.poiId">
          <view class="poi-card" @click="goPoiDetail">
            <image class="poi-card__cover" v-if="poiInfo.images && poiInfo.images.length > 0" :src="poiInfo.images[0]" mode="aspectFill" />
            <view class="poi-card__cover poi-card__cover--empty" v-else>
              <text class="poi-card__cover-icon">📍</text>
            </view>
            <view class="poi-card__info">
              <text class="poi-card__name">{{ post.poiName }}</text>
              <view class="poi-card__meta">
                <text class="poi-card__star">★ {{ poiInfo.rating || '-' }}</text>
                <text class="poi-card__city">{{ post.poiCity }}</text>
                <text class="poi-card__price" v-if="poiInfo.ticketPrice">{{ poiInfo.ticketPrice }}</text>
              </view>
            </view>
            <text class="poi-card__arrow">›</text>
          </view>
          <view class="poi-actions">
            <view class="poi-actions__btn" :class="{ 'poi-actions__btn--active': poiInfo.isFavorite }" @click="togglePoiFavorite">
              <text class="poi-actions__btn-icon">{{ poiInfo.isFavorite ? '♥' : '♡' }}</text>
              <text class="poi-actions__btn-text">{{ poiInfo.isFavorite ? '已收藏' : '收藏景点' }}</text>
            </view>
            <view class="poi-actions__btn poi-actions__btn--route" @click="addToTrip">
              <text class="poi-actions__btn-icon">🗺️</text>
              <text class="poi-actions__btn-text">加入行程</text>
            </view>
          </view>
        </view>

        <!-- 标签 -->
        <view class="post__tags" v-if="post.tags && post.tags.length > 0">
          <view class="post__tag" v-for="tag in post.tags" :key="tag">
            <text class="post__tag-text">#{{ tag }}</text>
          </view>
        </view>

        <!-- 互动数据 -->
        <view class="post__stats">
          <view class="post__stat" @click="handleLike">
            <text class="post__stat-icon" :class="{ 'post__stat-icon--liked': post.isLiked }">{{ post.isLiked ? '♥' : '♡' }}</text>
            <text class="post__stat-text">{{ post.likeCount }}</text>
          </view>
          <view class="post__stat" @click="focusInput">
            <text class="post__stat-icon">💬</text>
            <text class="post__stat-text">{{ post.commentCount }}</text>
          </view>
          <view class="post__stat" @click="handleShare">
            <text class="post__stat-icon">↗</text>
            <text class="post__stat-text">分享</text>
          </view>
          <view class="post__stat" @click="togglePoiFavorite" v-if="post.poiId">
            <text class="post__stat-icon" :class="{ 'post__stat-icon--liked': poiInfo.isFavorite }">{{ poiInfo.isFavorite ? '♥' : '♡' }}</text>
            <text class="post__stat-text">{{ poiInfo.isFavorite ? '已收藏' : '收藏' }}</text>
          </view>
        </view>

        <!-- 评论区 -->
        <view class="comments">
          <view class="comments__header">
            <text class="comments__title">评论 ({{ post.commentCount }})</text>
            <view class="comments__tabs">
              <view
                class="comments__tab"
                :class="{ 'comments__tab--active': commentSort === 'hot' }"
                @click="commentSort = 'hot'"
              >
                <text class="comments__tab-text" :class="{ 'comments__tab-text--active': commentSort === 'hot' }">最热</text>
              </view>
              <view
                class="comments__tab"
                :class="{ 'comments__tab--active': commentSort === 'latest' }"
                @click="commentSort = 'latest'"
              >
                <text class="comments__tab-text" :class="{ 'comments__tab-text--active': commentSort === 'latest' }">最新</text>
              </view>
            </view>
          </view>

          <view class="comments__list" v-if="comments.length > 0">
            <CommentItem
              v-for="comment in comments"
              :key="comment.id"
              :data="comment"
              @like="handleCommentLike"
              @reply="handleCommentReply"
            />
          </view>
          <view class="comments__empty" v-else>
            <text class="comments__empty-text">暂无评论，快来抢沙发</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部评论输入栏 -->
    <view class="page__input-bar" :style="{ paddingBottom: safeBottom + 'px' }">
      <view class="page__input-wrap">
        <input
          class="page__input"
          v-model="inputText"
          placeholder="写评论..."
          placeholder-class="page__input-placeholder"
          :focus="inputFocus"
          @blur="inputFocus = false"
        />
        <view class="page__send-btn" @click="submitComment">
          <text class="page__send-text">发送</text>
        </view>
      </view>
    </view>

    <!-- 加入行程弹窗 -->
    <view class="trip-modal" v-if="showTripModal" @click="showTripModal = false">
      <view class="trip-modal__content" @click.stop>
        <text class="trip-modal__title">加入行程</text>
        <text class="trip-modal__desc">将「{{ post.poiName }}」添加到以下行程</text>
        <scroll-view class="trip-modal__list" scroll-y>
          <view
            class="trip-modal__item"
            v-for="trip in tripList"
            :key="trip.id"
            @click="confirmAddToTrip(trip)"
          >
            <image class="trip-modal__item-cover" :src="trip.cover" mode="aspectFill" />
            <view class="trip-modal__item-info">
              <text class="trip-modal__item-name">{{ trip.name }}</text>
              <text class="trip-modal__item-meta">{{ trip.days }}天 · {{ trip.poiCount }}景点</text>
            </view>
            <text class="trip-modal__item-add">+ 添加</text>
          </view>
        </scroll-view>
        <view class="trip-modal__new" @click="createNewTrip">
          <text class="trip-modal__new-icon">＋</text>
          <text class="trip-modal__new-text">新建行程</text>
        </view>
        <view class="trip-modal__close" @click="showTripModal = false">
          <text class="trip-modal__close-text">取消</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { getCommunityDetail, likeCommunityPost, getCommunityComments, postCommunityComment } from '@/api/community'
import { getPoiDetail, toggleFavorite as apiToggleFavorite } from '@/api/poi'
import { getTripList, createTrip } from '@/api/user'
import { getSystemInfo, getSafeAreaBottom } from '@/utils/safeArea'
import CommentItem from '@/components/CommentItem/CommentItem.vue'

const sysInfo = getSystemInfo()
const statusBarHeight = sysInfo.statusBarHeight
const safeBottom = getSafeAreaBottom()

const postId = ref(0)
const post = ref({
  userName: '', avatar: '', createTime: '', title: '', content: '',
  images: [], likeCount: 0, commentCount: 0, isLiked: false, isFollowed: false,
  poiName: '', poiCity: '', poiId: 0, tags: []
})
const poiInfo = reactive({ rating: 0, ticketPrice: '', images: [], isFavorite: false })
const comments = ref([])
const commentSort = ref('hot')
const inputText = ref('')
const inputFocus = ref(false)
const showTripModal = ref(false)
const tripList = ref([])

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  postId.value = parseInt(page.options?.id || '1')
  loadDetail()
  loadComments()
})

watch(commentSort, () => { loadComments() })

async function loadDetail() {
  try {
    const data = await getCommunityDetail(postId.value)
    if (data) {
      post.value = { ...post.value, ...data }
      if (data.poiId) loadPoiInfo(data.poiId)
    }
  } catch (e) {
    console.error('加载帖子详情失败', e)
  }
}

async function loadPoiInfo(poiId) {
  try {
    const data = await getPoiDetail(poiId)
    if (data) {
      poiInfo.rating = data.rating
      poiInfo.ticketPrice = data.ticketPrice
      poiInfo.images = data.images || []
      poiInfo.isFavorite = data.isFavorite || false
    }
  } catch (e) { /* */ }
}

async function loadComments() {
  try {
    const list = await getCommunityComments(postId.value, commentSort.value)
    comments.value = list || []
  } catch (e) {
    console.error('加载评论失败', e)
  }
}

function goBack() { uni.navigateBack() }

async function handleLike() {
  try {
    const result = await likeCommunityPost(postId.value)
    post.value.isLiked = result.isLiked
    post.value.likeCount += result.isLiked ? 1 : -1
  } catch (e) {
    post.value.isLiked = !post.value.isLiked
    post.value.likeCount += post.value.isLiked ? 1 : -1
  }
}

async function togglePoiFavorite() {
  if (!post.value.poiId) return
  try {
    const result = await apiToggleFavorite(post.value.poiId)
    poiInfo.isFavorite = result.isFavorite
    uni.showToast({ title: result.isFavorite ? '已收藏' : '取消收藏', icon: 'none' })
  } catch (e) {
    poiInfo.isFavorite = !poiInfo.isFavorite
    uni.showToast({ title: poiInfo.isFavorite ? '已收藏' : '取消收藏', icon: 'none' })
  }
}

function toggleFollow() {
  post.value.isFollowed = !post.value.isFollowed
  uni.showToast({ title: post.value.isFollowed ? '已关注' : '取消关注', icon: 'none' })
}

function previewImage(idx) {
  uni.previewImage({ current: idx, urls: post.value.images })
}

function goPoiDetail() {
  if (post.value.poiId) {
    uni.navigateTo({ url: `/pages/poi-detail/index?id=${post.value.poiId}` })
  }
}

function handleShare() {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
}

function focusInput() {
  inputFocus.value = true
}

function handleCommentLike(id) {
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    comment.isLiked = !comment.isLiked
    comment.likeCount += comment.isLiked ? 1 : -1
  }
}

function handleCommentReply(data) {
  inputText.value = `@${data.userName} `
  inputFocus.value = true
}

async function submitComment() {
  const content = inputText.value.trim()
  if (!content) return
  try {
    await postCommunityComment({ postId: postId.value, content })
    inputText.value = ''
    uni.showToast({ title: '评论成功', icon: 'success' })
    loadComments()
  } catch (e) {
    console.error('评论失败', e)
  }
}

// ===== 加入行程功能 =====

async function addToTrip() {
  if (!post.value.poiId) return
  try {
    const list = await getTripList()
    tripList.value = list || []
  } catch (e) {
    tripList.value = []
  }
  showTripModal.value = true
}

async function confirmAddToTrip(trip) {
  try {
    const newPoiIds = [...(trip.poiIds || []), post.value.poiId]
    await createTrip({
      name: trip.name,
      city: trip.city,
      days: trip.days,
      poiIds: newPoiIds
    })
    showTripModal.value = false
    uni.showToast({ title: `已添加到「${trip.name}」`, icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '添加失败', icon: 'none' })
  }
}

async function createNewTrip() {
  try {
    const newTrip = await createTrip({
      name: `${post.poiName}之旅`,
      city: post.value.poiCity || '厦门',
      days: 1,
      poiIds: [post.value.poiId]
    })
    showTripModal.value = false
    uni.showToast({ title: '已创建新行程', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '创建失败', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%; height: 100vh; background: #FFFFFF; display: flex; flex-direction: column; overflow-x: hidden;

  &__header { background: #fff; border-bottom: 1px solid #E5E7EB; }
  &__nav { display: flex; justify-content: space-between; align-items: center; padding: 8px; }
  &__back { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
  &__back-icon { font-size: 28px; color: #1F2937; font-weight: 300; }
  &__title { font-size: 17px; font-weight: 700; color: #1F2937; }
  &__body { flex: 1; padding: 0; box-sizing: border-box; }
  &__content { padding: 20px 16px; }

  &__input-bar {
    background: #FFFFFF; border-top: 1px solid #F1F5F9; padding: 12px 16px;
  }
  &__input-wrap { display: flex; align-items: center; gap: 12px; }
  &__input {
    flex: 1; height: 40px; background: #F3F4F6; border-radius: 20px; padding: 0 16px; font-size: 14px; color: #1F2937;
  }
  &__input-placeholder { color: #9CA3AF; }
  &__send-btn { background: #4ECDC4; padding: 8px 20px; border-radius: 20px; flex-shrink: 0; }
  &__send-text { font-size: 14px; font-weight: 600; color: #FFFFFF; }
}

.author {
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;

  &__avatar { width: 44px; height: 44px; border-radius: 50%; background: #E5E7EB; flex-shrink: 0; }
  &__info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  &__name { font-size: 15px; font-weight: 600; color: #1F2937; }
  &__time { font-size: 12px; color: #9CA3AF; }
  &__follow {
    padding: 6px 16px; border-radius: 20px; background: #4ECDC4; flex-shrink: 0;
    &--active { background: #F3F4F6; }
  }
  &__follow-text { font-size: 13px; font-weight: 600; color: #FFFFFF; }
  &__follow--active &__follow-text { color: #6B7A8D; }
}

.post {
  &__title { font-size: 20px; font-weight: 700; color: #1F2937; line-height: 28px; margin-bottom: 12px; display: block; }
  &__content { font-size: 15px; color: #374151; line-height: 24px; margin-bottom: 16px; display: block; white-space: pre-wrap; }

  &__images { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  &__image { width: 100%; border-radius: 12px; background: #F3F4F6; }

  &__poi { margin-bottom: 16px; }

  &__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  &__tag { padding: 4px 12px; background: #F3F4F6; border-radius: 16px; }
  &__tag-text { font-size: 12px; color: #4ECDC4; font-weight: 500; }

  &__stats {
    display: flex; gap: 24px; padding: 16px 0; border-top: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9; margin-bottom: 24px;
  }
  &__stat { display: flex; align-items: center; gap: 6px; }
  &__stat-icon { font-size: 18px; color: #6B7A8D; &--liked { color: #EF4444; } }
  &__stat-text { font-size: 14px; color: #6B7A8D; }
}

.poi-card {
  display: flex; align-items: center; gap: 12px; background: #F0FAFA; border: 1px solid rgba(78,205,196,0.2);
  border-radius: 12px; padding: 12px 16px;

  &__cover { width: 56px; height: 42px; border-radius: 8px; background: #E5E7EB; flex-shrink: 0;
    &--empty { display: flex; align-items: center; justify-content: center; background: #E8F8F7; }
  }
  &__cover-icon { font-size: 22px; }
  &__info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  &__name { font-size: 14px; font-weight: 600; color: #1F2937; }
  &__meta { display: flex; align-items: center; gap: 8px; }
  &__star { font-size: 12px; color: #F59E0B; font-weight: 600; }
  &__city { font-size: 11px; color: #6B7A8D; }
  &__price { font-size: 11px; color: #9CA3AF; }
  &__arrow { font-size: 20px; color: #9CA3AF; }
}

.poi-actions {
  display: flex; gap: 10px; margin-top: 10px;

  &__btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 0; border-radius: 10px; background: #F3F4F6;
    &--active { background: #FEF2F2; }
    &--route { background: #E8F8F7; }
  }
  &__btn-icon { font-size: 16px; }
  &__btn-text { font-size: 13px; font-weight: 600; color: #374151; }
  &__btn--active &__btn-icon { color: #EF4444; }
  &__btn--active &__btn-text { color: #EF4444; }
  &__btn--route &__btn-text { color: #0D9488; }
}

.comments {
  &__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  &__title { font-size: 16px; font-weight: 700; color: #1F2937; }
  &__tabs { display: flex; gap: 8px; }
  &__tab { padding: 4px 12px; border-radius: 20px; background: #F3F4F6; &--active { background: #E8F8F7; } }
  &__tab-text { font-size: 12px; color: #6B7A8D; &--active { color: #4ECDC4; font-weight: 700; } }
  &__empty { padding: 40px 0; display: flex; justify-content: center; }
  &__empty-text { font-size: 14px; color: #9CA3AF; }
}

// 行程弹窗
.trip-modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: flex-end; justify-content: center;

  &__content {
    width: 100%; max-width: 500px; background: #FFFFFF; border-radius: 20px 20px 0 0;
    padding: 24px; max-height: 70vh; display: flex; flex-direction: column;
  }
  &__title { font-size: 18px; font-weight: 700; color: #1F2937; margin-bottom: 4px; }
  &__desc { font-size: 13px; color: #6B7A8D; margin-bottom: 16px; }
  &__list { flex: 1; max-height: 300px; }
  &__item {
    display: flex; align-items: center; gap: 12px; padding: 12px 0;
    border-bottom: 1px solid #F1F5F9;
  }
  &__item-cover { width: 48px; height: 36px; border-radius: 6px; background: #E5E7EB; flex-shrink: 0; }
  &__item-info { flex: 1; }
  &__item-name { font-size: 14px; font-weight: 600; color: #1F2937; display: block; }
  &__item-meta { font-size: 11px; color: #9CA3AF; }
  &__item-add { font-size: 13px; font-weight: 600; color: #4ECDC4; flex-shrink: 0; }
  &__new {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 14px; border: 2px dashed #DDE2E8; border-radius: 12px; margin-top: 12px;
  }
  &__new-icon { font-size: 18px; color: #4ECDC4; font-weight: 700; }
  &__new-text { font-size: 14px; color: #4ECDC4; font-weight: 600; }
  &__close { padding: 14px; text-align: center; margin-top: 8px; }
  &__close-text { font-size: 14px; color: #9CA3AF; }
}

/* #ifdef H5 */
.page__web-title {
  background: #FFFFFF;
  border-bottom: 1px solid #EEF0F4;
}

.page__web-title-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px 24px 20px;
}

.page__web-back {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  border-radius: 10px; cursor: pointer; transition: background 0.2s; margin-right: 4px;
  &:hover { background: #F3F4F6; }
}

.page__web-back-icon { font-size: 24px; color: #1F2937; font-weight: 300; }
.page__web-title-icon { font-size: 28px; }
.page__web-title-text { font-size: 24px; font-weight: 800; color: #1F2937; }

.page__body { padding: 0 !important; }

.page__content {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;
}

.post__title { font-size: 26px; line-height: 36px; }
.post__content { font-size: 16px; line-height: 28px; }

.post__images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.author__avatar { width: 48px; height: 48px; }
.author__name { font-size: 16px; }

.poi-card {
  &:hover { border-color: rgba(78,205,196,0.4); }
}

.poi-actions__btn {
  cursor: pointer;
  transition: all 0.2s;
  &:hover { opacity: 0.85; }
}

.trip-modal__content {
  max-width: 600px;
  border-radius: 20px;
  margin: auto;
}

.trip-modal {
  align-items: center;
}
/* #endif */
</style>
