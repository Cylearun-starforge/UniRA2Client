<script lang="ts" setup>
import { PropType, watch, reactive, onMounted } from 'vue';
import { GameMap } from '@/game/map';
import { useAsyncState, UseAsyncStateReturn } from '@vueuse/core'
defineEmits({
  close: null,
});

const props = defineProps({
  map: {
    type: Object as PropType<GameMap>,
    required: true,
  },
});


const preview = reactive({
  ready: false,
  value: '',
})

const loadMap = async () => {
  const map = props.map
  if (!map) {
    return;
  }
  preview.value = await map.cover;
  console.log('map', preview.value)
  preview.ready = true;
}

onMounted(loadMap)



</script>

<template>
  <div class="map-preview-view-root flex">
    <div class="map-preview-view flex">
      <div class="map-preview flex">
        <button class="close-button" @click="$emit('close')">
          <img src="/game/map/preview/close.png" draggable="false" />
        </button>
        <img v-if="preview.ready" :src="preview.value" draggable="false" />
      </div>
    </div>
    <div class="right-margin"></div>
  </div>
</template>

<style scoped>
.map-preview-view-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  padding-right: 0;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.7);
}

.map-preview-view {
  width: 100%;
  height: 100%;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
}

.map-preview {
  width: 90%;
  background-image: url('/game/map/preview_map_border.png');
  background-size: 100% 100%;
  padding: 6px;
  justify-content: center;
  align-items: center;
  background-color: black;
}

.map-preview>img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.right-margin {
  /* A 172px empty block match right info */
  width: 172px;
}

.close-button {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  padding: 0;
  border-width: 0;
  transform: translate(100%, -100%);
  background: transparent;
  cursor: pointer;
}
</style>
