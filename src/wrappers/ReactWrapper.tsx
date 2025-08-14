import React, { useEffect, useRef, useState, useCallback } from 'react';
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

export const BjPassWidget: React.ForwardRefExoticComponent<
  BjPassWidgetProps & React.RefAttributes<BjPassWidgetRef>
> = React.forwardRef<BjPassWidgetRef, BjPassWidgetProps>(
  ({ config, onAuthSuccess, onAuthError, onUserInfo, onLogout, onTokensRefresh, children, className, style }, ref) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const widgetRef = useRef<BjPassAuthWidget | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize widget
    useEffect(() => {
      const initWidget = async () => {
        try {
          if (typeof window !== 'undefined' && window.BjPassAuthWidget) {
            const widget = new window.BjPassAuthWidget(config);
            widgetRef.current = widget;
            
            // Add event listeners
            widget.addHook('afterAuthStart', (result: AuthResult) => {
              if (result.success && onAuthSuccess) {
                onAuthSuccess(result);
              } else if (!result.success && onAuthError) {
                onAuthError(result.error || 'Authentication failed');
              }
            });

            widget.addHook('afterTokenExchange', (tokens: TokenInfo) => {
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
    React.useImperativeHandle(ref, () => ({
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
        return widgetRef.current?.isAuthenticated() || false;
      },
      getTokens: () => {
        return widgetRef.current?.getTokens() || null;
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
      },
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
      return (
        <div className={`bjpass-error ${className || ''}`} style={style}>
          <p>Error: {error}</p>
        </div>
      );
    }

    if (!isInitialized) {
      return (
        <div className={`bjpass-loading ${className || ''}`} style={style}>
          <p>Initializing authentication widget...</p>
        </div>
      );
    }

    return (
      <div className={`bjpass-widget-container ${className || ''}`} style={style}>
        <div 
          ref={containerRef}
          id="bjpass-auth-container"
          className="bjpass-auth-container"
        />
        {children}
        {isLoading && (
          <div className="bjpass-loading-overlay">
            <p>Processing authentication...</p>
          </div>
        )}
      </div>
    );
  }
);

BjPassWidget.displayName = 'BjPassWidget';

// Hook for easy usage
export const useBjPassAuth = (config: BjPassConfig) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [tokens, setTokens] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const widgetRef = useRef<BjPassWidgetRef>(null);

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
    refreshTokens,
  };
};
