<script lang="ts" setup>
import { StyleValue, PropType, computed } from 'vue';
const props = defineProps({
  src: String,
  alt: String,
  class: String,
  style: Object as PropType<StyleValue>,
});

const imgSrc = computed(() => {
  return  props.src;
});
</script>

<template>
  <img :src="imgSrc" :alt="alt" :class="props.class" :style="style" />
</template>
