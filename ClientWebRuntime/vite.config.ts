import { fileURLToPath, URL } from 'node:url';
import { UserConfigExport } from 'vite';

import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

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
        entry: 'src/index.js',
        fileName: 'runtime',
        formats: ['iife'],
        name: 'UniRA2Api',
      },
      minify: !dev,
      sourcemap: dev ? 'inline' : false,
      outDir: 'dist',
    },
    plugins: [],
  };

  if (!dev && !isCI) {
    config.plugins!.push(
      copy({
        targets: [
          {
            src: 'dist/runtime.iife.js',
            dest: '../Client/bin/Release/net6.0-windows/win-x64/webRuntime',
          },
        ],
      })
    );
  }

  return config;
});
