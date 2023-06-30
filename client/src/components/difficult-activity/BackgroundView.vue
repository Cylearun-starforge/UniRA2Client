<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useFollowMouse } from '@/hooks/use-follow-mouse';
const backgroundImage = {
  bg: ref<HTMLImageElement>(),
  man: ref<HTMLImageElement>(),
  stuff: ref<HTMLImageElement>(),
};

const man = useFollowMouse(backgroundImage.man, {
  base: {
    x: 'left',
    y: 'top',
  },
  speed: {
    x: 0.05,
    y: 0.05,
  },
  maxMove: {
    left: 60,
    top: 60,
    right: 60,
    bottom: 60,
  },
});

const stuff = useFollowMouse(backgroundImage.stuff, {
  base: {
    x: 'left',
    y: 'top',
  },
  speed: {
    x: 0.03,
    y: 0.03,
  },
  maxMove: {
    left: 40,
    top: 40,
    right: 40,
    bottom: 40,
  },
});

const bg = useFollowMouse(backgroundImage.bg, {
  base: {
    x: 'left',
    y: 'top',
  },
  speed: {
    x: 0.01,
    y: 0.01,
  },
  maxMove: {
    left: 20,
    top: 20,
    right: 20,
    bottom: 20,
  },
});

onMounted(() => {
  window.addEventListener('mousemove', man);
  window.addEventListener('mousemove', stuff);
  window.addEventListener('mousemove', bg);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', man);
  window.removeEventListener('mousemove', stuff);
  window.removeEventListener('mousemove', bg);
});
</script>

<template>
  <div class="background-container">
    <img
      :ref="backgroundImage.bg"
      class="background background-bg"
      draggable="false"
      src="/difficult-activity/background.png"
    />
    <img
      :ref="backgroundImage.stuff"
      class="background"
      draggable="false"
      src="/difficult-activity/stuff.png"
    />
    <img :ref="backgroundImage.man" class="background" draggable="false" src="/difficult-activity/man.png" />
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

.background-bg {
  transform: scale(1.1);
  object-fit: fill;
}

.background-fixed {
  object-fit: fill;
}
</style>
