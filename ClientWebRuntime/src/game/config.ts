import { ArgumentError } from '@/error/argument-error';
import { GameOption } from './option';
import { BasePlayer } from './player/base-player';
import { HumanPlayer } from './player/human-player';

/**
 * @public
 *
 * Configuration for spawn.ini
 * */
export class GameConfig {
  public static MAX_PLAYER_COUNT = 8 as const;
  public static MIN_PLAYER_COUNT = 1 as const;

  public constructor(
    /**
     * Each key represents a ini section name, and its values are key-value pairs of this section
     */
    public readonly record: Record<string, GameOption[]> = {},
    public readonly teamRecord: Record<string, BasePlayer[]> = {}
  ) {}

  public addConfigTo(section: string, ...config: GameOption[]) {
    if (!this.record[section]) {
      this.record[section] = [];
    }

    this.record[section].push(...config);
    return this;
  }

  private addTeamRecord(player: BasePlayer) {
    if (!player.options.team) {
      return;
    }
    const record = this.teamRecord[player.options.team] ?? [];
    record.push(player);
    this.teamRecord[player.options.team] = record;
  }

  public addPlayers(players: BasePlayer[]) {
    if (players.length < GameConfig.MIN_PLAYER_COUNT || GameConfig.MAX_PLAYER_COUNT < players.length) {
      throw new ArgumentError('players');
    }

    const ctx = {
      human: 0,
      team: {
        A: [] as BasePlayer[],
        B: [] as BasePlayer[],
        C: [] as BasePlayer[],
        D: [] as BasePlayer[],
      },
    };
    players.forEach((player, index) => {
      player.playerIndex = index;
      if (player instanceof HumanPlayer) {
        player.humanPlayerIndex = ctx.human;
      }

      player.mergeToConfig(this);
      ctx.team[player.options.team!].push(player);
    });

    this.addConfigTo(
      'Settings',
      { key: 'PlayerCount', type: 'string', value: ctx.human },
      { key: 'AIPlayers', type: 'string', value: players.length - ctx.human }
    );

    Object.values(ctx.team).forEach(team => {
      team.forEach(currentPlayer => {
        const others = team.filter(player => player !== currentPlayer);
        const allyCount = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
        const options = others.map<GameOption>((player, index) => ({
          type: 'string',
          key: `HouseAlly${allyCount[index]}`,
          value: player.playerIndex,
        }));
        this.addConfigTo(currentPlayer.AllianceTag, ...options);
      });
    });
  }

  // private addPlayerConfig(player: BasePlayer) {
  //   this.addTeamRecord(player);
  //   if (player.type === 'AI') {
  //     this.settingsInfo.ai++;
  //     player.playerTag = `Multi${this.settingsInfo.ai + 1}`;
  //   } else {
  //     this.settingsInfo.human++;
  //     player.playerTag = `Other${this.settingsInfo.ai + 1}`;
  //   }

  //   player.mergeToConfig(this);
  // }

  public addCurrentUserConfig(player: HumanPlayer) {
    this.addTeamRecord(player);
    player.isCurrentUser = true;
    player.mergeToConfig(this);
  }

  public serializeOptions() {
    const configSections = Object.entries(this.record).reduce<string[]>((sections, entry) => {
      const [key, options] = entry;
      const section = [`[${key}]`];
      options.forEach(option => {
        switch (option.type) {
          case 'boolean':
            section.push(`${option.key}=${option.value ? 'Yes' : 'No'}`);
            break;
          case 'string':
            section.push(`${option.key}=${option.value}`);
            break;
        }
      });

      sections.push(section.join('\n'));
      return sections;
    }, []);

    return configSections.join('\n\n');
  }
}
