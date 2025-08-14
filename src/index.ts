// Main exports
export { default as BjPassAuthWidget } from './bj-pass-auth-widget.js';

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
