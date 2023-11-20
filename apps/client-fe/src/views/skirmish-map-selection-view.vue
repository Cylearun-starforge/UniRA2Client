<script setup lang="ts">
import BackButton from '@/components/back-button.vue';
import { RouteLocationRaw } from 'vue-router';
import { CyDropdownSelector, CyList, CyBorder } from '@cylearun/components';
import { useWindowSize } from '@vueuse/core';
import ColumnsLayout from '@/layouts/columns-layout';
const returnRoute: RouteLocationRaw = {
  name: 'skirmish'
}
const options = [{ value: "playercount", display: "玩家数" }];
const { height } = useWindowSize()
</script>
<template>
  <div class="skirmish-view-root flex">
    <columns-layout class="layout" :columns="[{
      name: 'left',
      width: 400,
    }, {
      name: 'default',
      width: 'flex1',
    }, {
      name: 'right',
      width: 148,
    },]" :gap="12">
      <template #left>
        <div class="mode-list-view">
          <div class="mode-selector">
            mode:
            <cy-dropdown-selector :candidates="options" :value="'playercount'" />
          </div>
          <cy-list :width="400" :height="height - 40">
            <cy-border :top-corner-size="10" class="map-mode-item"
              v-for="name in ['foo', 'bar', 'baz', 'foo', 'bar', 'baz', 'foo', 'bar', 'baz', 'foo', 'bar', 'baz', 'foo', 'bar', 'baz']">
              <div class="map-mode-item-content">{{ name }}</div>
            </cy-border>
          </cy-list>
        </div>
      </template>
      <template>
        <div></div>
      </template>
      <template #right class="right-side-info">
        <cy-border class="back-button" :top-corner-size="20">
          BACK
        </cy-border>
        <cy-border class="feature" :top-corner-size="20" v-for="n in [1, 2, 3, 4]">
          FEATURE {{ n }}
        </cy-border>

      </template>
    </columns-layout>
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

  background-color: rgba(0, 0, 0, 0.7);
}

.layout {
  width: 100%;
}

.mode-selector {
  display: flex;
  height: 20px;
}

.mode-list-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-mode-item {
  height: 100px;
  width: 100%;
  background-color: black;
  margin-bottom: 12px;
}

.map-mode-item-content {
  padding: 20px;
}

.right-side-info {
  display: flex;
  flex-direction: column;
}

.back-button {
  width: 128px;
  height: 156px;
  margin-bottom: 120px;
  padding: 20px;
}

.feature {
  width: 128px;
  height: 100px;
  margin-bottom: 12px;
  padding: 20px;
}
</style>
