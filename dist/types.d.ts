// Global type declarations for bj-pass-auth-widget
declare module 'bj-pass-auth-widget' {
  export * from './types';
  export * from './bj-pass-auth-widget-types';
  export * from './wrappers/ReactWrapper';
  export * from './wrappers/AngularWrapper';
}

declare module 'bj-pass-auth-widget/umd' {
  export * from './types';
  export * from './bj-pass-auth-widget-types';
  export * from './wrappers/ReactWrapper';
  export * from './wrappers/AngularWrapper';
}

declare module 'bj-pass-auth-widget/dist/bj-pass-auth-widget.min.js' {
  export * from './types';
  export * from './bj-pass-auth-widget-types';
  export * from './wrappers/ReactWrapper';
  export * from './wrappers/AngularWrapper';
}

declare module 'bj-pass-auth-widget/dist/bj-pass-auth-widget.umd.js' {
  export * from './types';
  export * from './bj-pass-auth-widget-types';
  export * from './wrappers/ReactWrapper';
  export * from './wrappers/AngularWrapper';
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
