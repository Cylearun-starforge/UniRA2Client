import { defineStore } from "pinia";
import { Player } from "@/game/player-type";
import { GameOptionConstructor } from "@/game/options";
import { useGameMaps } from "./game-maps";
import { useMapSets } from "./game-mode";
import { usePlayer } from "./player";
import { GameMap } from "@/game/map";
import { BizError } from "@/error/biz-error";

export const useSkirmish = defineStore("skirmish", {
  state: () => {
    const players: Player[] = [usePlayer().player];
    const mapSets = useMapSets();
    const list = mapSets.state.mapSets;
    return {
      players,
      maxPlayers: 8,
      options: new GameOptionConstructor["标准对战[传统]"](),
      selectingSide: false,
      selectedMapIndex: 0,
      currentMap: list[0]
    };
  },
  actions: {
    setMapIndex(index: number) {
      const mapSets = useMapSets();
      const list = mapSets.state.mapSets;
      if (index < 0 || list.length <= index) {
        throw new BizError("Index out of range");
      }
      this.selectedMapIndex = index;
      this.currentMap = list[index];
    },
  },
});
