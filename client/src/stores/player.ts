import { defineStore } from "pinia";
import { Player } from "@/game/player-type";
import { GameOptionConstructor } from "@/game/options";
import { useGameMaps } from "./game-maps";
import { useMapSets } from "./game-mode";
import { useStorage } from "@vueuse/core";

export const usePlayer = defineStore("player", {
  state: () => {
    const player = useStorage<Player>("current-player", {
      type: "human",
      info: {
        avatar: "/user/avatar.png",
        avatarBox: "/user/box.png",
        card: "/user/info_card.png",
        level: "/user/level.png",
        username: "用户名test",
        color: "#0096C3",
        location: 1,
        side: "fue",
        team: "A",
      },
    });
    return {
      player: player.value,
    };
  },
});
