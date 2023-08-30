<script setup lang="ts">
import BackButton from '@/components/back-button.vue';
import { RouteLocationRaw } from 'vue-router';
import { CyDropdownSelector, CyList } from '@cylearun/components';

const returnRoute: RouteLocationRaw = {
  name: 'skirmish'
}
const options = [{ value: " 玩家数", display: "玩家数" }];
</script>
<template>
  <div class="skirmish-view-root flex">
    <div class="mode-list-view">
      <cy-list width="400" height="200">
        <div></div>
      </cy-list>
    </div>
  </div>
</template>

<style scoped>
.skirmish-view-root {
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  padding-right: 0;
  gap: 12px;
  background-color: rgba(0, 0, 0, 0.7);
}

.mode-list-view {}

.back-button {
  position: absolute;
  right: 12px;
  bottom: 12px;
}
</style>
