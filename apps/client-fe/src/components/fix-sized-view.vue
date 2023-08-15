<script setup lang="ts">
import { CSSProperties, PropType, reactive } from 'vue';
const props = defineProps({
  width: {
    type: Object as PropType<`${number}${'px' | 'vw' | '%'}` | number>,
    required: true,
  },
  height: {
    type: Object as PropType<`${number}${'px' | 'vh' | '%'}` | number>,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
});
const toCssSize = (size: number | string) => {
  if (typeof size === 'number') {
    return `${size}px`;
  }
  return size;
};

const style = reactive<CSSProperties>({
  width: toCssSize(props.width),
  height: toCssSize(props.height),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
</script>

<template>
  <div :class="`fix-sized-container flex ${props.class}`">
    <div :style="style">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.fix-sized-container {
  justify-content: center;
  align-items: center;
}
</style>
