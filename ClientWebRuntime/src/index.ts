import { runtime as host } from './env';
export { game, map } from './game';
export type { MapSet, GameMap, MapSetProxy, GameMapHeader } from './game';

/**
 * @public
 */
export async function getPlatform(): Promise<{ mode: 'Debug' | 'Release'; runtime: string }> {
  const mode = await host.Platform.Mode;
  const runtime = await host.Platform.Runtime;
  return { mode, runtime };
}
/**
 * @public
 */
export async function closeWindow() {
  await host.Window.CloseWindow();
}
