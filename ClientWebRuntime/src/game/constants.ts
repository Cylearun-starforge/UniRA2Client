/**
 * @public
 * Team of game
 */
export const GameTeams = ['A', 'B', 'C', 'D'] as const;

/**
 * @public
 * Team of game
 */
export type GameTeamType = (typeof GameTeams)[number];
