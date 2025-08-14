/**
 * bj-pass Authentication Widget
 * Widget d'authentification OAuth 2.0/OpenID Connect moderne et sécurisé
 * @version 1.0.0
 * @author yowedjamal
 * @license MIT
 */

declare module 'bj-pass-auth-widget' {
  interface EnvironmentConfig {
    baseUrl: string;
    defaultAuthServer: string;
  }

  interface Environments {
    test: EnvironmentConfig;
    production: EnvironmentConfig;
  }

  interface BackendEndpoints {
    start: string;
    status: string;
    user: string;
    logout: string;
    refresh: string;
  }

  interface UIConfig {
    showEnvSelector?: boolean;
    container?: string;
    language?: string;
    primaryColor?: string;
    theme?: string;
  }

  interface AuthConfig {
    environment?: string;
    clientId?: string;
    authServer?: string;
    scope?: string;
    redirectUri?: string;
    pkce?: boolean;
    verifyAccessToken?: boolean;
    tokenVerificationScopes?: string[];
    beUrl?: string;
    beBearer?: string;
    header?: Record<string, string>;
    ui?: UIConfig;
    backendUrl?: string;
    backendEndpoints?: BackendEndpoints;
    frontendOrigin?: string;
    backendOrigin?: string;
    useBackend?: boolean;
    popupMode?: boolean;
    autoClosePopup?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: { error: string; error_description?: string; source?: string }) => void;
    onLogout?: () => void;
    debug?: boolean;
    maxRetries?: number;
    retryDelay?: number;
    analytics?: boolean;
  }

  interface TokenData {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
    scope?: string;
  }

  interface UserInfo {
    sub?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    email_verified?: boolean;
    [key: string]: any;
  }

  class ConfigManager {
    constructor(userConfig?: AuthConfig);
    environments: Environments;
    defaultConfig: AuthConfig;
    config: AuthConfig;
    resolvedConfig: AuthConfig;
    applyEnvironmentConfig(): AuthConfig;
    updateConfig(newConfig: Partial<AuthConfig>): void;
    get(): AuthConfig;
    getEnvironments(): string[];
  }

  class CryptoUtils {
    static generateRandomString(length: number): string;
    static async generateCodeChallenge(codeVerifier: string): Promise<string>;
    static base64UrlToArrayBuffer(base64Url: string): ArrayBuffer;
    static checkBrowserCompatibility(): boolean;
  }

  class SessionManager {
    static setItem(key: string, value: string): void;
    static getItem(key: string): string | null;
    static removeItem(key: string): void;
    static clear(): void;
    static generateAndStoreAuthData(scope: string): { state: string; nonce: string; codeVerifier: string };
  }

  class OAuthUrlBuilder {
    constructor(config: AuthConfig);
    async buildAuthorizationUrl(authData: { state: string; nonce: string; codeVerifier: string }): Promise<string>;
    buildTokenUrl(): string;
    buildJWKSUrl(): string;
    buildIntrospectionUrl(): string;
  }

  class TokenValidator {
    constructor(config: AuthConfig, urlBuilder: OAuthUrlBuilder);
    async validateIdToken(idToken: string): Promise<any>;
    async verifyAccessToken(accessToken: string): Promise<any>;
    async fetchJWKS(): Promise<any>;
    async verifySignature(token: string, jwk: any): Promise<boolean>;
  }

  class UIComponent {
    constructor(container: string | HTMLElement);
    container: string | HTMLElement;
    element: HTMLElement | null;
    eventListeners: Map<HTMLElement, Array<{ event: string; handler: EventListener }>>;
    createElement(tag: string, className?: string, innerHTML?: string): HTMLElement;
    addEventListeners(element: HTMLElement, events: Record<string, EventListener>): void;
    removeEventListeners(): void;
    destroy(): void;
    render(): void;
    show(): void;
    hide(): void;
  }

  class EnvironmentSelector extends UIComponent {
    constructor(container: string | HTMLElement, config: ConfigManager, onEnvironmentChange: (environment: string) => void);
  }

  class LoginButton extends UIComponent {
    constructor(container: string | HTMLElement, config: ConfigManager, onLogin: EventListener);
    setLoading(isLoading: boolean): void;
  }

  class LoadingSpinner extends UIComponent {
    constructor(container: string | HTMLElement);
  }

  class ErrorDisplay extends UIComponent {
    constructor(container: string | HTMLElement, config: ConfigManager);
    showError(message: string): void;
    clearError(): void;
  }

  class UIManager {
    constructor(config: ConfigManager);
    container: HTMLElement | null;
    components: Record<string, UIComponent>;
    state: { isLoading: boolean; error: string | null };
    initialize(): void;
    createMainContainer(): void;
    initializeComponents(): void;
    onEnvironmentChange(environment: string): void;
    onLoginClick(): void;
    setState(newState: Partial<{ isLoading: boolean; error: string | null }>): void;
    updateUI(): void;
    destroy(): void;
    setOnEnvironmentChange(callback: (environment: string) => void): void;
    setOnLogin(callback: () => void): void;
  }

  class BackendClient {
    constructor(config: AuthConfig);
    async exchangeCode(code: string, state: string): Promise<any>;
    async exchangeCodeDirect(code: string, state: string, urlBuilder: OAuthUrlBuilder): Promise<any>;
    async handleBackendAuthResponse(data: any): Promise<void>;
    async handleBackendAuthSuccess(data: any): Promise<void>;
    handleBackendAuthError(data: any): void;
    async verifyBackendStatus(): Promise<void>;
    async startBackendAuthFlow(): Promise<void>;
    async getUserInfoFromBackend(): Promise<UserInfo>;
    async logoutFromBackend(): Promise<void>;
  }

  class PopupManager {
    popup: Window | null;
    checkInterval: number | null;
    open(url: string, onClose?: () => void): void;
    close(): void;
    isOpen(): boolean;
  }

  class ErrorHandler {
    static getErrorMessage(error: string, description?: string): string;
  }

  class BjPassAuthWidget {
    constructor(config?: AuthConfig);
    configManager: ConfigManager;
    uiManager: UIManager;
    urlBuilder: OAuthUrlBuilder;
    tokenValidator: TokenValidator;
    backendClient: BackendClient;
    popupManager: PopupManager;
    initialize(): void;
    setupEventHandlers(): void;
    setupMessageListener(): void;
    isValidMessageOrigin(origin: string): boolean;
    async startAuthFlow(): Promise<void>;
    async startDirectAuthFlow(): Promise<void>;
    async handlePopupResponse(queryParams: string): Promise<void>;
    async exchangeCodeForTokens(code: string, state: string): Promise<void>;
    async validateTokens(tokenData: TokenData): Promise<void>;
    handleError(errorCode: string, description: string): void;
    async getUserInfo(): Promise<UserInfo | null>;
    async logout(): Promise<void>;
    async refreshToken(): Promise<any>;
    destroy(): void;
    refresh(): void;
    getConfig(): AuthConfig;
    updateConfig(newConfig: Partial<AuthConfig>): void;
  }

  class BjPassWidgetFactory {
    static create(config?: AuthConfig): BjPassAuthWidget;
    static createMultiple(configs: AuthConfig[]): BjPassAuthWidget[];
    static createWithTheme(theme: string, config?: AuthConfig): BjPassAuthWidget;
  }

  class PluginManager {
    constructor(widget: BjPassAuthWidget);
    register(name: string, plugin: any): void;
    unregister(name: string): void;
    addHook(hookName: string, callback: (...args: any[]) => void): void;
    executeHook(hookName: string, ...args: any[]): void;
    getPlugin(name: string): any;
    listPlugins(): string[];
  }

  class EnhancedBjPassAuthWidget extends BjPassAuthWidget {
    constructor(config?: AuthConfig);
    pluginManager: PluginManager;
    setupBuiltinPlugins(): void;
    use(name: string, plugin: any): this;
    unuse(name: string): this;
    getPlugin(name: string): any;
    addHook(hookName: string, callback: (...args: any[]) => void): this;
    executeHook(hookName: string, ...args: any[]): void;
    async startAuthFlow(): Promise<void>;
    async exchangeCodeForTokens(code: string, state: string): Promise<void>;
    destroy(): void;
  }

  export default BjPassAuthWidget;
  export {
    ConfigManager,
    CryptoUtils,
    SessionManager,
    UIManager,
    TokenValidator,
    BackendClient,
    PopupManager,
    ErrorHandler,
    BjPassWidgetFactory,
    PluginManager,
    EnhancedBjPassAuthWidget,
    AuthConfig,
    TokenData,
    UserInfo
  };
}