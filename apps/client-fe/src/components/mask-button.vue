<script setup lang="ts">
import { ref, reactive, effect } from 'vue';
import { getElementPosition } from '@/util/getElementPosition';
const emits = defineEmits(['click']);
const props = defineProps({
  maskFile: {
    type: String,
    required: true,
  },
});

const state = reactive({
  hover: false,
});
const canvas = document.createElement('canvas');
const buttonRef = ref<HTMLButtonElement>();
const onClick = (e: MouseEvent) => {
  e.preventDefault();
  if (!state.hover) {
    return;
  }
  emits('click', e);
};
const image = new Image();
image.src = props.maskFile;
image.onload = setMask;

effect(() => {
  window.addEventListener('resize', setMask);
  return () => {
    window.removeEventListener('resize', setMask);
  };
});

function setMask() {
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
  if (pixel.data[0] === 0 && pixel.data[1] === 0 && pixel.data[2] === 0) {
    return false;
  }
  return true;
};
</script>

<template>
  <button
    ref="buttonRef"
    @mouseleave="state.hover = false"
    @mousemove="
      e => {
        state.hover = onPixel(e.clientX, e.clientY);
      }
    "
    @click="onClick"
    :style="{ cursor: state.hover ? 'pointer' : 'initial' }"
  >
    <slot></slot>
  </button>
</template>
