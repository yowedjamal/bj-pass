// Main exports
export { BjPassAuthWidget, EnhancedBjPassAuthWidget, BjPassWidgetFactory, createBjPassWidget } from './bj-pass-auth-widget-types';

// Export types and declarations
export * from './bj-pass-auth-widget-types';

// Types
export type {
  BjPassConfig,
  AuthResult,
  UserInfo,
  TokenInfo,
  Plugin,
  HookCallback,
} from './types';

// React components and hooks
export {
  BjPassWidget,
  useBjPassAuth,
  type BjPassWidgetProps,
  type BjPassWidgetRef,
} from './wrappers/ReactWrapper';

// Angular components, services and modules
export {
  BjPassAuthService,
  BjPassWidgetComponent,
  BjPassAuthDirective,
  BjPassAuthModule,
} from './wrappers/AngularWrapper';
