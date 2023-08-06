import { defineStore } from "pinia";
import { ref } from "vue";
import { Map } from "@/types/dto";
import { useApiStore } from "./api-store";

export const useMapStore = defineStore("mapStore", () => {
  const apiStore = useApiStore();
  const result: Record<string, Map[]> = {};
  apiStore.maps.forEach((map) => {
    map.modes.forEach((mode) => {
      if (!result[mode.mode_name]) {
        result[mode.mode_name] = [map];
      } else {
        result[mode.mode_name].push(map);
      }
    });
  });
  const mapByModes = ref<Record<string, Map[]>>(result);
  return { mapByModes };
});
