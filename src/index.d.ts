// Global module declarations for bj-pass-auth-widget
declare module 'bj-pass-auth-widget' {
  // Export all types
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

  // Export main classes
  export class BjPassAuthWidget {
    constructor(config: BjPassConfig);
    updateConfig(newConfig: Partial<BjPassConfig>): void;
    getConfig(): BjPassConfig;
    startAuthFlow(): Promise<AuthResult>;
    exchangeCodeForTokens(code: string, state: string): Promise<TokenInfo>;
    refreshTokens(): Promise<TokenInfo>;
    logout(): Promise<void>;
    getUserInfo(): Promise<UserInfo>;
    isAuthenticated(): boolean;
    getTokens(): TokenInfo | null;
    clearTokens(): void;
    render(container?: string): void;
    destroy(): void;
    registerPlugin(plugin: Plugin): this;
    unregisterPlugin(name: string): this;
    getPlugin(name: string): Plugin | undefined;
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

  export function createBjPassWidget(config: BjPassConfig): BjPassAuthWidget;

  // Export React components and hooks
  export interface BjPassWidgetProps {
    config: BjPassConfig;
    onAuthSuccess?: (result: AuthResult) => void;
    onAuthError?: (error: string) => void;
    onUserInfo?: (user: UserInfo) => void;
    onLogout?: () => void;
    onTokensRefresh?: (tokens: TokenInfo) => void;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  export interface BjPassWidgetRef {
    widget: BjPassAuthWidget | null;
    startAuth: () => Promise<AuthResult>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<UserInfo | null>;
    isAuthenticated: () => boolean;
    getTokens: () => TokenInfo | null;
    refreshTokens: () => Promise<TokenInfo | null>;
  }

  export const BjPassWidget: React.ForwardRefExoticComponent<
    BjPassWidgetProps & React.RefAttributes<BjPassWidgetRef>
  >;

  export const useBjPassAuth: (config: BjPassConfig) => {
    widgetRef: React.RefObject<BjPassWidgetRef>;
    isAuthenticated: boolean;
    user: UserInfo | null;
    tokens: TokenInfo | null;
    isLoading: boolean;
    error: string | null;
    startAuth: () => Promise<AuthResult>;
    logout: () => Promise<void>;
    refreshUserInfo: () => Promise<UserInfo | null>;
    refreshTokens: () => Promise<TokenInfo | null>;
  };

  // Export Angular components and services
  export class BjPassAuthService {
    authSuccess$: any;
    authError$: any;
    userInfo$: any;
    logout$: any;
    tokensRefresh$: any;
    constructor(ngZone?: any);
    initialize(config: any): Promise<void>;
    startAuth(): Promise<any>;
    exchangeCodeForTokens(code: string, state: string): Promise<any>;
    refreshTokens(): Promise<any>;
    logout(): Promise<void>;
    getUserInfo(): Promise<any>;
    isAuthenticated(): boolean;
    getTokens(): any;
    getWidget(): any;
    updateConfig(newConfig: any): void;
    getConfig(): any;
    destroy(): void;
  }

  export class BjPassWidgetComponent {
    config: any;
    authSuccess: any;
    authError: any;
    userInfo: any;
    logoutEvent: any;
    tokensRefresh: any;
  }

  export class BjPassAuthDirective {
    config: any;
    authSuccess: any;
    authError: any;
    userInfo: any;
    logoutEvent: any;
    tokensRefresh: any;
  }

  export class BjPassAuthModule {
    static forRoot(): any;
  }
}

// Module declarations for specific paths
declare module 'bj-pass-auth-widget/umd' {
  export * from 'bj-pass-auth-widget';
}

declare module 'bj-pass-auth-widget/react' {
  export * from 'bj-pass-auth-widget';
}

declare module 'bj-pass-auth-widget/angular' {
  export * from 'bj-pass-auth-widget';
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
