<script lang="tsx" setup>
import { CyDropdownSelector } from '@cylearun/components';
import { defineComponent, ref, PropType, reactive, computed } from 'vue';
import { BotDifficulties } from '@/game/player-type';
import type { GameSide } from '@/game/side';
import { VBinder, VFollower, VTarget } from 'vueuc';
import SideCharacteristicStyle from './side-characteristic.module.css';
import { useSkirmish } from '@/stores/skirmish';

const skirmish = useSkirmish();
const player = computed(() => skirmish.players[props.playerIndex]);

const props = defineProps({
  playerIndex: {
    type: Number,
    required: true,
  },
  closeView: {
    type: Function as PropType<() => void>,
    required: true,
  },
});

const state = reactive({
  currentSide: player.value.info.side ?? 'random',
});

const difficultyCandidate = Object.entries(BotDifficulties).map(([difficulty, name]) => ({
  display: `难度：${name}`,
  value: difficulty,
}));

const selectSide = (side: GameSide) => {
  state.currentSide = side;
};

const commitSide = (side: GameSide = state.currentSide) => {
  player.value.info.side = side;
  props.closeView();
};

const SideCharacteristic = defineComponent({
  name: 'side-characteristic',
  props: {
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const show = ref(false);
    return () => {
      return (
        <VBinder>
          {{
            default: () => [
              <VTarget>
                {{
                  default: () => (
                    <img
                      class={SideCharacteristicStyle.sideCharacteristic}
                      src={props.image}
                      draggable='false'
                      onMouseenter={() => {
                        show.value = true;
                      }}
                      onMouseleave={() => (show.value = false)}
                    />
                  ),
                }}
              </VTarget>,
              <VFollower show={show.value}>
                {{
                  default: () => (
                    <div
                      style={{ display: show.value ? 'block' : 'none' }}
                      class={SideCharacteristicStyle.sideCharacteristicHoverBox}
                    >
                      {props.description}
                    </div>
                  ),
                }}
              </VFollower>,
            ],
          }}
        </VBinder>
      );
    };
  },
});

const bygoneSides = ['allied', 'soviet', 'yuri', 'echo', 'russian', 'isaiah'] as const;
const futureSidesA = ['fue', 'ranger', 'pioneer'] as const;
const futureSidesB = ['republic', 'gemoor'] as const;
</script>

<template>
  <div class="side-select-view-root flex flex-col">
    <div class="flex">
      <div class="flex side-area">
        <div class="flex flex-col bygone-side-container">
          <div class="flex flex-col">
            <div class="title flex">
              <div class="zh">旧世代阵营</div>
              <div class="en">Bygone</div>
            </div>
            <div class="bygone-side-box">
              <img v-for="gameSide in bygoneSides" :key="gameSide" :src="`/game/sides/${gameSide}.png`"
                :class="gameSide === state.currentSide ? ['selected-side'] : ''" draggable="false"
                @click="selectSide(gameSide)" />
            </div>
          </div>
          <div v-if="player.type === 'bot'" class="ai-character-selector-area flex">
            <cy-dropdown-selector v-model:value="player.info.difficulty" :candidates="difficultyCandidate" />
            <cy-dropdown-selector v-model:value="player.info.style"
              :candidates="[{ display: '随机战斗风格', value: 'random' }]" />
          </div>
        </div>
        <div class="flex flex-col future-side-container">
          <div class="title flex">
            <div class="zh">新世代阵营</div>
            <div class="en">Future</div>
          </div>
          <div class="future-side-box flex">
            <div class="flex">
              <img v-for="gameSide in futureSidesA" :key="gameSide" :src="`/game/sides/${gameSide}.png`" draggable="false"
                :class="state.currentSide === gameSide ? ['selected-side'] : ''" @click="selectSide(gameSide)" />
            </div>
            <img v-for="gameSide in futureSidesB" :key="gameSide" :src="`/game/sides/${gameSide}.png`" draggable="false"
              :class="state.currentSide === gameSide ? ['selected-side'] : ''" @click="selectSide(gameSide)" />
          </div>
        </div>
      </div>
    </div>
    <div class="desc-area flex">
      <div class="tag-area">
        “呜↗ ↗ ↗ ↗（战 术 前
        摇）太好听了吧！你唱歌真的好好听啊，简直就是天籁！我刚才，听到你唱歌了（你刚才，唱歌了罢）。我们以后一起唱好不好？一起唱！一起做学园偶像！”<br />
        “为什么要跑嘛？人家只是想和你一起做学园偶像而已呀！和我一起做学园偶像好不好嘛！”<br />
        “你快点掐（亲）一下可可的脸啊！”<br />
        “真爱，这是真爱啊！”<br />
        “嘿，哟，切克闹，唐可可我最闪耀，煎饼果子来一套，坚持练习不迟到，动次打次药！”[4] “真的假的！”
        “是雪（嗜血）！”<br />
      </div>
      <div class="tag-area flex">
        <div class="side-characteristic-box">
          <side-characteristic image="/game/sides/tmp_side_char.png"
            :description="'为什么要跑嘛？人家只是想和你一起做学园偶像而已呀！和我一起做学园偶像好不好嘛！'" v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            :key="i" />
        </div>
      </div>
      <div class="button-area flex flex-col">
        <button class="flex flex-col" @click="commitSide('random')">
          <div class="zh">随机</div>
          <div class="en">RANDOM</div>
        </button>

        <button class="flex flex-col" @click="commitSide('observer')">
          <div class="zh">观察者</div>
          <div class="en">OBSERVER</div>
        </button>

        <button class="flex flex-col" @click="commitSide()">
          <div class="zh">选择</div>
          <div class="en">SELECT</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-select-view-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 100;
  --side-unselected-opacity: 0.7;
  --side-selected-opacity: 1;
}

