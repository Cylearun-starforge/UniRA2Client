import { GameTeamType } from '../constants';
import { GameConfig } from '../config';

/** @public */
export interface BasePlayerOptions {
  /** Spawn location of the player */
  location: number;

  side: number;

  color: number;

  team?: GameTeamType;
}

/**
 * @public
 *
 * Represents a human/AI player
 **/
export abstract class BasePlayer {
  public options: BasePlayerOptions;
  public abstract type: 'AI' | 'HUMAN';

  public isCurrentUser: boolean;
  public playerIndex: number;
  public get playerTag() {
    return `Multi${this.playerIndex + 1}`;
  }

  public get AllianceTag() {
    return `${this.playerTag}_Alliances`;
  }

  constructor(options: BasePlayerOptions) {
    this.options = options;
    this.isCurrentUser = false;
    this.playerIndex = -1;
  }

  public mergeToConfig(config: GameConfig) {
    const playerTag = this.playerTag;
    if (this.isCurrentUser) {
      return config.addConfigTo(
        'Settings',
        { type: 'string', key: 'Side', value: this.options.side },
        { type: 'string', key: 'Color', value: this.options.color }
      );
    }
    return config
      .addConfigTo('HouseCountries', { type: 'string', key: playerTag, value: this.options.side })
      .addConfigTo('HouseColors', { type: 'string', key: playerTag, value: this.options.color })
      .addConfigTo('SpawnLocations', { type: 'string', key: playerTag, value: this.options.location });
  }
}
