import { defineStore } from "pinia";
import { Player } from "@/game/player-type";
import { GameOptionConstructor } from "@/game/options";
import { usePlayer } from "./player";
import { BizError } from "@/error/biz-error";
import { useMapStore } from "./map-store";
import { computed, reactive } from "vue";
import { useApiStore } from "./api-store";
import { Map } from "@/types/dto";

function takeDefaultMapList(mapByModes: Record<string, Map[]>) {
  const standardMaps = mapByModes.Standard;
  if (standardMaps) {
    return { mode: "Standard", maps: standardMaps };
  }

  const modes = Object.keys(mapByModes);
  if (modes.length === 0) {
    return null;
  }

  return {
    mode: modes[0],
    maps: mapByModes[modes[0]],
  };
}

export const useSkirmish = defineStore("skirmish", () => {
  const players: Player[] = [usePlayer().player];
  const mapStore = useMapStore();
  const mapSets = computed(() => {
    return takeDefaultMapList(mapStore.mapByModes);
  });

  const result = reactive({
    players,
    maxPlayers: 8,
    options: new GameOptionConstructor["标准对战[传统]"](),
    selectingSide: false,
    selectedMapIndex: 0,
    currentMap: mapSets.value?.maps?.[0],
    setMapIndex: (index: number) => {
      if (index < 0 || mapSets.value!.maps!.length <= index) {
        throw new BizError("Index out of range");
      }
      result.selectedMapIndex = index;
      result.currentMap = mapSets.value?.maps[index];
    },
    currentMode: mapSets.value?.mode,
    currentModeMaps: mapStore.mapByModes?.[mapSets.value!.mode],
  });

  return result;
});
