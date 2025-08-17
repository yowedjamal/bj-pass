import { BjPassConfig, AuthResult, UserInfo, TokenInfo, Plugin, HookCallback } from './types';
declare class BjPassAuthWidget {
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
declare class EnhancedBjPassAuthWidget extends BjPassAuthWidget {
    constructor(config: BjPassConfig);
}
declare class BjPassWidgetFactory {
    static create(config: BjPassConfig): BjPassAuthWidget;
    static createEnhanced(config: BjPassConfig): EnhancedBjPassAuthWidget;
}
declare function createBjPassWidget(config: BjPassConfig): BjPassAuthWidget;
export { BjPassAuthWidget, EnhancedBjPassAuthWidget, BjPassWidgetFactory, createBjPassWidget, };
export default BjPassAuthWidget;
//# sourceMappingURL=bj-pass-auth-widget-types.d.ts.map