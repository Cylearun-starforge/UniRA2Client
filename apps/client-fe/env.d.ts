/// <reference types="vite/client" />

declare global {
  interface Window {
    __DEV__: boolean;
  }
}

export {};
