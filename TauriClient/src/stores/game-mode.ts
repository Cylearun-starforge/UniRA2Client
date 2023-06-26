import { BizError } from "@/error/biz-error";
import type { GameMap } from "@/game/map";
import { whenever } from "@vueuse/core";
import { defineStore } from "pinia";
import { onMounted, reactive, ref, watch } from "vue";

export const useMapSets = defineStore("mapSets", () => {
  const state = reactive({
    mapSets: [] as GameMap[],
    ready: false,
    modes: [] as string[],
    modeIndex: 0,
  });

  const loadMapSets = async () => {
    state.ready = true;
  };

  const setMode = async (index: number) => {
    if (index < 0 || state.modes.length <= index) {
      throw new BizError("Index out of range");
    }

    state.modeIndex = index;
    state.mapSets = [];
  };

  return {
    state,
    loadMapSets,
    setMode,
  };
});
