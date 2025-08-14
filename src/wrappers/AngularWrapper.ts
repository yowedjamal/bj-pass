// Angular wrapper for BjPass Authentication Widget
// This is a simplified wrapper that can be used with Angular

// Simple EventEmitter implementation
export class SimpleEventEmitter<T> {
  private listeners: ((value: T) => void)[] = [];

  emit(value: T): void {
    this.listeners.forEach(listener => listener(value));
  }

  subscribe(listener: (value: T) => void): { unsubscribe: () => void } {
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
export class BjPassAuthService {
  private widget: any = null;
  private isInitialized = false;

  // Events
  public authSuccess$ = new SimpleEventEmitter<any>();
  public authError$ = new SimpleEventEmitter<string>();
  public userInfo$ = new SimpleEventEmitter<any>();
  public logout$ = new SimpleEventEmitter<void>();
  public tokensRefresh$ = new SimpleEventEmitter<any>();

  constructor(private ngZone?: any) {}

  /**
   * Initialize the authentication widget
   */
  async initialize(config: any): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.BjPassAuthWidget) {
        this.widget = new window.BjPassAuthWidget(config);
        
        // Set up event listeners
        this.widget.addHook('afterAuthStart', (result: any) => {
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

        this.widget.addHook('afterTokenExchange', (tokens: any) => {
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
  async startAuth(): Promise<any> {
    if (!this.widget || !this.isInitialized) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    return await this.widget.startAuthFlow();
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string, state: string): Promise<any> {
    if (!this.widget || !this.isInitialized) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    return await this.widget.exchangeCodeForTokens(code, state);
  }

  /**
   * Refresh tokens
   */
  async refreshTokens(): Promise<any> {
    if (!this.widget || !this.isInitialized) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    return await this.widget.refreshTokens();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
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
  async getUserInfo(): Promise<any> {
    if (!this.widget || !this.isInitialized) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    return await this.widget.getUserInfo();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (!this.widget || !this.isInitialized) {
      return false;
    }
    return this.widget.isAuthenticated();
  }

  /**
   * Get current tokens
   */
  getTokens(): any {
    if (!this.widget || !this.isInitialized) {
      return null;
    }
    return this.widget.getTokens();
  }

  /**
   * Get the widget instance
   */
  getWidget(): any {
    return this.widget;
  }

  /**
   * Clear tokens
   */
  clearTokens(): void {
    if (this.widget && this.isInitialized) {
      this.widget.clearTokens();
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: any): void {
    if (this.widget && this.isInitialized) {
      this.widget.updateConfig(newConfig);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): any {
    if (this.widget && this.isInitialized) {
      return this.widget.getConfig();
    }
    return null;
  }

  /**
   * Destroy widget
   */
  destroy(): void {
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
export class BjPassWidgetComponent {
  // Input properties
  config: any;
  containerClass = '';
  containerStyle: any = {};
  widgetClass = '';
  loadingText = 'Initializing authentication widget...';
  processingText = 'Processing authentication...';

  // Output events
  authSuccess = new SimpleEventEmitter<any>();
  authError = new SimpleEventEmitter<string>();
  userInfo = new SimpleEventEmitter<any>();
  logoutEvent = new SimpleEventEmitter<void>();
  tokensRefresh = new SimpleEventEmitter<any>();

  // Internal state
  isInitialized = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: BjPassAuthService,
    private elementRef?: any,
    private ngZone?: any
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Subscribe to service events
      this.authService.authSuccess$.subscribe((result: any) => {
        this.authSuccess.emit(result);
      });

      this.authService.authError$.subscribe((error: string) => {
        this.authError.emit(error);
      });

      this.authService.userInfo$.subscribe((user: any) => {
        this.userInfo.emit(user);
      });

      this.authService.logout$.subscribe(() => {
        this.logoutEvent.emit();
      });

      this.authService.tokensRefresh$.subscribe((tokens: any) => {
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

  private renderWidget(): void {
    if (this.isInitialized && this.authService.getWidget()) {
      try {
        const container = this.elementRef?.nativeElement?.querySelector('#bjpass-auth-container');
        if (container) {
          this.authService.getWidget()?.render(container);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to render widget';
      }
    }
  }

  ngOnDestroy(): void {
    // Cleanup is handled by the service
  }

  // Public methods that can be called from parent components
  async startAuth(): Promise<any> {
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

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Logout failed';
      throw error;
    }
  }

  async getUserInfo(): Promise<any> {
    try {
      return await this.authService.getUserInfo();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to get user info';
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getTokens(): any {
    return this.authService.getTokens();
  }

  async refreshTokens(): Promise<any> {
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
export class BjPassAuthDirective {
  // Input properties
  bjPassConfig: any;
  bjPassAutoInit = true;

  // Output events
  authSuccess = new SimpleEventEmitter<any>();
  authError = new SimpleEventEmitter<string>();
  userInfo = new SimpleEventEmitter<any>();
  logoutEvent = new SimpleEventEmitter<void>();
  tokensRefresh = new SimpleEventEmitter<any>();

  private widget: any = null;
  private isInitialized = false;

  constructor(
    private elementRef?: any,
    private authService?: BjPassAuthService,
    private ngZone?: any
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.bjPassAutoInit) {
      await this.initialize();
    }
  }

  async initialize(): Promise<void> {
    try {
      if (!this.authService) {
        this.authService = new BjPassAuthService(this.ngZone);
      }
      
      await this.authService.initialize(this.bjPassConfig);
      this.isInitialized = true;

      // Subscribe to events
      this.authService.authSuccess$.subscribe((result: any) => {
        if (this.ngZone && this.ngZone.run) {
          this.ngZone.run(() => {
            this.authSuccess.emit(result);
          });
        } else {
          this.authSuccess.emit(result);
        }
      });

      this.authService.authError$.subscribe((error: string) => {
        if (this.ngZone && this.ngZone.run) {
          this.ngZone.run(() => {
            this.authError.emit(error);
          });
        } else {
          this.authError.emit(error);
        }
      });

      this.authService.userInfo$.subscribe((user: any) => {
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

      this.authService.tokensRefresh$.subscribe((tokens: any) => {
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

  private renderWidget(): void {
    if (this.isInitialized && this.authService) {
      try {
        this.authService.getWidget()?.render(this.elementRef?.nativeElement);
      } catch (error) {
        console.error('Failed to render widget in directive:', error);
      }
    }
  }

  ngOnDestroy(): void {
    // Cleanup is handled by the service
  }

  // Public methods
  async startAuth(): Promise<any> {
    if (!this.isInitialized || !this.authService) {
      throw new Error('Directive not initialized');
    }
    return await this.authService.startAuth();
  }

  async logout(): Promise<void> {
    if (!this.isInitialized || !this.authService) {
      throw new Error('Directive not initialized');
    }
    await this.authService.logout();
  }

  isAuthenticated(): boolean {
    return this.authService?.isAuthenticated() || false;
  }

  getTokens(): any {
    return this.authService?.getTokens() || null;
  }
}

// =======================
// Angular Module
// =======================
export class BjPassAuthModule {
  static forRoot(): any {
    return {
      ngModule: BjPassAuthModule,
      providers: [
        BjPassAuthService
      ]
    };
  }
}
