type WebviewPlatform = {
  mode: 'Debug' | 'Release';
  runtime: 'Microsoft Webview2';
};

declare var UniRA2Api: {
  getPlatform: () => Promise<WebviewPlatform>;
  closeWindow: () => Promise<void>;
};
