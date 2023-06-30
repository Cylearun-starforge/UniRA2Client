<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useFollowMouse } from '@/hooks/use-follow-mouse';
const backgroundImage = {
  cloud: ref<HTMLImageElement>(),
  jet1: ref<HTMLImageElement>(),
  jet2: ref<HTMLImageElement>(),
};

const jet1 = useFollowMouse(backgroundImage.jet1, {
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

const jet2 = useFollowMouse(backgroundImage.jet2, {
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

const cloud = useFollowMouse(backgroundImage.cloud, {
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
  window.addEventListener('mousemove', jet1);
  window.addEventListener('mousemove', jet2);
  window.addEventListener('mousemove', cloud);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', jet1);
  window.removeEventListener('mousemove', jet2);
  window.removeEventListener('mousemove', cloud);
});
</script>

<template>
  <div class="background-container">
    <img
      :ref="backgroundImage.cloud"
      class="background background-cloud"
      draggable="false"
      src="/campaign/cloud.png"
    />
    <img :ref="backgroundImage.jet2" class="background" draggable="false" src="/campaign/jet.png" />
    <img
      :ref="backgroundImage.jet1"
      class="background background-jet1"
      draggable="false"
      src="/campaign/jet_closer.png"
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

.background-cloud {
  transform: scale(1.1);
  object-fit: fill;
}

.background-jet1 {
  transform: translateX(120px);
}

.background-fixed {
  object-fit: fill;
}
</style>
