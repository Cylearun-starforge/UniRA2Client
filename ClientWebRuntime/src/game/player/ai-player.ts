import { BasePlayer, BasePlayerOptions } from './base-player';
import { GameConfig } from '../config';

/** @public */
export interface AiPlayerOptions extends BasePlayerOptions {
  difficulty: number;
}

/**
 * @public
 */
export class AiPlayer extends BasePlayer {
  public override type: 'AI';
  public override options: AiPlayerOptions;

  constructor(options: AiPlayerOptions) {
    super(options);
    this.type = 'AI';
    this.options = options;
  }

  public override mergeToConfig(config: GameConfig): GameConfig {
    const playerTag = this.playerTag;

    return config
      .addConfigTo('HouseCountries', { type: 'string', key: playerTag, value: this.options.side })
      .addConfigTo('HouseColors', { type: 'string', key: playerTag, value: this.options.color })
      .addConfigTo('SpawnLocations', { type: 'string', key: playerTag, value: this.options.location })
      .addConfigTo('HouseHandicaps', { type: 'string', key: playerTag, value: this.options.difficulty });
  }
}
