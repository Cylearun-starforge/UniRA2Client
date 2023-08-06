import { loadMaps } from "@/api";
import { Map } from "@/types/dto";
import { defineStore } from "pinia";
type ApiData<DataKey extends string, DataType> = {
  [k in DataKey]: DataType;
} & {
  [k in `${DataKey}_loaded`]: boolean;
};
function defineApiData<DataKey extends string, DataType>(
  key: DataKey,
  defaultValue: DataType
): ApiData<DataKey, DataType> {
  // @ts-ignore
  return {
    [key as DataKey]: defaultValue,
    [`${key}_loaded`]: false,
  };
}

export const useApiStore = defineStore("apiStore", {
  state: () => ({
    ...defineApiData("maps", [] as Map[]),
  }),
  actions: {
    async tryLoadMaps() {
      if (this.maps_loaded) {
        return;
      }

      this.maps = await loadMaps();
      this.maps_loaded = true;
    },
  },
});