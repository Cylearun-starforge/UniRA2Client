<script setup lang="ts">
import { useRouter } from 'vue-router';
import { CyList, CyBorder, CyPopover, CyInput } from '@cylearun/components';
import { useWindowSize } from '@vueuse/core';
import ColumnsLayout from '@/layouts/columns-layout';

const router = useRouter();

const backToSkirmish = () => {
  router.push({
    name: 'skirmish'
  })
}

const fakeMode = {
  name: {
    zh: '标准对战',
    en: 'Standard',
  },
  image: '/game/mode/standard.png'
};

const modeList = Array.from<typeof fakeMode>({ length: 10 }).fill(fakeMode)

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
      width: 140,
    }]" :gap="12">
      <template #left>
        <div class="mode-list-view">
          <div class="mode-selector">
            mode:
            <cy-input class="filter" />
          </div>
          <cy-list :width="400" :height="height - 80 - 40">
            <cy-border :top-corner-size="0" :bottom-corner-size="0" class="map-mode-item" width="100%"
              v-for="mode in modeList">
              <img :src="mode.image" :alt="mode.name.en">
              <div class="map-mode-item-content">
                {{ mode.name.zh }}
              </div>

            </cy-border>
          </cy-list>
        </div>
      </template>
      <div class="mode-description">
        <div>
          <img class="image-border" src='/game/map_preview_box.png' />
          <img class="image" src="/game/map/preview/mode.png" alt="">
        </div>
        <cy-border :top-corner-size="20" class="text" redraw-border-on-resize width="100%">
          <div>
            这是一段测试文本 <br />
            你干嘛，哎呦
          </div>
        </cy-border>
      </div>
      <template #right class="right-side-info">
        <button @click="backToSkirmish" class="back-button-wrapper">
          <cy-border class="back-button" :top-corner-size="20" width="100%">
            BACK
          </cy-border>
        </button>
        <cy-popover v-for="n in [1, 2, 3, 4]">
          <template #trigger>
            <cy-border class="feature" :top-corner-size="0" :bottom-corner-size="0">
              FEATURE {{ n }}
            </cy-border>
          </template>
          <div style="{{ width: '100px', height: '150px','background-color': 'rgba(0,0,0,0.9)' }}">
            A very long description for feature {{ n }}<br />
            A very long description for feature {{ n }}<br />
            A very long description for feature {{ n }}<br />
            A very long description for feature {{ n }}<br />
          </div>
        </cy-popover>


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
  padding: 40px;

  background-color: rgba(0, 0, 0, 0.7);
}

.layout {
  width: 100%;
}

.mode-selector {
  display: flex;
  height: 28px;
  margin-bottom: 12px;
}

.filter {
  flex: 1;
}

.mode-list-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mode-description {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
}

.mode-description .image-border {
  width: 100%;
  object-fit: contain;
  z-index: 10;

}

.mode-description .image {
  position: absolute;
  top: 50%;
  object-fit: contain;
  left: 50%;
  height: calc(100% - 24px);
  width: calc(100% - 24px);
  transform: translate(-50%, -50%);
}

.mode-description .text {
  width: 100%;
  color: rgb(134, 200, 217);
  flex: 1;
  padding: 20px;
  margin-top: 20px;
}

.map-mode-item {
  height: 100px;
  width: 100%;
  margin-bottom: 12px;
  position: relative;
}

.map-mode-item img {
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
}

.map-mode-item-content {
  padding: 20px;
}

.right-side-info {
  display: flex;
  flex-direction: column;
}

.back-button-wrapper {
  width: 100%;
  margin-bottom: 120px;
  padding: 0;
  border: 0;
  background-color: transparent;
}

.back-button {
  width: 122px;
  height: 156px;
  padding: 20px;
  background-image: url('/game/change_map_bg.png');
  background-position: center;
  background-size: cover;
  background-color: rgba(0, 0, 0, 0.5);
  background-blend-mode: darken;
  color: rgb(134, 200, 217);
}

.back-button .content {
  width: 100%;
  height: 100%;
}

.feature {
  width: 100px;
  height: 80px;
  margin-bottom: 12px;
  padding: 12px;
}
</style>
