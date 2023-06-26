import { GameSide } from './side';
export type HumanPlayer = {
  username: string;
  level: string;
  avatar: string;
  avatarBox: string;
  card: string;
  group?: string;
  title?: string;
};

export const BotDifficulties = {
  easy: '简单',
  medium: '中等',
  hard: '冷酷',
} as const;

type BotPlayerDifficulty = keyof typeof BotDifficulties;

export const BotStyles = {
  random: '随机战斗风格',
} as const;

export type BotPlayerStyle = keyof typeof BotStyles;

export type BotPlayer = {
  difficulty: BotPlayerDifficulty;
  style: BotPlayerStyle;
};

export type PlayerInfo = HumanPlayer | BotPlayer;
export type PlayerTeam = 'A' | 'B' | 'C' | 'D';
export type PlayerLocation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type GenericPlayer<PlayerType> = PlayerType & {
  team: PlayerTeam;
  location: PlayerLocation;
  color: string;
  side: GameSide;
};

export type Player =
  | {
      type: 'human';
      info: GenericPlayer<HumanPlayer>;
    }
  | {
      type: 'bot';
      info: GenericPlayer<BotPlayer>;
    }
  | {
      type: 'empty';
      info: {
        side: 'random';
      };
    };

export type PlayerType = Player['type'];
