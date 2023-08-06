<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, onBeforeRouteLeave, on } from 'vue-router';
import { useLoadingStore } from './stores/loading';

</script>

<template>
  <RouterView />
</template>

<style>
@import '@/assets/base.css';

#app {
  margin: 0 auto;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-weight: normal;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}
</style>
