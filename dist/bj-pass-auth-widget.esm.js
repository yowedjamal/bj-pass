import { default as default_0, useCallback, useEffect, useRef, useState } from "react";
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// NAMESPACE OBJECT: ./src/bj-pass-auth-widget-types.ts
var bj_pass_auth_widget_types_namespaceObject = {};
__webpack_require__.r(bj_pass_auth_widget_types_namespaceObject);

;// ./src/bj-pass-auth-widget-types.ts

;// external "react"

;// ./src/wrappers/ReactWrapper.tsx

const BjPassWidget = /*#__PURE__*/default_0.forwardRef(({
  config,
  onAuthSuccess,
  onAuthError,
  onUserInfo,
  onLogout,
  onTokensRefresh,
  children,
  className,
  style
}, ref) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const widgetRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize widget
  useEffect(() => {
    const initWidget = async () => {
      try {
        if (typeof window !== 'undefined' && window.BjPassAuthWidget) {
          const widget = new window.BjPassAuthWidget(config);
          widgetRef.current = widget;

          // Add event listeners
          widget.addHook('afterAuthStart', result => {
            if (result.success && onAuthSuccess) {
              onAuthSuccess(result);
            } else if (!result.success && onAuthError) {
              onAuthError(result.error || 'Authentication failed');
            }
          });
          widget.addHook('afterTokenExchange', tokens => {
            if (onTokensRefresh) {
              onTokensRefresh(tokens);
            }
          });
          setIsInitialized(true);
        } else {
          setError('BjPassAuthWidget not available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize widget');
      }
    };
    initWidget();
  }, [config, onAuthSuccess, onAuthError, onTokensRefresh]);

  // Render widget when initialized
  useEffect(() => {
    if (isInitialized && widgetRef.current && containerRef.current) {
      try {
        widgetRef.current.render(containerRef.current.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render widget');
      }
    }
  }, [isInitialized]);

  // Expose methods via ref
  default_0.useImperativeHandle(ref, () => ({
    widget: widgetRef.current,
    startAuth: async () => {
      if (!widgetRef.current) {
        throw new Error('Widget not initialized');
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await widgetRef.current.startAuthFlow();
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    logout: async () => {
      if (!widgetRef.current) {
        throw new Error('Widget not initialized');
      }
      try {
        await widgetRef.current.logout();
        if (onLogout) {
          onLogout();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Logout failed');
        throw err;
      }
    },
    getUserInfo: async () => {
      if (!widgetRef.current) {
        return null;
      }
      try {
        return await widgetRef.current.getUserInfo();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get user info');
        return null;
      }
    },
    isAuthenticated: () => {
      var _widgetRef$current;
      return ((_widgetRef$current = widgetRef.current) === null || _widgetRef$current === void 0 ? void 0 : _widgetRef$current.isAuthenticated()) || false;
    },
    getTokens: () => {
      var _widgetRef$current2;
      return ((_widgetRef$current2 = widgetRef.current) === null || _widgetRef$current2 === void 0 ? void 0 : _widgetRef$current2.getTokens()) || null;
    },
    refreshTokens: async () => {
      if (!widgetRef.current) {
        return null;
      }
      try {
        return await widgetRef.current.refreshTokens();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh tokens');
        return null;
      }
    }
  }), [onLogout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);
  if (error) {
    return /*#__PURE__*/default_0.createElement("div", {
      className: `bjpass-error ${className || ''}`,
      style: style
    }, /*#__PURE__*/default_0.createElement("p", null, "Error: ", error));
  }
  if (!isInitialized) {
    return /*#__PURE__*/default_0.createElement("div", {
      className: `bjpass-loading ${className || ''}`,
      style: style
    }, /*#__PURE__*/default_0.createElement("p", null, "Initializing authentication widget..."));
  }
  return /*#__PURE__*/default_0.createElement("div", {
    className: `bjpass-widget-container ${className || ''}`,
    style: style
  }, /*#__PURE__*/default_0.createElement("div", {
    ref: containerRef,
    id: "bjpass-auth-container",
    className: "bjpass-auth-container"
  }), children, isLoading && /*#__PURE__*/default_0.createElement("div", {
    className: "bjpass-loading-overlay"
  }, /*#__PURE__*/default_0.createElement("p", null, "Processing authentication...")));
});
BjPassWidget.displayName = 'BjPassWidget';

// Hook for easy usage
const useBjPassAuth = config => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const widgetRef = useRef(null);
  const startAuth = useCallback(async () => {
    if (!widgetRef.current) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await widgetRef.current.startAuth();
      if (result.success) {
        setIsAuthenticated(true);
        if (result.user) setUser(result.user);
        if (result.tokens) setTokens(result.tokens);
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  const logout = useCallback(async () => {
    if (!widgetRef.current) return;
    try {
      await widgetRef.current.logout();
      setIsAuthenticated(false);
      setUser(null);
      setTokens(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMsg);
      throw err;
    }
  }, []);
  const refreshUserInfo = useCallback(async () => {
    if (!widgetRef.current) return;
    try {
      const userInfo = await widgetRef.current.getUserInfo();
      if (userInfo) setUser(userInfo);
      return userInfo;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get user info';
      setError(errorMsg);
      return null;
    }
  }, []);
  const refreshTokens = useCallback(async () => {
    if (!widgetRef.current) return;
    try {
      const newTokens = await widgetRef.current.refreshTokens();
      if (newTokens) setTokens(newTokens);
      return newTokens;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to refresh tokens';
      setError(errorMsg);
      return null;
    }
  }, []);
  return {
    widgetRef,
    isAuthenticated,
    user,
    tokens,
    isLoading,
    error,
    startAuth,
    logout,
    refreshUserInfo,
    refreshTokens
  };
};
;// ./src/wrappers/AngularWrapper.ts
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Angular wrapper for BjPass Authentication Widget
// This is a simplified wrapper that can be used with Angular

// Simple EventEmitter implementation
class SimpleEventEmitter {
  constructor() {
    _defineProperty(this, "listeners", []);
  }
  emit(value) {
    this.listeners.forEach(listener => listener(value));
  }
  subscribe(listener) {
    this.listeners.push(listener);
    return {
      unsubscribe: () => {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
          this.listeners.splice(index, 1);
        }
      }
    };
  }
}

// =======================
// Angular Service
// =======================
class BjPassAuthService {
  constructor(ngZone) {
    this.ngZone = ngZone;
    _defineProperty(this, "widget", null);
    _defineProperty(this, "isInitialized", false);
    // Events
    _defineProperty(this, "authSuccess$", new SimpleEventEmitter());
    _defineProperty(this, "authError$", new SimpleEventEmitter());
    _defineProperty(this, "userInfo$", new SimpleEventEmitter());
    _defineProperty(this, "logout$", new SimpleEventEmitter());
    _defineProperty(this, "tokensRefresh$", new SimpleEventEmitter());
  }

  /**
   * Initialize the authentication widget
   */
  async initialize(config) {
    if (this.isInitialized) {
      return;
    }
    try {
      if (typeof window !== 'undefined' && window.BjPassAuthWidget) {
        this.widget = new window.BjPassAuthWidget(config);

        // Set up event listeners
        this.widget.addHook('afterAuthStart', result => {
          if (this.ngZone && this.ngZone.run) {
            this.ngZone.run(() => {
              if (result.success) {
                this.authSuccess$.emit(result);
              } else {
                this.authError$.emit(result.error || 'Authentication failed');
              }
            });
          } else {
            if (result.success) {
              this.authSuccess$.emit(result);
            } else {
              this.authError$.emit(result.error || 'Authentication failed');
            }
          }
        });
        this.widget.addHook('afterTokenExchange', tokens => {
          if (this.ngZone && this.ngZone.run) {
            this.ngZone.run(() => {
              this.tokensRefresh$.emit(tokens);
            });
          } else {
            this.tokensRefresh$.emit(tokens);
          }
        });
        this.isInitialized = true;
      } else {
        throw new Error('BjPassAuthWidget not available');
      }
    } catch (error) {
      throw new Error(`Failed to initialize widget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Start authentication flow
   */
  async startAuth() {
    if (!this.widget || !this.isInitialized) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    return await this.widget.startAuthFlow();
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code, state) {
    if (!this.widget || !this.isInitialized) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    return await this.widget.exchangeCodeForTokens(code, state);
  }

  /**
   * Refresh tokens
   */
  async refreshTokens() {
    if (!this.widget || !this.isInitialized) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    return await this.widget.refreshTokens();
  }

  /**
   * Logout user
   */
  async logout() {
    if (!this.widget || !this.isInitialized) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    await this.widget.logout();
    if (this.ngZone && this.ngZone.run) {
      this.ngZone.run(() => {
        this.logout$.emit();
      });
    } else {
      this.logout$.emit();
    }
  }

  /**
   * Get user information
   */
  async getUserInfo() {
    if (!this.widget || !this.isInitialized) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    return await this.widget.getUserInfo();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    if (!this.widget || !this.isInitialized) {
      return false;
    }
    return this.widget.isAuthenticated();
  }

  /**
   * Get current tokens
   */
  getTokens() {
    if (!this.widget || !this.isInitialized) {
      return null;
    }
    return this.widget.getTokens();
  }

  /**
   * Get the widget instance
   */
  getWidget() {
    return this.widget;
  }

  /**
   * Clear tokens
   */
  clearTokens() {
    if (this.widget && this.isInitialized) {
      this.widget.clearTokens();
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    if (this.widget && this.isInitialized) {
      this.widget.updateConfig(newConfig);
    }
  }

  /**
   * Get current configuration
   */
  getConfig() {
    if (this.widget && this.isInitialized) {
      return this.widget.getConfig();
    }
    return null;
  }

  /**
   * Destroy widget
   */
  destroy() {
    if (this.widget && this.isInitialized) {
      this.widget.destroy();
      this.widget = null;
      this.isInitialized = false;
    }
  }
}

// =======================
// Angular Component
// =======================
class BjPassWidgetComponent {
  constructor(authService, elementRef, ngZone) {
    this.authService = authService;
    this.elementRef = elementRef;
    this.ngZone = ngZone;
    // Input properties
    _defineProperty(this, "config", void 0);
    _defineProperty(this, "containerClass", '');
    _defineProperty(this, "containerStyle", {});
    _defineProperty(this, "widgetClass", '');
    _defineProperty(this, "loadingText", 'Initializing authentication widget...');
    _defineProperty(this, "processingText", 'Processing authentication...');
    // Output events
    _defineProperty(this, "authSuccess", new SimpleEventEmitter());
    _defineProperty(this, "authError", new SimpleEventEmitter());
    _defineProperty(this, "userInfo", new SimpleEventEmitter());
    _defineProperty(this, "logoutEvent", new SimpleEventEmitter());
    _defineProperty(this, "tokensRefresh", new SimpleEventEmitter());
    // Internal state
    _defineProperty(this, "isInitialized", false);
    _defineProperty(this, "isLoading", false);
    _defineProperty(this, "error", null);
  }
  async ngOnInit() {
    try {
      // Subscribe to service events
      this.authService.authSuccess$.subscribe(result => {
        this.authSuccess.emit(result);
      });
      this.authService.authError$.subscribe(error => {
        this.authError.emit(error);
      });
      this.authService.userInfo$.subscribe(user => {
        this.userInfo.emit(user);
      });
      this.authService.logout$.subscribe(() => {
        this.logoutEvent.emit();
      });
      this.authService.tokensRefresh$.subscribe(tokens => {
        this.tokensRefresh.emit(tokens);
      });

      // Initialize the widget
      await this.authService.initialize(this.config);
      this.isInitialized = true;

      // Render the widget
      this.renderWidget();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to initialize widget';
    }
  }
  renderWidget() {
    if (this.isInitialized && this.authService.getWidget()) {
      try {
        var _this$elementRef;
        const container = (_this$elementRef = this.elementRef) === null || _this$elementRef === void 0 || (_this$elementRef = _this$elementRef.nativeElement) === null || _this$elementRef === void 0 ? void 0 : _this$elementRef.querySelector('#bjpass-auth-container');
        if (container) {
          var _this$authService$get;
          (_this$authService$get = this.authService.getWidget()) === null || _this$authService$get === void 0 || _this$authService$get.render(container);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to render widget';
      }
    }
  }
  ngOnDestroy() {
    // Cleanup is handled by the service
  }

  // Public methods that can be called from parent components
  async startAuth() {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await this.authService.startAuth();
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Authentication failed';
      this.error = errorMsg;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Logout failed';
      throw error;
    }
  }
  async getUserInfo() {
    try {
      return await this.authService.getUserInfo();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to get user info';
      return null;
    }
  }
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
  getTokens() {
    return this.authService.getTokens();
  }
  async refreshTokens() {
    try {
      return await this.authService.refreshTokens();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to refresh tokens';
      return null;
    }
  }
}

// =======================
// Angular Directive
// =======================
class BjPassAuthDirective {
  constructor(elementRef, authService, ngZone) {
    this.elementRef = elementRef;
    this.authService = authService;
    this.ngZone = ngZone;
    // Input properties
    _defineProperty(this, "bjPassConfig", void 0);
    _defineProperty(this, "bjPassAutoInit", true);
    // Output events
    _defineProperty(this, "authSuccess", new SimpleEventEmitter());
    _defineProperty(this, "authError", new SimpleEventEmitter());
    _defineProperty(this, "userInfo", new SimpleEventEmitter());
    _defineProperty(this, "logoutEvent", new SimpleEventEmitter());
    _defineProperty(this, "tokensRefresh", new SimpleEventEmitter());
    _defineProperty(this, "widget", null);
    _defineProperty(this, "isInitialized", false);
  }
  async ngOnInit() {
    if (this.bjPassAutoInit) {
      await this.initialize();
    }
  }
  async initialize() {
    try {
      if (!this.authService) {
        this.authService = new BjPassAuthService(this.ngZone);
      }
      await this.authService.initialize(this.bjPassConfig);
      this.isInitialized = true;

      // Subscribe to events
      this.authService.authSuccess$.subscribe(result => {
        if (this.ngZone && this.ngZone.run) {
          this.ngZone.run(() => {
            this.authSuccess.emit(result);
          });
        } else {
          this.authSuccess.emit(result);
        }
      });
      this.authService.authError$.subscribe(error => {
        if (this.ngZone && this.ngZone.run) {
          this.ngZone.run(() => {
            this.authError.emit(error);
          });
        } else {
          this.authError.emit(error);
        }
      });
      this.authService.userInfo$.subscribe(user => {
        if (this.ngZone && this.ngZone.run) {
          this.ngZone.run(() => {
            this.userInfo.emit(user);
          });
        } else {
          this.userInfo.emit(user);
        }
      });
      this.authService.logout$.subscribe(() => {
        if (this.ngZone && this.ngZone.run) {
          this.ngZone.run(() => {
            this.logoutEvent.emit();
          });
        } else {
          this.logoutEvent.emit();
        }
      });
      this.authService.tokensRefresh$.subscribe(tokens => {
        if (this.ngZone && this.ngZone.run) {
          this.ngZone.run(() => {
            this.tokensRefresh.emit(tokens);
          });
        } else {
          this.tokensRefresh.emit(tokens);
        }
      });

      // Render widget in the directive element
      this.renderWidget();
    } catch (error) {
      console.error('Failed to initialize BjPass directive:', error);
    }
  }
  renderWidget() {
    if (this.isInitialized && this.authService) {
      try {
        var _this$authService$get2, _this$elementRef2;
        (_this$authService$get2 = this.authService.getWidget()) === null || _this$authService$get2 === void 0 || _this$authService$get2.render((_this$elementRef2 = this.elementRef) === null || _this$elementRef2 === void 0 ? void 0 : _this$elementRef2.nativeElement);
      } catch (error) {
        console.error('Failed to render widget in directive:', error);
      }
    }
  }
  ngOnDestroy() {
    // Cleanup is handled by the service
  }

  // Public methods
  async startAuth() {
    if (!this.isInitialized || !this.authService) {
      throw new Error('Directive not initialized');
    }
    return await this.authService.startAuth();
  }
  async logout() {
    if (!this.isInitialized || !this.authService) {
      throw new Error('Directive not initialized');
    }
    await this.authService.logout();
  }
  isAuthenticated() {
    var _this$authService;
    return ((_this$authService = this.authService) === null || _this$authService === void 0 ? void 0 : _this$authService.isAuthenticated()) || false;
  }
  getTokens() {
    var _this$authService2;
    return ((_this$authService2 = this.authService) === null || _this$authService2 === void 0 ? void 0 : _this$authService2.getTokens()) || null;
  }
}

// =======================
// Angular Module
// =======================
class BjPassAuthModule {
  static forRoot() {
    return {
      ngModule: BjPassAuthModule,
      providers: [BjPassAuthService]
    };
  }
}
;// ./src/index.ts
// Main exports


// Export types and declarations


// Types

// React components and hooks


// Angular components, services and modules

export { BjPassAuthDirective, BjPassAuthModule, BjPassAuthService, BjPassWidget, BjPassWidgetComponent, useBjPassAuth };

//# sourceMappingURL=bj-pass-auth-widget.esm.js.map