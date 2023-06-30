<script lang="ts" setup>
import DropdownSelector from '@/components/game/dropdown-selector';
import { GameModes } from '@/game/options';
import MapItem from './map-item.vue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { getElementPosition } from '@/util/getElementPosition';
import { useGameMaps } from '@/stores/game-maps';
import { useMapSets } from '@/stores/game-mode';

const mapSetStore = useMapSets();

defineProps({
  selectedIndex: {
    type: Number,
    required: true,
  },
});

defineEmits({
  'setSelectedIndex'(index: number) {
    return Number.isInteger(index);
  },
});

const scrollButtonRef = ref<HTMLImageElement>();
const mapListRef = ref<HTMLDivElement>();
const mapViewRef = ref<HTMLDivElement>();
const scrollbarRef = ref<HTMLDivElement>();

const state = reactive({
  dragging: false,
  scrollPercentage: 0,
  position: { x: 0, y: 0 },
  canMove: false,
});
const updateScrollbarPosition = () => {
  console.log('resizing');
  state.position = getElementPosition(scrollbarRef.value!);
};

onMounted(() => {
  updateScrollbarPosition();
  syncCanMove();
  window.addEventListener('resize', updateScrollbarPosition);
  window.addEventListener('resize', syncCanMove);
});

const syncCanMove = () => {
  state.canMove = mapListRef.value!.clientHeight > mapViewRef.value!.clientHeight;
};

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollbarPosition);
  window.removeEventListener('resize', syncCanMove);
});

const startDrag = () => {
  state.dragging = true;
};
const stopDrag = () => {
  state.dragging = false;
};
const onDrag = (e: MouseEvent) => {
  if (!state.dragging || !state.canMove) {
    return;
  }

  const positionInScrollbar = e.clientY - state.position.y;
  if (positionInScrollbar < 0) {
    state.scrollPercentage = 0;
  } else if (positionInScrollbar > scrollbarRef.value!.clientHeight) {
    state.scrollPercentage = 100;
  } else {
    state.scrollPercentage = (positionInScrollbar / scrollbarRef.value!.clientHeight) * 100 - 1;
  }
};

const onScroll = (e: WheelEvent) => {
  if (!state.canMove) {
    return;
  }
  const height = mapListRef.value!.clientHeight - mapViewRef.value!.clientHeight;
  const currentPercentage = (((height * state.scrollPercentage) / 100 + e.deltaY) * 100) / height;
  if (currentPercentage < 0) {
    state.scrollPercentage = 0;
  } else if (currentPercentage > 100) {
    state.scrollPercentage = 100;
  } else {
    state.scrollPercentage = currentPercentage;
  }
};
</script>

<template>
  <div class="map-list-root flex flex-col">
    <div class="flex mode-filter">
      模式类型:
      <dropdown-selector :candidates="mapSetStore.state.modes.map(mode => ({ display: mode, value: mode }))"
        :value="mapSetStore.state.modes[0]" />
    </div>
    <div class="map-list-container flex" @wheel="onScroll">
      <div class="map-list flex flex-col">
        <div ref="mapViewRef">
          <div class="map-list-content" ref="mapListRef" :style="{ top: `-${state.scrollPercentage}%` }">
            <map-item v-for="(map, i) in mapSetStore.state.mapSets" :key="i" :map="map"
              @select="$emit('setSelectedIndex', i)"></map-item>
          </div>
        </div>
      </div>
      <div class="map-scrollbar" ref="scrollbarRef" @mouseup="stopDrag" @mouseleave="stopDrag">
        <img class="button" ref="scrollButtonRef" src="/game/scroll_button.png" draggable="false" @mousedown="startDrag"
          @mousemove="onDrag" :style="{ top: `${state.scrollPercentage}%` }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-list-root {
  width: 462px;
  align-items: center;
  padding: 40px;
}

.mode-filter {
  align-items: center;
  justify-content: center;
  font-family: '汉仪细等线';
  font-size: 20px;
  font-weight: bolder;
}

.map-list-container {
  flex: 1;
  width: 100%;
  height: 0;
}

.map-list {
  flex: 1;
  width: 100%;
  height: 100%;
  --map-box: url('/game/map/map_box.png');
  --map-box-bg: url('/game/map/map_box_bg.png');
  background-image: var(--map-box), var(--map-box-bg);
  background-size: 100% 100%;
  margin-right: 20px;
  clip-path: polygon(12% 1%, 1.2% 6%, 1.2% 99%, 88% 99.1%, 98.5% 93.9%, 98.5% 1%);
  align-items: center;
  padding: 12px;
}

.map-list>div {
  height: 100%;
  width: 100%;
  clip-path: polygon(10.2% 0%, 0 4.7%, 0 100%, 90.1% 100%, 100% 95.5%, 100% 0%);
}

.map-list-content {
  position: absolute;
  top: 0%;
}

.map-scrollbar {
  width: 20px;
  height: 100%;
  --bg-url: url('/game/scroll_bg.png');
  background-image: var(--bg-url);
  background-size: 100% 100%;
}

.map-scrollbar>.button {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  top: 0%;
}
</style>
