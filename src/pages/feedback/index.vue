<template>
  <view class="page">
    <!-- #ifdef H5 -->
    <view class="page__web-title">
      <view class="page__web-title-inner">
        <text class="page__web-title-icon">💬</text>
        <text class="page__web-title-text">意见反馈</text>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <view class="page__header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="page__nav">
        <view class="page__back" @click="goBack"><text class="page__back-icon">‹</text></view>
        <text class="page__title">意见反馈</text>
        <view class="page__back" style="opacity:0"><text class="page__back-icon">‹</text></view>
      </view>
    </view>
    <!-- #endif -->

    <scroll-view class="page__body" scroll-y>
      <view class="page__content">
        <view class="section">
          <text class="section__title">反馈类型</text>
          <view class="tag-row">
            <view class="tag" v-for="t in types" :key="t.value" :class="{ 'tag--active': form.type === t.value }" @click="form.type = t.value">
              <text>{{ t.label }}</text>
            </view>
          </view>
        </view>
        <view class="section">
          <text class="section__title">详细描述</text>
          <view class="card">
            <textarea class="textarea" v-model="form.content" placeholder="请描述您遇到的问题或建议..." placeholder-style="color:#D1D5DB" maxlength="500" />
            <view class="textarea-count">
              <text class="textarea-count__text">{{ form.content.length }}/500</text>
            </view>
          </view>
        </view>
        <view class="section">
          <text class="section__title">联系方式（选填）</text>
          <view class="card">
            <input class="input" v-model="form.contact" placeholder="手机号或邮箱，方便我们回复" placeholder-style="color:#D1D5DB" />
          </view>
        </view>
        <view class="submit-wrap">
          <view class="submit-btn" :class="{ 'submit-btn--active': form.content.trim() }" @click="submitFeedback">
            <text class="submit-btn__text">提交反馈</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getSystemInfo } from '@/utils/safeArea'

const statusBarHeight = getSystemInfo().statusBarHeight
const types = [
  { label: '功能建议', value: 'suggestion' },
  { label: '问题反馈', value: 'bug' },
  { label: '体验评价', value: 'review' },
  { label: '其他', value: 'other' },
]
const form = ref({ type: 'suggestion', content: '', contact: '' })

function submitFeedback() {
  if (!form.value.content.trim()) {
    uni.showToast({ title: '请填写反馈内容', icon: 'none' })
    return
  }
  uni.showLoading({ title: '提交中...' })
  setTimeout(() => {
    uni.hideLoading()
    form.value = { type: 'suggestion', content: '', contact: '' }
    uni.showToast({ title: '感谢反馈！我们会尽快处理', icon: 'success', duration: 2000 })
  }, 800)
}
function goBack() { uni.navigateBack() }
</script>

<style lang="scss" scoped>
.page {
  width: 100%; height: 100vh; background: #F3F4F6; display: flex; flex-direction: column; overflow-x: hidden;
  &__header { background: #fff; border-bottom: 1px solid #E5E7EB; }
  &__nav { display: flex; justify-content: space-between; align-items: center; padding: 8px; }
  &__back { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
  &__back-icon { font-size: 28px; color: #1F2937; font-weight: 300; }
  &__title { font-size: 17px; font-weight: 700; color: #1F2937; }
  &__body { flex: 1; padding: 12px 16px; box-sizing: border-box; }
}
.section { margin-bottom: 20px; }
.section__title { font-size: 14px; font-weight: 600; color: #6B7280; margin-bottom: 10px; padding-left: 2px; }
.tag-row { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { padding: 8px 20px; border-radius: 20px; background: #fff; border: 1px solid #E5E7EB; cursor: pointer; transition: all 0.2s; }
.tag text { font-size: 13px; color: #6B7280; }
.tag--active { background: #ECFDF5; border-color: #A7F3D0; }
.tag--active text { color: #059669; }
.card { background: #fff; border-radius: 12px; overflow: hidden; }
.textarea { width: 100%; height: 140px; padding: 14px; font-size: 14px; color: #1F2937; box-sizing: border-box; }
.textarea-count { padding: 0 14px 10px; display: flex; justify-content: flex-end; }
.textarea-count__text { font-size: 11px; color: #D1D5DB; }
.input { width: 100%; height: 44px; padding: 0 14px; font-size: 14px; color: #1F2937; box-sizing: border-box; }
.submit-wrap { padding: 8px 0 30px; }
.submit-btn { padding: 14px; border-radius: 12px; background: #D1D5DB; display: flex; justify-content: center; cursor: pointer; transition: background 0.2s; }
.submit-btn__text { font-size: 15px; color: #fff; font-weight: 600; }
.submit-btn--active { background: linear-gradient(135deg, #4ECDC4, #2A9D8F); }

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

.page__web-title-icon {
  font-size: 28px;
}

.page__web-title-text {
  font-size: 24px;
  font-weight: 800;
  color: #1F2937;
}

.page__body {
  padding: 0 !important;
}

.page__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.section__title {
  font-size: 15px;
  color: #374151;
  margin-bottom: 12px;
}

.card {
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.tag:hover {
  border-color: #A7F3D0;
}

.submit-btn--active:hover {
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}
/* #endif */
</style>