.selected-side {
  opacity: var(--side-selected-opacity) !important;
}

.side-area {
  width: 100%;
  height: calc(100vh - 260px);
}

.title {
  opacity: 0.85;
  justify-content: center;
  margin: 24px;
}

.title .zh {
  font-size: 24px;
  margin-right: 4px;
}

.title .en {
  font-size: 16px;
}

.title .en::first-letter {
  font-size: 24px;
}

.bygone-side-container {
  width: 50%;
}

.bygone-side-box {
  width: 65%;
  align-self: center;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bygone-side-box>img {
  width: 32%;
  opacity: var(--side-unselected-opacity);
  cursor: pointer;
}

.ai-character-selector-area {
  width: 100%;
  justify-content: center;
  margin-top: 12px;
}

.future-side-container {
  width: 50%;
}

.future-side-box {
  width: 80%;
  flex-wrap: wrap;
  justify-content: center;
  align-self: center;
  gap: 32px;
  background-image: url('/game/sides/future_bg.png');
  background-size: 100% 100%;
  align-self: flex-start;
}

.future-side-box>div {
  width: 100%;
  gap: 32px;
}

.future-side-box img {
  width: 31%;
  cursor: pointer;
  opacity: var(--side-unselected-opacity);
}

.future-side-box img:hover {
  background-image: radial-gradient(circle, rgba(57, 190, 241, 0.5), transparent 50%);
}

.desc-area {
  width: 100%;
  justify-content: space-evenly;
  margin: -20px 40px;
}

.tag-area {
  width: 35%;
  background-image: url('/basic/test_box.png');
  background-size: 100% 100%;
  padding: 20px;
  color: rgb(134, 200, 217);
  font-size: 18px;
  font-family: '汉仪细等线';
}

.side-characteristic-box {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-items: center;
  align-items: center;
  align-self: flex-start;
}

.button-area {
  width: 190px;
}

.button-area>button {
  height: 69px;
  background-image: url('/game/start.png');
  background-size: 100% 100%;
  margin: 10px 0;
  background-color: transparent;
  border-width: 0;
  color: rgb(134, 200, 217);
  justify-content: center;
  cursor: pointer;
}

.button-area>button>div {
  text-align: center;
  width: 100%;
}

.button-area>button>.zh {
  font-size: 28px;
}

.button-area>button>.en {
  font-family: '汉仪细等线';
  font-weight: bolder;
  font-size: 24px;
  letter-spacing: 4px;
}
</style>
