export const GameSideNames = {
  random: {
    zh: '随机',
    en: 'RANDOM',
  },
  fue: {
    zh: '地球联合理事会',
    en: 'F.U.E',
  },
  allied: {
    zh: '盟军',
    en: 'ALLIED FORCES',
  },
  echo: {
    zh: '回声组织',
    en: 'ECHO',
  },
  gemoor: {
    zh: '虫群',
    en: 'GEMOOR',
  },
  isaiah: {
    zh: '暗夜教会',
    en: 'ISAIAH',
  },
  pioneer: {
    zh: '先驱者',
    en: 'PIONEER',
  },
  ranger: {
    zh: '游骑兵',
    en: 'RANGER',
  },
  republic: {
    zh: '共和国',
    en: 'REPUBLIC',
  },
  russian: {
    zh: '俄罗斯联邦',
    en: 'RUSSIAN FEDERATION',
  },
  soviet: {
    zh: '苏联',
    en: 'SOVIET UNION',
  },
  yuri: {
    zh: '尤里',
    en: 'YURI',
  },
  observer: {
    zh: '观察者',
    en: 'OBSERVER',
  },
} as const;

export type GameSide = keyof typeof GameSideNames;
