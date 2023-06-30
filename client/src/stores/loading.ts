import { GameMap } from "@/game/map";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { useMapSets } from "./game-mode";

export const useLoadingStore = defineStore("loading", {
  state() {
    return {
      loading: true,
    };
  },
  actions: {
    async apiLoaded() {
      let setApiLoaded: () => void;
      const apiLoaded = new Promise<void>((resolve) => {
        setApiLoaded = resolve;
      });
      let checkApiTimer: NodeJS.Timer;

      const checkApi = () => {
        try {
          return Boolean(UniRA2Api);
        } catch {
          return false;
        }
      };

      checkApiTimer = setInterval(() => {
        const loaded = checkApi();
        if (!loaded) {
          return;
        }

        setApiLoaded();
        clearInterval(checkApiTimer);
      }, 1000);

      return apiLoaded;
    },
    async initialize() {
      await this.apiLoaded();
      const mapSetStore = useMapSets();
      await mapSetStore.loadMapSets();
      this.loading = false;
    },
  },
});
