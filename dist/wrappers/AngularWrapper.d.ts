export declare class SimpleEventEmitter<T> {
    private listeners;
    emit(value: T): void;
    subscribe(listener: (value: T) => void): {
        unsubscribe: () => void;
    };
}
export declare class BjPassAuthService {
    private ngZone?;
    private widget;
    private isInitialized;
    authSuccess$: SimpleEventEmitter<any>;
    authError$: SimpleEventEmitter<string>;
    userInfo$: SimpleEventEmitter<any>;
    logout$: SimpleEventEmitter<void>;
    tokensRefresh$: SimpleEventEmitter<any>;
    constructor(ngZone?: any | undefined);
    /**
     * Initialize the authentication widget
     */
    initialize(config: any): Promise<void>;
    /**
     * Start authentication flow
     */
    startAuth(): Promise<any>;
    /**
     * Exchange authorization code for tokens
     */
    exchangeCodeForTokens(code: string, state: string): Promise<any>;
    /**
     * Refresh tokens
     */
    refreshTokens(): Promise<any>;
    /**
     * Logout user
     */
    logout(): Promise<void>;
    /**
     * Get user information
     */
    getUserInfo(): Promise<any>;
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean;
    /**
     * Get current tokens
     */
    getTokens(): any;
    /**
     * Get the widget instance
     */
    getWidget(): any;
    /**
     * Clear tokens
     */
    clearTokens(): void;
    /**
     * Update configuration
     */
    updateConfig(newConfig: any): void;
    /**
     * Get current configuration
     */
    getConfig(): any;
    /**
     * Destroy widget
     */
    destroy(): void;
}
export declare class BjPassWidgetComponent {
    private authService;
    private elementRef?;
    private ngZone?;
    config: any;
    containerClass: string;
    containerStyle: any;
    widgetClass: string;
    loadingText: string;
    processingText: string;
    authSuccess: SimpleEventEmitter<any>;
    authError: SimpleEventEmitter<string>;
    userInfo: SimpleEventEmitter<any>;
    logoutEvent: SimpleEventEmitter<void>;
    tokensRefresh: SimpleEventEmitter<any>;
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
    constructor(authService: BjPassAuthService, elementRef?: any | undefined, ngZone?: any | undefined);
    ngOnInit(): Promise<void>;
    private renderWidget;
    ngOnDestroy(): void;
    startAuth(): Promise<any>;
    logout(): Promise<void>;
    getUserInfo(): Promise<any>;
    isAuthenticated(): boolean;
    getTokens(): any;
    refreshTokens(): Promise<any>;
}
export declare class BjPassAuthDirective {
    private elementRef?;
    private authService?;
    private ngZone?;
    bjPassConfig: any;
    bjPassAutoInit: boolean;
    authSuccess: SimpleEventEmitter<any>;
    authError: SimpleEventEmitter<string>;
    userInfo: SimpleEventEmitter<any>;
    logoutEvent: SimpleEventEmitter<void>;
    tokensRefresh: SimpleEventEmitter<any>;
    private widget;
    private isInitialized;
    constructor(elementRef?: any | undefined, authService?: BjPassAuthService | undefined, ngZone?: any | undefined);
    ngOnInit(): Promise<void>;
    initialize(): Promise<void>;
    private renderWidget;
    ngOnDestroy(): void;
    startAuth(): Promise<any>;
    logout(): Promise<void>;
    isAuthenticated(): boolean;
    getTokens(): any;
}
export declare class BjPassAuthModule {
    static forRoot(): any;
}
//# sourceMappingURL=AngularWrapper.d.ts.map