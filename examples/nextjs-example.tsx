import React, { useRef, useState } from 'react';
import { BjPassWidget, BjPassWidgetRef, BjPassConfig, AuthResult, UserInfo } from 'bj-pass-auth-widget';

// Configuration d'authentification
const authConfig: BjPassConfig = {
  clientId: process.env.NEXT_PUBLIC_BJPASS_CLIENT_ID || 'your-client-id',
  redirectUri: process.env.NEXT_PUBLIC_BJPASS_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  environment: (process.env.NEXT_PUBLIC_BJPASS_ENVIRONMENT as 'test' | 'production') || 'test',
  scope: 'openid profile email',
  pkce: true,
  ui: {
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'default',
    showEnvSelector: true
  },
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend.com',
  useBackend: true,
  popupMode: true,
  autoClosePopup: true
};

export default function NextJsExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [tokens, setTokens] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const widgetRef = useRef<BjPassWidgetRef>(null);

  // Gestionnaires d'événements
  const handleAuthSuccess = (result: AuthResult) => {
    console.log('Authentification réussie:', result);
    setIsAuthenticated(true);
    if (result.user) {
      setUser(result.user);
    }
    if (result.tokens) {
      setTokens(result.tokens);
      // Stocker les tokens dans le localStorage
      localStorage.setItem('bjpass_access_token', result.tokens.accessToken);
      if (result.tokens.refreshToken) {
        localStorage.setItem('bjpass_refresh_token', result.tokens.refreshToken);
      }
    }
    setError(null);
  };

  const handleAuthError = (error: string) => {
    console.error('Erreur d\'authentification:', error);
    setError(error);
    setIsAuthenticated(false);
    setUser(null);
    setTokens(null);
  };

  const handleUserInfo = (userInfo: UserInfo) => {
    console.log('Informations utilisateur mises à jour:', userInfo);
    setUser(userInfo);
  };

  const handleLogout = () => {
    console.log('Déconnexion effectuée');
    setIsAuthenticated(false);
    setUser(null);
    setTokens(null);
    // Nettoyer le localStorage
    localStorage.removeItem('bjpass_access_token');
    localStorage.removeItem('bjpass_refresh_token');
  };

  const handleTokensRefresh = (newTokens: any) => {
    console.log('Tokens rafraîchis:', newTokens);
    setTokens(newTokens);
    // Mettre à jour le localStorage
    localStorage.setItem('bjpass_access_token', newTokens.accessToken);
    if (newTokens.refreshToken) {
      localStorage.setItem('bjpass_refresh_token', newTokens.refreshToken);
    }
  };

  // Actions du widget
  const startAuth = async () => {
    if (widgetRef.current) {
      setIsLoading(true);
      setError(null);
      try {
        const result = await widgetRef.current.startAuth();
        console.log('Résultat de l\'authentification:', result);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Échec de l\'authentification';
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const logout = async () => {
    if (widgetRef.current) {
      try {
        await widgetRef.current.logout();
      } catch (err) {
        console.error('Erreur lors de la déconnexion:', err);
      }
    }
  };

  const getUserInfo = async () => {
    if (widgetRef.current) {
      try {
        const userInfo = await widgetRef.current.getUserInfo();
        console.log('Informations utilisateur:', userInfo);
        return userInfo;
      } catch (err) {
        console.error('Erreur lors de la récupération des informations utilisateur:', err);
        return null;
      }
    }
    return null;
  };

  const refreshTokens = async () => {
    if (widgetRef.current) {
      try {
        const newTokens = await widgetRef.current.refreshTokens();
        console.log('Nouveaux tokens:', newTokens);
        return newTokens;
      } catch (err) {
        console.error('Erreur lors du rafraîchissement des tokens:', err);
        return null;
      }
    }
    return null;
  };

  // Vérifier l'état d'authentification au chargement
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      if (widgetRef.current) {
        try {
          const authenticated = widgetRef.current.isAuthenticated();
          setIsAuthenticated(authenticated);
          
          if (authenticated) {
            const currentTokens = widgetRef.current.getTokens();
            if (currentTokens) {
              setTokens(currentTokens);
            }
            
            const userInfo = await getUserInfo();
            if (userInfo) {
              setUser(userInfo);
            }
          }
        } catch (err) {
          console.error('Erreur lors de la vérification du statut d\'authentification:', err);
        }
      }
    };

    // Attendre que le widget soit initialisé
    const timer = setTimeout(checkAuthStatus, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="nextjs-example" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Exemple d'intégration BjPass avec Next.js</h1>
      
      {/* Affichage des erreurs */}
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {/* État d'authentification */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '4px', 
        marginBottom: '20px' 
      }}>
        <h3>État d'authentification</h3>
        <p><strong>Connecté:</strong> {isAuthenticated ? 'Oui' : 'Non'}</p>
        {user && (
          <div>
            <p><strong>Nom:</strong> {user.name || 'Non spécifié'}</p>
            <p><strong>Email:</strong> {user.email || 'Non spécifié'}</p>
            <p><strong>ID:</strong> {user.sub}</p>
          </div>
        )}
        {tokens && (
          <div>
            <p><strong>Token d'accès:</strong> {tokens.accessToken.substring(0, 20)}...</p>
            <p><strong>Type:</strong> {tokens.tokenType}</p>
            <p><strong>Portée:</strong> {tokens.scope}</p>
          </div>
        )}
      </div>

      {/* Actions d'authentification */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={startAuth}
            disabled={isLoading || isAuthenticated}
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Chargement...' : 'Se connecter'}
          </button>
          
          <button
            onClick={logout}
            disabled={!isAuthenticated}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Se déconnecter
          </button>
          
          <button
            onClick={getUserInfo}
            disabled={!isAuthenticated}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Récupérer les infos utilisateur
          </button>
          
          <button
            onClick={refreshTokens}
            disabled={!isAuthenticated}
            style={{
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Rafraîchir les tokens
          </button>
        </div>
      </div>

      {/* Widget d'authentification */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Widget d'authentification</h3>
        <BjPassWidget
          ref={widgetRef}
          config={authConfig}
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
          onUserInfo={handleUserInfo}
          onLogout={handleLogout}
          onTokensRefresh={handleTokensRefresh}
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '20px',
            backgroundColor: '#fafafa'
          }}
        />
      </div>

      {/* Configuration utilisée */}
      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h3>Configuration utilisée</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {JSON.stringify(authConfig, null, 2)}
        </pre>
      </div>

      {/* Instructions */}
      <div style={{ 
        backgroundColor: '#fff3e0', 
        padding: '15px', 
        borderRadius: '4px',
        marginTop: '20px'
      }}>
        <h3>Instructions d'utilisation</h3>
        <ol>
          <li>Configurez vos variables d'environnement dans un fichier <code>.env.local</code></li>
          <li>Assurez-vous que votre <code>clientId</code> est correct</li>
          <li>Configurez l'URL de redirection dans votre application OAuth</li>
          <li>Testez d'abord en mode "test" avant de passer en production</li>
        </ol>
      </div>
    </div>
  );
}
