import { defineStore } from "pinia";
import { Player } from "@/game/player-type";
import { GameOptionConstructor } from "@/game/options";
import { usePlayer } from "./player";
import { BizError } from "@/error/biz-error";
import { useMapStore } from "./map-store";
import { computed, reactive } from "vue";
import { useApiStore } from "./api-store";

export const useSkirmish = defineStore("skirmish", () => {
  const players: Player[] = [usePlayer().player];
  const mapStore = useMapStore();
  const apiStore = useApiStore();
  const mapSets = computed(() => {
    // return apiStore.maps;
    return mapStore.mapByModes.Standard;
  });

  const result = reactive({
    players,
    maxPlayers: 8,
    options: new GameOptionConstructor["标准对战[传统]"](),
    selectingSide: false,
    selectedMapIndex: 0,
    currentMap: mapSets.value?.[0],
    setMapIndex: (index: number) => {
      if (index < 0 || mapSets.value?.length <= index) {
        throw new BizError("Index out of range");
      }
      result.selectedMapIndex = index;
      result.currentMap = mapSets.value?.[index];
    },
  });

  return result;
});
