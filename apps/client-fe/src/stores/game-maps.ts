import { GameMap } from '@/game/map';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useGameMaps = defineStore('gameMaps', () => {
  const maps = reactive<GameMap[]>([]);
  

  return {
    maps,
  };
});
