import { BjPassConfig, AuthResult, UserInfo, TokenInfo, Plugin, HookCallback } from './types';

declare class BjPassAuthWidget {
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
  render(container?: string): void;
  destroy(): void;
  
  // Plugin system
  registerPlugin(plugin: Plugin): this;
  unregisterPlugin(name: string): this;
  getPlugin(name: string): Plugin | undefined;
  
  // Hooks
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

// Utility function
declare function createBjPassWidget(config: BjPassConfig): BjPassAuthWidget;

export {
  BjPassAuthWidget,
  EnhancedBjPassAuthWidget,
  BjPassWidgetFactory,
  createBjPassWidget,
};

export default BjPassAuthWidget;
