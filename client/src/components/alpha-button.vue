<script setup lang="ts">
import { ref, reactive, CSSProperties, computed, onMounted, onUnmounted, watchEffect } from 'vue';
import { getElementPosition } from '@/util/getElementPosition';
const emits = defineEmits(['click']);
const props = defineProps({
  background: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const state = reactive({
  hover: false,
});

const buttonStyle = computed<CSSProperties>(() => ({
  cursor: state.hover ? 'pointer' : 'initial',
  backgroundImage: `url("${props.background}")`,
  backgroundColor: 'transparent',
  borderWidth: 0,
}));

const canvas = document.createElement('canvas');
const buttonRef = ref<HTMLButtonElement>();
const onClick = (e: MouseEvent) => {
  e.preventDefault();
  if (props.disabled || !state.hover) {
    return;
  }
  emits('click', e);
};
const image = new Image();

watchEffect(() => {
  image.src = props.background;
});
image.onload = setAlpha;

onMounted(() => {
  window.addEventListener('resize', setAlpha);
});

onUnmounted(() => {
  window.removeEventListener('resize', setAlpha);
});

function setAlpha() {
  canvas.width = buttonRef.value!.clientWidth;
  canvas.height = buttonRef.value!.clientHeight;
  const ctx = canvas.getContext('2d');
  ctx!.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    buttonRef.value!.clientWidth,
    buttonRef.value!.clientHeight
  );
}

const onPixel = (x: number, y: number) => {
  const p = getElementPosition(buttonRef.value!);
  const pixel = canvas.getContext('2d')!.getImageData(x - p.x, y - p.y, 1, 1);
  if (pixel.data[3] === 0) {
    return false;
  }
  return true;
};
</script>

<template>
  <button ref="buttonRef" @mouseleave="state.hover = false" :class="[disabled && 'disabled']" @mousemove="
    e => {
      state.hover = onPixel(e.clientX, e.clientY);
    }
  " @click="onClick" :style="buttonStyle">
    <slot></slot>
  </button>
</template>

<style scoped>
.disabled {
  filter: grayscale(0.8);
  cursor: not-allowed !important;
}

.disabled:hover {
  cursor: not-allowed !important;
}
</style>