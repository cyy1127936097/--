<template>
  <view class="skeleton" :class="{ 'skeleton--animated': animated }">
    <slot>
      <!-- 默认卡片骨架 -->
      <view v-if="type === 'card'" class="skeleton__card">
        <view class="skeleton__rect skeleton__rect--img"></view>
        <view class="skeleton__body">
          <view class="skeleton__line skeleton__line--title"></view>
          <view class="skeleton__line skeleton__line--text"></view>
          <view class="skeleton__line skeleton__line--short"></view>
        </view>
      </view>

      <!-- 景点卡片骨架 -->
      <view v-else-if="type === 'poi'" class="skeleton__poi">
        <view class="skeleton__rect skeleton__rect--poi-img"></view>
        <view class="skeleton__poi-info">
          <view class="skeleton__line skeleton__line--name"></view>
          <view class="skeleton__line skeleton__line--meta"></view>
        </view>
      </view>

      <!-- 路线卡片骨架 -->
      <view v-else-if="type === 'route'" class="skeleton__route">
        <view class="skeleton__route-left">
          <view class="skeleton__line skeleton__line--badge"></view>
          <view class="skeleton__line skeleton__line--route-name"></view>
          <view class="skeleton__line skeleton__line--route-meta"></view>
        </view>
      </view>

      <!-- 详情页骨架 -->
      <view v-else-if="type === 'detail'" class="skeleton__detail">
        <view class="skeleton__rect skeleton__rect--banner"></view>
        <view class="skeleton__detail-body">
          <view class="skeleton__line skeleton__line--detail-title"></view>
          <view class="skeleton__line skeleton__line--detail-rating"></view>
          <view class="skeleton__meta-grid">
            <view class="skeleton__meta-item" v-for="i in 3" :key="i">
              <view class="skeleton__circle"></view>
              <view class="skeleton__meta-text">
                <view class="skeleton__line skeleton__line--meta-label"></view>
                <view class="skeleton__line skeleton__line--meta-value"></view>
              </view>
            </view>
          </view>
          <view class="skeleton__rect skeleton__rect--summary"></view>
        </view>
      </view>

      <!-- 列表项骨架 -->
      <view v-else-if="type === 'list'" class="skeleton__list">
        <view class="skeleton__list-item" v-for="i in count" :key="i">
          <view class="skeleton__circle skeleton__circle--avatar"></view>
          <view class="skeleton__list-content">
            <view class="skeleton__line skeleton__line--list-title"></view>
            <view class="skeleton__line skeleton__line--list-sub"></view>
          </view>
        </view>
      </view>

      <!-- 网格骨架 -->
      <view v-else-if="type === 'grid'" class="skeleton__grid">
        <view class="skeleton__grid-item" v-for="i in count" :key="i">
          <view class="skeleton__rect skeleton__rect--grid-img"></view>
          <view class="skeleton__grid-body">
            <view class="skeleton__line skeleton__line--grid-title"></view>
            <view class="skeleton__line skeleton__line--grid-meta"></view>
          </view>
        </view>
      </view>
    </slot>
  </view>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'card' },
  count: { type: Number, default: 3 },
  animated: { type: Boolean, default: true }
})
</script>

<style lang="scss" scoped>
.skeleton {
  &--animated {
    .skeleton__rect,
    .skeleton__line,
    .skeleton__circle {
      background: linear-gradient(90deg, #E5E7EB 25%, #F0F2F5 50%, #E5E7EB 75%);
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.5s ease-in-out infinite;
    }
  }

  &__rect {
    border-radius: 8px;
    background: #E5E7EB;

    &--img { width: 100%; height: 160px; }
    &--poi-img { width: 130px; height: 90px; border-radius: 12px 12px 0 0; }
    &--banner { width: 100%; height: 280px; border-radius: 0; }
    &--summary { width: 100%; height: 80px; border-radius: 16px; }
    &--grid-img { width: 100%; height: 140px; border-radius: 12px 12px 0 0; }
  }

  &__line {
    height: 12px;
    border-radius: 4px;
    background: #E5E7EB;

    &--title { width: 70%; height: 18px; margin-bottom: 10px; }
    &--text { width: 100%; margin-bottom: 6px; }
    &--short { width: 45%; }
    &--name { width: 80%; height: 14px; margin-bottom: 6px; }
    &--meta { width: 50%; height: 10px; }
    &--badge { width: 40px; height: 18px; border-radius: 10px; margin-bottom: 8px; }
    &--route-name { width: 65%; height: 14px; margin-bottom: 6px; }
    &--route-meta { width: 45%; height: 10px; }
    &--detail-title { width: 55%; height: 24px; margin-bottom: 10px; }
    &--detail-rating { width: 35%; height: 14px; margin-bottom: 20px; }
    &--meta-label { width: 50px; height: 10px; margin-bottom: 4px; }
    &--meta-value { width: 70px; height: 12px; }
    &--list-title { width: 60%; height: 14px; margin-bottom: 6px; }
    &--list-sub { width: 40%; height: 10px; }
    &--grid-title { width: 75%; height: 14px; margin-bottom: 6px; }
    &--grid-meta { width: 50%; height: 10px; }
  }

  &__circle {
    border-radius: 50%;
    background: #E5E7EB;
    width: 32px;
    height: 32px;

    &--avatar { width: 40px; height: 40px; }
  }

  &__body {
    padding: 12px;
    display: flex;
    flex-direction: column;
  }

  &__card {
    border-radius: 12px;
    overflow: hidden;
    background: #FFFFFF;
  }

  &__poi {
    width: 130px;
    border-radius: 12px;
    overflow: hidden;
    background: #F9FAFB;
    border: 1px solid #E5E7EB;
  }

  &__poi-info {
    padding: 8px 10px;
  }

  &__route {
    padding: 14px;
    background: #F9FAFB;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
  }

  &__route-left {
    display: flex;
    flex-direction: column;
  }

  &__detail-body {
    padding: 20px;
  }

  &__meta-grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
  }

  &__meta-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    width: calc(50% - 8px);
  }

  &__meta-text {
    display: flex;
    flex-direction: column;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #FFFFFF;
    border-radius: 12px;
  }

  &__list-content {
    flex: 1;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  &__grid-item {
    border-radius: 12px;
    overflow: hidden;
    background: #FFFFFF;
  }

  &__grid-body {
    padding: 12px;
  }
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
