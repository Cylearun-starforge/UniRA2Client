<script lang="ts" setup>
import AlphaButton from '@/components/alpha-button.vue';
import { useMapSets } from '@/stores/game-mode';

const mapSetStore = useMapSets();

defineEmits({
  click1(e: MouseEvent) {
    return true;
  },
  click2(e: MouseEvent) {
    return true;
  },
});

defineProps({
  topTextZh: {
    type: String,
    required: true,
  },
  topTextEn: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="skirmish-right-info-root flex flex-col">
    <alpha-button background="/game/change_map_bg.png" class="change-map-button" @click="e => $emit('click1', e)">
      <img src="/game/change_map.png" />
      <div class="content flex flex-col">
        <div class="en">{{ topTextEn }}</div>
        <div class="zh">{{ topTextZh }}</div>
      </div>
    </alpha-button>
    <div class="mode-tag-container flex flex-col">
      <div>
        <div class="text">当前模式:</div>
      </div>
      <div>
        <div class="mode-tag">{{ mapSetStore.state.modes[mapSetStore.state.modeIndex] }}</div>
      </div>
    </div>
    <alpha-button background="/game/satellite_bg.png" class="satellite-button" @click="e => $emit('click2', e)" disabled>
      <img src="/game/satellite.png" />
      <div class="content flex flex-col">
        <div class="zh">战场情报</div>
        <div class="en">SATELLITE.INT</div>
      </div>
    </alpha-button>
  </div>
</template>

<style scoped>
.skirmish-right-info-root {
  width: 172px;
  height: 100%;
  padding-left: 12px;
}

button {
  color: rgb(134, 200, 217);
  text-align: left;
}

.skirmish-right-info-root .zh {
  font-family: '汉仪细等线';
  font-weight: bolder;
}

.change-map-button {
  width: 128px;
  height: 156px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-size: 90% 90%;
  background-position: center;
}

.change-map-button>.content {
  width: calc(100% - 14px);
  height: calc(100% - 14px);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  justify-content: flex-end;
  padding: 0 0 8px 4px;
}

.satellite-button {
  width: 128px;
  height: 120px;
  background-size: 90% 90%;
  background-repeat: no-repeat;
  background-position: center;
}

.change-map-button>img,
.satellite-button>img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.change-map-button:hover,
.satellite-button:hover {
  cursor: pointer;
}

.satellite-button>.content {
  width: calc(100% - 14px);
  height: calc(100% - 14px);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 8px 0 0 4px;
}

.change-map-button .zh,
.satellite-button .zh {
  font-size: 20px;
}

.mode-tag-container {
  width: 100%;
  height: 84px;
  margin: 4px 0;
  font-size: 20px;
  justify-content: space-evenly;
  --tag-gradient: linear-gradient(to left, rgba(3, 98, 161, 0.48) 0 35%, transparent);
}

.mode-tag-container>div {
  width: 100%;
  background-image: linear-gradient(to left, rgba(3, 98, 161, 0.48) 0 35%, transparent);
  padding: 2px 0;
}

.mode-tag-container .text {
  padding: 4px 0;
  font-family: '汉仪细等线';
  font-weight: bolder;
  background-image: var(--tag-gradient);
}

.mode-tag-container .mode-tag {
  color: white;
  font-family: '汉仪细等线';
  font-size: 22px;
  padding: 8px 0;
  font-weight: bolder;
  background-image: var(--tag-gradient);
}
</style>
