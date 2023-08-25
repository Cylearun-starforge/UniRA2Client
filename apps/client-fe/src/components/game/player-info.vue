<script lang="ts" setup>
import { BotDifficulties, BotStyles } from '@/game/player-type';
import { GameSideNames } from '@/game/side';
import { computed, reactive } from 'vue';
import SideSelectView from '@/components/game/side-select-view.vue';
import { useSkirmish } from '@/stores/skirmish';
import ImgP from '@/components/auto-image.vue';
const skirmish = useSkirmish();

const props = defineProps({
  playerIndex: {
    type: Number,

  },
});

const player = computed(() => skirmish.players[props.playerIndex!]);

const state = reactive({
  openSideSelector: false,
});

const bosCombatStyles = Object.entries(BotStyles).map(([key, value]) => ({
  display: value,
  value: key,
}));

const hasPlayer = computed(() => player.value.type !== 'empty');

const playerAvatar = computed(() => {
  if (player.value.type === 'empty') {
    return '';
  }

  if (player.value.type === 'human') {
    return player.value.info.avatar;
  }

  return '/user/avatar_ai.png';
});

const playerAvatarBox = computed(() => {
  if (player.value.type === 'empty') {
    return '/user/box.png';
  }

  if (player.value.type === 'human') {
    return player.value.info.avatarBox;
  }

  return '/user/box.png';
});

const playerCard = computed(() => {
  if (player.value.type === 'empty') {
    return '';
  }

  if (player.value.type === 'human') {
    return player.value.info.card;
  }

  return '/user/info_card_ai.png';
});

const playerLevel = computed(() => {
  if (player.value.type === 'human') {
    return player.value.info.level;
  }

  return null;
});

const playerName = computed(() => {
  if (player.value.type === 'empty') {
    return '空位';
  }

  if (player.value.type === 'human') {
    return player.value.info.username;
  }

  return BotDifficulties[player.value.info.difficulty] + '的敌人';
});

const playerTeamTag = computed(() => {
  if (player.value.type === 'empty') {
    return '';
  }

  return `/game/team${player.value.info.team}.png`;
});

const sideImage = computed(() => {
  if (player.value.type === 'empty') {
    return '/game/side_random.png';
  }
  switch (player.value.info.side) {
    case 'fue':
      return '/game/side_fue.png';
    case 'allied':
      return '/game/side_allied.png';
    default:
      return '/game/side_random.png';
  }
});
</script>

<template>
  <teleport to="body" v-if="state.openSideSelector">
    <side-select-view :player-index="playerIndex ?? 0" :close-view="() => {
        state.openSideSelector = false;
      }
      " />
  </teleport>
  <div class="player-info-root">
    <img-p v-if="hasPlayer" :src="playerAvatar" class="player-avatar"
      :style="{ backgroundImage: `url('${playerAvatarBox}')` }" draggable="false" />
    <div v-else class="player-avatar" :style="{ backgroundImage: `url('${playerAvatarBox}')` }"></div>
    <img-p v-if="player.type === 'bot'" src="/game/bot_tag.png" class="tag" style="left: 14px" draggable="false" />
    <img-p v-if="hasPlayer" :src="playerTeamTag" class="tag" style="left: 210px" draggable="false" />
    <div class="player-info-container flex">
      <div class="player-card">
        <img-p v-if="hasPlayer" :src="playerCard" draggable="false" />
        <div class="info zh">
          <div :class="`name ${!hasPlayer ? 'name-empty' : ' '}`">{{ playerName }}</div>
          <div v-if="player.type === 'human'">{{ player.info.group ?? '<无战队>' }}</div>
          <div v-if="player.type === 'human'">{{ player.info.title ?? '<测试称号>' }}</div>
          <dropdown-selector v-if="player.type === 'bot'"
            :style="{ width: '100%', height: '50%', color: 'rgba(255, 255, 255, 0.7)' }" :candidates="bosCombatStyles"
            v-model:value="player.info.style" />
        </div>
      </div>
      <div class="side-card" @click="state.openSideSelector = true">
        <img-p :src="sideImage" draggable="false" />
        <div class="info">
          <div class="zh">{{ GameSideNames[player.info.side].zh }}</div>
          <div class="en">{{ GameSideNames[player.info.side].en }}</div>
        </div>
        <div v-if="player.type !== 'empty'" class="right-selector-box flex flex-col">
          <div>
            <div class="selector-num">{{ player.info.location }}</div>
          </div>
          <div>
            <div :style="{ backgroundColor: player.info.color }"></div>
          </div>
        </div>
      </div>
      <div class="level-box">
        <img-p v-if="playerLevel !== null" :src="playerLevel" draggable="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-info-root {
  width: 462px;
  height: 86.75px;
}

.player-avatar {
  width: 86.75px;
  height: 86.75px;
  padding: 11px;
  background-size: cover;
  z-index: 10;
}

.player-info-container {
  position: absolute;
  left: 68px;
  top: 0;
  width: calc(100% - 68px);
  height: 100%;
  align-items: center;
}

.tag {
  position: absolute;
  width: 22.68px;
  height: 40px;
  z-index: 10;
}

.player-card {
  background-image: url('/user/info_card_box.png');
  background-size: 100% 100%;
  width: 196.67px;
  height: 76px;
}

.player-card>.info {
  width: 100%;
  height: 100%;
  padding: 4px 28px 4px 16px;
}

.player-card>.info>.name {
  font-size: 20px;
}

.player-card>.info>.name-empty {
  opacity: 0.7;
}

.player-card>.info>div {
  font-size: 16px;
  margin: 4px auto;
}

.player-card>img,
.side-card>img {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 8px;
}

.side-card {
  background-image: url('/game/side_box.png');
  background-size: 100% 100%;
  width: 196.67px;
  height: 76px;
  cursor: pointer;
}

.side-card>.info {
  width: 100%;
  height: 50%;
  transform: translateY(30px);
  padding: 0 8px 0 30px;
}

.side-card>.info>div {
  font-size: 18px;
}

.side-card>.info>.en {
  font-size: 20px;
}

.level-box {
  background-image: url('/user/level_box.png');
  background-size: 100% 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 56px;
  height: 56px;
  transform: translate(-50%, -50%);
}

.level-box>img {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 8px;
}

.right-selector-box {
  width: 30px;
  height: 60px;
  position: absolute;
  right: 12px;
  top: 8px;
}

.right-selector-box>div {
  background-image: url('/game/right_selector_box.png');
  background-size: 100% 100%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-selector-box>div>div {
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.7);
}

.selector-num {
  font-size: 20px;
  font-family: auto;
  text-align: center;
}
</style>
