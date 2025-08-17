// Module declarations for bj-pass-auth-widget
declare module 'bj-pass-auth-widget' {
  // Re-export everything from the main index
  export * from './index';
}

declare module 'bj-pass-auth-widget/umd' {
  export * from './index';
}

declare module 'bj-pass-auth-widget/react' {
  export * from './index';
}

declare module 'bj-pass-auth-widget/angular' {
  export * from './index';
}

// Global declarations for browser usage
declare global {
  interface Window {
    BjPassAuthWidget: any;
    EnhancedBjPassAuthWidget: any;
    BjPassWidgetFactory: any;
    BjPassComponents: {
      ConfigManager: any;
      CryptoUtils: any;
      SessionManager: any;
      UIManager: any;
      TokenValidator: any;
      BackendClient: any;
      PopupManager: any;
      ErrorHandler: any;
      PluginManager: any;
    };
    BjPassPlugins: {
      AnalyticsPlugin: any;
      RetryPlugin: any;
    };
    createBjPassWidget: any;
  }
}
