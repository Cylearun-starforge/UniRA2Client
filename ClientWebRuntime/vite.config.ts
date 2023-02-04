import { fileURLToPath, URL } from 'node:url';
import { UserConfigExport } from 'vite';

import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';
import dts from 'vite-plugin-dts';

export default defineConfig(configEnv => {
  const dev = configEnv.mode === 'development';
  const isCI = 'CI' in process.env;
  const config: UserConfigExport = {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      lib: {
        entry: 'src/index.ts',
        fileName: 'runtime',
        formats: ['es'],
      },
      minify: !dev,
      sourcemap: dev ? 'inline' : false,
      outDir: 'dist',
    },
    plugins: [
      dts({
        outputDir: 'dist-dts',
      }),
    ],
  };

  if (!dev && !isCI) {
    config.plugins!.push(
      copy({
        targets: [
          {
            src: 'dist/runtime.js',
            dest: '../Client/bin/Release/net6.0-windows/win-x64/webRuntime',
          },
        ],
      })
    );
  }

  return config;
});
