export interface BjPassConfig {
  environment?: 'test' | 'production';
  clientId: string;
  authServer?: string;
  scope?: string;
  redirectUri: string;
  pkce?: boolean;
  verifyAccessToken?: boolean;
  tokenVerificationScopes?: string[];
  beUrl?: string;
  beBearer?: string;
  header?: Record<string, string>;
  ui?: {
    showEnvSelector?: boolean;
    container?: string;
    language?: 'fr' | 'en';
    primaryColor?: string;
    theme?: 'default' | 'dark' | 'light';
  };
  backendUrl?: string;
  backendEndpoints?: {
    start: string;
    status: string;
    user: string;
    logout: string;
    refresh: string;
  };
  frontendOrigin?: string;
  backendOrigin?: string;
  useBackend?: boolean;
  popupMode?: boolean;
  autoClosePopup?: boolean;
}

export interface AuthResult {
  success: boolean;
  tokens?: TokenInfo;
  user?: any;
  error?: string;
}

export interface UserInfo {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: any;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
  tokenType?: string;
  scope?: string;
}

export interface Plugin {
  name: string;
  init?: (widget: any) => void;
  destroy?: () => void;
  [key: string]: any;
}

export interface HookCallback {
  (widget: any, ...args: any[]): void | Promise<void>;
}



// Global types for browser usage
declare global {
  interface Window {
    BjPassAuthWidget: typeof BjPassAuthWidget;
    EnhancedBjPassAuthWidget: typeof EnhancedBjPassAuthWidget;
    BjPassWidgetFactory: typeof BjPassWidgetFactory;
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
    createBjPassWidget: typeof createBjPassWidget;
  }
}

// Module declarations for different import methods
declare module 'bj-pass-auth-widget' {
  export * from './types';
  export { BjPassAuthWidget, EnhancedBjPassAuthWidget, BjPassWidgetFactory, createBjPassWidget } from './bj-pass-auth-widget';
  export default BjPassAuthWidget;
}

declare module 'bj-pass-auth-widget/umd' {
  export * from './types';
  export { BjPassAuthWidget, EnhancedBjPassAuthWidget, BjPassWidgetFactory, createBjPassWidget } from './bj-pass-auth-widget';
  export default BjPassAuthWidget;
}

declare module 'bj-pass-auth-widget/dist/bj-pass-auth-widget.min.js' {
  export * from './types';
  export { BjPassAuthWidget, EnhancedBjPassAuthWidget, BjPassWidgetFactory, createBjPassWidget } from './bj-pass-auth-widget';
  export default BjPassAuthWidget;
}
