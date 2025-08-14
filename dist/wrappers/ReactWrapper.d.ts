import React from 'react';
import { BjPassAuthWidget, BjPassConfig, AuthResult, UserInfo, TokenInfo } from '../types';
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
export declare const BjPassWidget: React.ForwardRefExoticComponent<BjPassWidgetProps & React.RefAttributes<BjPassWidgetRef>>;
export declare const useBjPassAuth: (config: BjPassConfig) => {
    widgetRef: React.RefObject<BjPassWidgetRef>;
    isAuthenticated: boolean;
    user: UserInfo | null;
    tokens: TokenInfo | null;
    isLoading: boolean;
    error: string | null;
    startAuth: () => Promise<AuthResult | undefined>;
    logout: () => Promise<void>;
    refreshUserInfo: () => Promise<UserInfo | null | undefined>;
    refreshTokens: () => Promise<TokenInfo | null | undefined>;
};
//# sourceMappingURL=ReactWrapper.d.ts.map