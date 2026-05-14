<template>
  <view class="star-rating" :style="{ gap: gap + 'px' }">
    <view
      v-for="i in 5"
      :key="i"
      class="star-rating__item"
      @click="handleClick(i)"
    >
      <text
        class="star-rating__icon"
        :style="{
          fontSize: size + 'px',
          color: i <= current ? activeColor : inactiveColor
        }"
      >★</text>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  size: { type: Number, default: 14 },
  gap: { type: Number, default: 2 },
  activeColor: { type: String, default: '#FF9F43' },
  inactiveColor: { type: String, default: '#DDE2E8' },
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const current = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  current.value = val
})

function handleClick(index) {
  if (props.readonly) return
  current.value = index
  emit('update:modelValue', index)
  emit('change', index)
}
</script>

<style lang="scss" scoped>
.star-rating {
  display: flex;
  flex-direction: row;
  align-items: center;

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    line-height: 1;
  }
}
</style>
