<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useFollowMouse } from '@/hooks/use-follow-mouse';
const backgroundImage = {
  city: ref<HTMLImageElement>(),
};

const city = useFollowMouse(backgroundImage.city, {
  base: {
    x: 'left',
    y: 'top',
  },
  speed: {
    x: 0.02,
    y: 0.02,
  },
  maxMove: {
    left: 20,
    top: 20,
    right: 20,
    bottom: 20,
  },
});

onMounted(() => {
  window.addEventListener('mousemove', city);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', city);
});
</script>

<template>
  <div class="background-container">
    <img
      :ref="backgroundImage.city"
      class="background background-city"
      draggable="false"
      src="/skirmish/background.png"
    />
    <img class="background background-fixed" src="/basic/background_top.png" draggable="false" />
  </div>
</template>

<style scoped>
.background-container {
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}

.background {
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: contain;
}

.background-city {
  transform: scale(1.1);
  object-fit: cover;
}

.background-fixed {
  object-fit: fill;
}
</style>
