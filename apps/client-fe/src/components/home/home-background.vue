<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue';
import { useFollowMouse } from '@/hooks/use-follow-mouse';

const backgroundImage = {
  ground: ref<HTMLImageElement>(),
  cosmos: ref<HTMLImageElement>(),
};

const cosmosMove = useFollowMouse(backgroundImage.cosmos, {
  base: {
    x: 'left',
    y: 'top',
  },
  speed: {
    x: 0.2,
    y: 0.2,
  },
  maxMove: {
    left: 40,
    top: 40,
    right: 40,
    bottom: 40,
  },
});

const groundMove = useFollowMouse(backgroundImage.ground, {
  base: {
    x: 'left',
    y: 'top',
  },
  speed: {
    x: 0.1,
    y: 0.1,
  },
  maxMove: {
    left: 20,
    top: 20,
    right: 20,
    bottom: 20,
  },
  offset: {
    x: -20,
    y: 20,
  },
});

onMounted(() => {
  window.addEventListener('mousemove', cosmosMove);
  window.addEventListener('mousemove', groundMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', cosmosMove);
  window.removeEventListener('mousemove', groundMove);
});
</script>

<template>
  <div class="background-container">
    <img
      :ref="backgroundImage.cosmos"
      class="background background-subface"
      draggable="false"
      src="/home/background/background_subface.png"
    />
    <img
      :ref="backgroundImage.ground"
      class="background background-ground"
      draggable="false"
      src="/home/background/background_ground.png"
    />
    <img class="background" src="/basic/background_top.png" draggable="false" />
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
}

.background-subface {
  transform: scale(1.1);
}

.background-ground {
  transform: translate(-30px, 40px);
}
</style>
