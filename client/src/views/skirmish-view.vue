<script setup lang="ts">
import SkirmishBackground from '@/components/skirmish/skirmish-background.vue';
import PlayerInfo from '@/components/game/player-info.vue';
import AddPlayerButton from '@/components/game/add-player-button.vue';
import BackButton from '@/components/back-button.vue';
import SkirmishRightInfo from '@/components/skirmish/skirmish-right-info.vue';
import MapPreview from '@/components/game/map-preview.vue';
import AlphaButton from '@/components/alpha-button.vue';
import GameOptions from '@/components/game/game-options.vue';
import { useSkirmish } from '@/stores/skirmish';
import SatelliteView from './map-preview-view.vue';
import MapSelectView from './map-select-view.vue';
import { reactive } from 'vue';
import { useMapStore } from '@/stores/map-store';

const state = useSkirmish();
const localState = reactive({
  previewingMap: false,
  changingMap: false,
});

function launchGame() {
  const options = Object.values(state.options).filter(option => !option.ignore).map(option => ({
    Key: option.key,
    Type: typeof option.value,
    Value: option.value
  }));
  console.log(JSON.stringify(options))
}



const addPlayer = () => {
  if (state.players.length < state.maxPlayers) {
    state.players.push({
      type: 'empty',
      info: {
        side: 'random',
      },
    });
  }
};
</script>
<template>
  <teleport to="body">
    <map-select-view v-if="localState.changingMap" @close="localState.changingMap = false"></map-select-view>
    <satellite-view v-if="localState.previewingMap" @close="localState.previewingMap = false"
      :map="state.currentMap"></satellite-view>
  </teleport>
  <skirmish-background />
  <div class="skirmish-view-root flex">
    <div>
      <!-- TODO: use user id instead of index -->
      <player-info v-for="(_, i) in state.players" :key="i" :player-index="i" />
      <add-player-button v-if="state.players.length < state.maxPlayers" @click="addPlayer" />
    </div>
    <div class="skirmish-map-container flex">
      <div class="map-preview-and-options flex flex-col">
        <map-preview :map="state.currentMap" v-if="state.currentMap" />
        <div class="game-options-container flex">
          <alpha-button background="/game/start.png" class="game-start-button" @click="launchGame">
            <div class="zh">开始游戏</div>
            <div class="en">-S-T-A-R-T-</div>
          </alpha-button>

          <game-options v-model:options="state.options" />
        </div>
      </div>
      <skirmish-right-info @click1="localState.changingMap = true" top-text-zh="更换地图" top-text-en="CHANGE MAP"
        @click2="localState.previewingMap = true" />
    </div>
  </div>
  <back-button class="back-button" />
</template>

<style scoped>
.skirmish-view-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  padding-right: 0;
  gap: 12px;
}

.skirmish-map-container {
  flex: 1;
}

.map-preview-and-options {
  flex: 1;
}

.game-options-container {
  width: 100%;
  justify-content: space-evenly;
}

.game-start-button {
  width: 190px;
  height: 69px;
  background-size: 100% 100%;
}

.game-start-button>div {
  color: rgb(134, 200, 217);
}

.game-start-button>.zh {
  font-size: 26px;
}

.game-start-button>.en {
  font-size: 22px;
}

.back-button {
  position: absolute;
  right: 12px;
  bottom: 12px;
}
</style>
