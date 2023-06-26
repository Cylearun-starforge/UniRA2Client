<script lang="ts" setup>
import GameSwitch from './game-switch.vue';
import DropdownSelector from './dropdown-selector';
import {
  GameOptionLabels,
  GameTimeSettings,
  GameFpsSettings,
  GameOptions,
  GameFundOptions,
} from '@/game/options';
import { PropType } from 'vue';

const props = defineProps({
  options: {
    type: Object as PropType<GameOptions>,
    required: true,
  },
});
const emit = defineEmits(['update:options']);
const leftSideOptions = [
  'crate',
  'fastGame',
  'radar',
  'allyInGame',
  'buildOnAlly',
  'autoRepair',
  'multiEngineer',
  'warFog',
  'hideLocation',
  'dayNight',
] as const;

const updateField = <Key extends keyof GameOptions>(field: Key, value: GameOptions[Key]['value']) => {
  const options: GameOptions = {
    ...props.options,
    [field]: {
      value: value,
      disabled: props.options[field].disabled,
    },
  };
  emit('update:options', options);
};
</script>

<template>
  <div class="game-options-root flex">
    <div class="flex flex-col">
      <game-switch
        v-for="opt in leftSideOptions"
        class="game-switch"
        :key="opt"
        :checked="options[opt].value"
        @update:checked="updateField(opt, $event)"
        :disabled="options[opt].disabled"
        :text="GameOptionLabels[opt]"
      />
    </div>
    <div class="flex flex-col">
      <div class="flex">
        <div class="dropdown-desc">初始资金</div>
        <dropdown-selector
          :candidates="GameFundOptions.map(fund => ({ value: fund, display: `${fund}` }))"
          :value="options.fund.value"
          @update:value="updateField('fund', $event)"
        />
      </div>
      <div class="flex">
        <div class="dropdown-desc">初始单位数</div>
        <dropdown-selector
          :candidates="
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({
              display: `${n}`,
              value: n,
            }))
          "
          :value="options.unit.value"
          @update:value="updateField('unit', $event)"
        />
      </div>
      <div class="flex">
        <div class="dropdown-desc">游戏速度</div>
        <dropdown-selector
          :candidates="
            Object.entries(GameFpsSettings).map(([key, value]) => ({
              display: `${value}(${key}FPS)`,
              value: parseInt(key, 10),
            }))
          "
          :value="options.fps.value"
          @update:value="updateField('fps', $event)"
        />
      </div>
      <div class="flex">
        <div class="dropdown-desc">战场时间</div>
        <dropdown-selector
          :candidates="
            Object.entries(GameTimeSettings).map(([key, value]) => ({
              display: `${value}(${key})`,
              value: options.time.value,
            }))
          "
          :value="options.time.value"
          @update:value="updateField('time', $event)"
        />
      </div>
      <div class="flex">
        <div class="dropdown-desc">极端天气</div>
        <dropdown-selector
          :candidates="[
            { display: '启用', value: true },
            { display: '不启用', value: false },
          ]"
          :value="options.extremeWeather.value"
          @update:value="updateField('extremeWeather', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-options-root {
  max-width: 500px;
  width: 75%;
  padding: 4px;
  height: 236.8px;
  columns: 2;
  color: rgb(134, 200, 217) !important;
}

.game-options-root > div {
  width: 50%;
}

.game-switch {
  margin-bottom: 4px;
}

.dropdown-desc {
  word-break: keep-all;
  display: flex;
  align-items: center;
  width: 55%;
}
</style>
