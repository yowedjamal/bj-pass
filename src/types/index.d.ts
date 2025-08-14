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

export class BjPassAuthWidget {
  constructor(config: BjPassConfig);
  
  // Configuration
  updateConfig(newConfig: Partial<BjPassConfig>): void;
  getConfig(): BjPassConfig;
  
  // Authentication
  startAuthFlow(): Promise<AuthResult>;
  exchangeCodeForTokens(code: string, state: string): Promise<TokenInfo>;
  refreshTokens(): Promise<TokenInfo>;
  logout(): Promise<void>;
  
  // User management
  getUserInfo(): Promise<UserInfo>;
  isAuthenticated(): boolean;
  
  // Session management
  getTokens(): TokenInfo | null;
  clearTokens(): void;
  
  // UI management
  render(container?: string | HTMLElement): void;
  destroy(): void;
  
  // Plugin system
  registerPlugin(plugin: Plugin): this;
  unregisterPlugin(name: string): this;
  getPlugin(name: string): Plugin | undefined;
  
  // Hooks
  addHook(hookName: string, callback: HookCallback): this;
  executeHook(hookName: string, ...args: any[]): void;
}

export class EnhancedBjPassAuthWidget extends BjPassAuthWidget {
  constructor(config: BjPassConfig);
}

export class BjPassWidgetFactory {
  static create(config: BjPassConfig): BjPassAuthWidget;
  static createEnhanced(config: BjPassConfig): EnhancedBjPassAuthWidget;
}

// Utility function
export function createBjPassWidget(config: BjPassConfig): BjPassAuthWidget;

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
      DebugPlugin: any;
      RetryPlugin: any;
    };
    createBjPassWidget: typeof createBjPassWidget;
  }
}
