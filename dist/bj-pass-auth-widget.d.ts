/**
 * bj-pass Authentication Widget
 * Widget d'authentification OAuth 2.0/OpenID Connect moderne et sécurisé
 * @version 1.0.0
 * @author yowedjamal
 * @license MIT
 */
declare class BjPassAuthWidget {
    constructor(config?: {});
    initialize(): void;
    setupEventHandlers(): void;
    setupMessageListener(): void;
    isValidMessageOrigin(origin: any): boolean;
    startAuthFlow(): Promise<void>;
    startDirectAuthFlow(): Promise<void>;
    handlePopupResponse(queryParams: any): Promise<void>;
    exchangeCodeForTokens(code: any, state: any): Promise<void>;
    validateTokens(tokenData: any): Promise<void>;
    handleError(errorCode: any, description: any): void;
    getUserInfo(): Promise<any>;
    logout(): Promise<void>;
    refreshToken(): Promise<any>;
    destroy(): void;
    refresh(): void;
    getConfig(): any;
    updateConfig(newConfig: any): void;
}
export default BjPassAuthWidget;
//# sourceMappingURL=bj-pass-auth-widget.d.ts.map