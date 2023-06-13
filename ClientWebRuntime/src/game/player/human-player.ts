import { BasePlayer, BasePlayerOptions } from './base-player';
import { GameConfig } from '../config';

/** @public */
export interface HumanPlayerOptions extends BasePlayerOptions {
  name: string;
}

/**
 * @public
 */
export class HumanPlayer extends BasePlayer {
  public override type: 'HUMAN';
  public override options: HumanPlayerOptions;
  // Thanks to WW's stupid design, we must use another index to mark human player
  public humanPlayerIndex: number;
  public get humanPlayerTag() {
    return `Other${this.humanPlayerIndex}`;
  }

  public get isSelf() {
    return this.humanPlayerIndex === 0;
  }

  constructor(options: HumanPlayerOptions) {
    super(options);
    this.type = 'HUMAN';
    this.options = options;
    this.humanPlayerIndex = -1;
  }

  public override mergeToConfig(config: GameConfig): GameConfig {
    if (this.isSelf) {
      return config
        .addConfigTo(
          'Settings',
          { type: 'string', key: 'Name', value: this.options.name },
          { type: 'string', key: 'Color', value: this.options.color },
          { type: 'string', key: 'Side', value: this.options.side }
        )
        .addConfigTo('SpawnLocations', { type: 'string', key: this.playerTag, value: this.options.location });
    }
    return config
      .addConfigTo(
        this.humanPlayerTag,
        { type: 'string', key: 'Name', value: this.options.name },
        { type: 'string', key: 'Color', value: this.options.color },
        { type: 'string', key: 'Side', value: this.options.side }
      )
      .addConfigTo('SpawnLocations', { type: 'string', key: this.playerTag, value: this.options.location });
  }
}
