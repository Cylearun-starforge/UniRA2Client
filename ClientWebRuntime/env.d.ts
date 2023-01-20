/// <reference types="vite/client" />
interface Window {
  chrome: {
    webview: {
      hostObjects: {
        Platform: {
          Mode: Promise<'Debug' | 'Release'>;
          Runtime: Promise<'Microsoft Webview2'>;
        };

        Window: {
          CloseWindow: () => Promise<void>;
        };
      };
    };
  };
}
