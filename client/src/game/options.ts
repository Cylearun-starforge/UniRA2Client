type GameOptionDefine<Value> = {
  value: Value;
  disabled: boolean;
  /** spawn.ini option key */
  key: string;

  /** Do not write into spawn.ini */
  ignore?: boolean;
};

export const GameFpsSettings = {
  30: "正常",
  60: "快",
};

export type GameFps = keyof typeof GameFpsSettings;

export const GameTimeSettings = {
  "10:00": "默认",
};

export type GameTime = keyof typeof GameTimeSettings;

export const GameFundOptions = [
  10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
] as const;
export type GameFund = typeof GameFundOptions[number];

export interface GameOptions {
  crate: GameOptionDefine<boolean>;
  fastGame: GameOptionDefine<boolean>;
  radar: GameOptionDefine<boolean>;
  allyInGame: GameOptionDefine<boolean>;
  buildOnAlly: GameOptionDefine<boolean>;
  autoRepair: GameOptionDefine<boolean>;
  multiEngineer: GameOptionDefine<boolean>;
  warFog: GameOptionDefine<boolean>;
  hideLocation: GameOptionDefine<boolean>;
  dayNight: GameOptionDefine<boolean>;
  fund: GameOptionDefine<GameFund>;
  unit: GameOptionDefine<number>;
  fps: GameOptionDefine<GameFps>;
  time: GameOptionDefine<GameTime>;
  extremeWeather: GameOptionDefine<boolean>;
}

export const GameOptionLabels: Record<keyof GameOptions, string> = {
  crate: "随机工具箱",
  fastGame: "快速游戏",
  radar: "永久小地图",
  allyInGame: "允许游戏内结盟",
  buildOnAlly: "允许盟友基地旁建设",
  autoRepair: "自动维修",
  multiEngineer: "多位工程师",
  warFog: "可恢复战争迷雾",
  hideLocation: "隐藏载入初始位置",
  dayNight: "启用昼夜更替",
  fund: "初始资金",
  unit: "初始单位数",
  fps: "游戏速度",
  time: "战场时间",
  extremeWeather: "极端天气",
};

export const GameModes = ["标准对战[传统]"] as const;

export type GameMode = typeof GameModes[number];

class StandardGameOptions implements GameOptions {
  crate = {
    value: false,
    disabled: false,
    key: "Crates",
  };
  fastGame = {
    value: true,
    disabled: false,
    key: "ShortGame",
  };
  radar = {
    value: false,
    disabled: false,
    key: "FreeRadar",
  };
  allyInGame = {
    value: true,
    disabled: true,
    key: "AlliesAllowed",
  };
  buildOnAlly = {
    value: true,
    disabled: true,
    key: "BuildOffAlly",
  };
  autoRepair = {
    value: false,
    disabled: false,
    key: "BuildOffAlly",
    ignore: true,
  };
  multiEngineer = {
    value: false,
    disabled: false,
    key: "BuildOffAlly",
    ignore: true,
  };
  warFog = {
    value: false,
    disabled: false,
    key: "BuildOffAlly",
    ignore: true,
  };
  hideLocation = {
    value: false,
    disabled: false,
    key: "NoSpawnPreviews",
  };
  dayNight = {
    value: false,
    disabled: false,
    key: "BuildOffAlly",
    ignore: true,
  };
  fund: GameOptionDefine<GameFund> = {
    value: 10000,
    disabled: false,
    key: "Credits",
  };
  unit = {
    value: 0,
    disabled: false,
    key: "UnitCount",
  };
  fps: GameOptionDefine<GameFps> = {
    value: 30,
    disabled: false,
    key: "GameSpeed",
  };
  time: GameOptionDefine<GameTime> = {
    value: "10:00",
    disabled: false,
    key: "CombatTime",
    ignore: true,
  };
  extremeWeather = {
    value: false,
    disabled: false,
    key: "BuildOffAlly",
    ignore: true,
  };
}

export const GameOptionConstructor: Record<GameMode, { new (): GameOptions }> =
  {
    "标准对战[传统]": StandardGameOptions,
  };
