import { ArgumentError } from '@/error/argument-error';
import { describe, expect, it } from 'vitest';
import { GameConfig } from '../config';
import { AiPlayer } from '../player/ai-player';
import { HumanPlayer } from '../player/human-player';

describe('GameConfig', () => {
  it('should serialize GameOptions', () => {
    const config = new GameConfig();
    config.addConfigTo(
      'Testing',
      { type: 'string', value: 'string', key: 'TestString' },
      { type: 'string', value: 1, key: 'TestNumber' },
      { type: 'boolean', value: true, key: 'TestTrue' },
      { type: 'boolean', value: false, key: 'TestFalse' }
    );
    expect(config.record.Testing).toBeTypeOf('object');
    expect(config.record.Testing).toBeInstanceOf(Array);
    const ini = config.serializeOptions();
    expect(ini).includes('[Testing]');
    expect(ini).includes('TestString=string');
    expect(ini).includes('TestNumber=1');
    expect(ini).includes('TestTrue=Yes');
    expect(ini).includes('TestFalse=No');
  });

  it('should support up to 8 players', () => {
    const addPlayersToNewConfig = (playerCount: number) => {
      const config = new GameConfig();
      const players = Array.from({ length: playerCount }).fill(
        new AiPlayer({
          color: 1,
          location: 1,
          difficulty: 1,
          side: 1,
          team: 'A',
        })
      ) as AiPlayer[];

      config.addPlayers(players);
    };

    expect(() => addPlayersToNewConfig(GameConfig.MIN_PLAYER_COUNT - 1)).toThrow(ArgumentError);
    expect(() => addPlayersToNewConfig(GameConfig.MIN_PLAYER_COUNT)).not.toThrow();
    expect(() => addPlayersToNewConfig(GameConfig.MAX_PLAYER_COUNT)).not.toThrow();
    expect(() => addPlayersToNewConfig(GameConfig.MAX_PLAYER_COUNT + 1)).toThrow(ArgumentError);
  });

  it('should handle spawn style alliance', () => {
    const config = new GameConfig();
    config.addPlayers([
      new HumanPlayer({
        color: 1,
        location: 1,
        name: 'Human1',
        side: 1,
        team: 'A',
      }),
      new HumanPlayer({
        color: 1,
        location: 1,
        name: 'Human2',
        side: 1,
        team: 'B',
      }),
      new AiPlayer({
        color: 1,
        location: 1,
        difficulty: 1,
        side: 1,
        team: 'A',
      }),
      new AiPlayer({
        color: 1,
        location: 1,
        difficulty: 1,
        side: 1,
        team: 'B',
      }),
    ]);

    const ini = config.serializeOptions();
    expect(ini).toContain('[Multi1_Alliances]\nHouseAllyOne=2');
    expect(ini).toContain('[Multi3_Alliances]\nHouseAllyOne=0');
    expect(ini).toContain('[Multi2_Alliances]\nHouseAllyOne=3');
    expect(ini).toContain('[Multi4_Alliances]\nHouseAllyOne=1');
  });

  it('should serialize ai player', () => {
    const config = new GameConfig();
    config.addPlayers([
      new AiPlayer({
        color: 1,
        location: 1,
        difficulty: 1,
        side: 1,
        team: 'A',
      }),
    ]);

    const ini = config.serializeOptions();
    expect(ini).toContain('[HouseColors]\nMulti1=1');
    expect(ini).toContain('[SpawnLocations]\nMulti1=1');
    expect(ini).toContain('[HouseHandicaps]\nMulti1=1');
    expect(ini).toContain('[HouseCountries]\nMulti1=1');
  });
});
