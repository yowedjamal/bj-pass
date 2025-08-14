# Utilisation avec React et Next.js

Ce guide vous explique comment utiliser le widget d'authentification BjPass dans vos projets React et Next.js.

## 🚀 Installation

```bash
npm install bj-pass-auth-widget
```

## 📦 Ce qui est inclus

- **BjPassWidget** : Composant React prêt à l'emploi
- **useBjPassAuth** : Hook personnalisé pour la gestion d'état
- **Types TypeScript** : Interfaces et types complets
- **Support Next.js** : Compatible avec les composants client et serveur

## 🔧 Configuration rapide

### 1. Import des composants

```typescript
import { BjPassWidget, useBjPassAuth } from 'bj-pass-auth-widget';
```

### 2. Configuration de base

```typescript
const authConfig = {
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/auth/callback',
  environment: 'test',
  scope: 'openid profile email',
  pkce: true,
  ui: {
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'default'
  }
};
```

## 🎯 Utilisation du composant

### Composant simple

```typescript
import React from 'react';
import { BjPassWidget } from 'bj-pass-auth-widget';

function LoginPage() {
  const handleAuthSuccess = (result: any) => {
    console.log('Authentification réussie:', result);
    // Rediriger ou mettre à jour l'état
  };

  const handleAuthError = (error: string) => {
    console.error('Erreur d\'authentification:', error);
    // Gérer l'erreur
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      
      <BjPassWidget
        config={authConfig}
        onAuthSuccess={handleAuthSuccess}
        onAuthError={handleAuthError}
        containerClass="custom-widget"
        loadingText="Initialisation..."
        processingText="Authentification en cours..."
      />
    </div>
  );
}

export default LoginPage;
```

### Composant avec gestion d'état

```typescript
import React, { useState } from 'react';
import { BjPassWidget } from 'bj-pass-auth-widget';

function AuthComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);

  const handleAuthSuccess = (result: any) => {
    setIsAuthenticated(true);
    if (result.user) setUser(result.user);
    if (result.tokens) setTokens(result.tokens);
    
    // Stocker les tokens
    localStorage.setItem('access_token', result.tokens.accessToken);
    if (result.tokens.refreshToken) {
      localStorage.setItem('refresh_token', result.tokens.refreshToken);
    }
  };

  const handleAuthError = (error: string) => {
    setIsAuthenticated(false);
    setUser(null);
    setTokens(null);
    console.error('Erreur:', error);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <BjPassWidget
          config={authConfig}
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
        />
      ) : (
        <div className="user-info">
          <h2>Bienvenue, {user?.name}!</h2>
          <p>Email: {user?.email}</p>
          <button onClick={() => setIsAuthenticated(false)}>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
```

## 🪝 Utilisation du hook

### Hook de base

```typescript
import React from 'react';
import { useBjPassAuth } from 'bj-pass-auth-widget';

function AuthWithHook() {
  const { 
    isAuthenticated, 
    user, 
    tokens, 
    startAuth, 
    logout, 
    isLoading, 
    error 
  } = useBjPassAuth(authConfig);

  const handleLogin = async () => {
    try {
      await startAuth();
    } catch (err) {
      console.error('Erreur de connexion:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={handleLogin}>
          Se connecter
        </button>
      ) : (
        <div>
          <h2>Connecté en tant que {user?.name}</h2>
          <button onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
```

### Hook avec gestion avancée

```typescript
import React, { useEffect } from 'react';
import { useBjPassAuth } from 'bj-pass-auth-widget';

function AdvancedAuthHook() {
  const {
    isAuthenticated,
    user,
    tokens,
    startAuth,
    logout,
    getUserInfo,
    refreshTokens,
    isLoading,
    error
  } = useBjPassAuth(authConfig);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    if (isAuthenticated && !user) {
      getUserInfo();
    }
  }, [isAuthenticated, user, getUserInfo]);

  // Rafraîchir les tokens automatiquement
  useEffect(() => {
    if (tokens?.refreshToken) {
      const interval = setInterval(() => {
        refreshTokens();
      }, 5 * 60 * 1000); // Toutes les 5 minutes

      return () => clearInterval(interval);
    }
  }, [tokens, refreshTokens]);

  const handleLogin = async () => {
    try {
      await startAuth();
    } catch (err) {
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <div className="auth-container">
      <h1>Authentification BjPass</h1>
      
      {error && (
        <div className="error-message">
          Erreur: {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : !isAuthenticated ? (
        <div className="login-section">
          <h2>Connexion requise</h2>
          <button onClick={handleLogin} className="btn-primary">
            Se connecter
          </button>
        </div>
      ) : (
        <div className="user-section">
          <h2>Bienvenue, {user?.name}!</h2>
          <div className="user-details">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>ID:</strong> {user?.sub}</p>
          </div>
          
          <div className="token-info">
            <h3>Tokens</h3>
            <p><strong>Type:</strong> {tokens?.tokenType || 'Bearer'}</p>
            <p><strong>Portée:</strong> {tokens?.scope || 'openid profile'}</p>
          </div>
          
          <button onClick={logout} className="btn-danger">
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
```

## 🔄 Gestion des événements

### Événements du composant

```typescript
<BjPassWidget
  config={authConfig}
  onAuthSuccess={(result) => {
    console.log('Succès:', result);
    // result.user, result.tokens
  }}
  onAuthError={(error) => {
    console.error('Erreur:', error);
  }}
  onUserInfo={(user) => {
    console.log('Infos utilisateur:', user);
  }}
  onLogout={() => {
    console.log('Déconnexion');
  }}
  onTokensRefresh={(tokens) => {
    console.log('Tokens rafraîchis:', tokens);
  }}
/>
```

### Événements du hook

```typescript
const {
  // Événements automatiques
  isAuthenticated,
  user,
  tokens,
  
  // Actions
  startAuth,
  logout,
  getUserInfo,
  refreshTokens,
  
  // État
  isLoading,
  error
} = useBjPassAuth(config);
```

## 🎨 Personnalisation

### Styles personnalisés

```typescript
<BjPassWidget
  config={authConfig}
  containerClass="my-custom-widget"
  containerStyle={{
    border: '2px solid #007bff',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f8f9fa'
  }}
  widgetClass="custom-widget-content"
  loadingText="Initialisation de l'authentification..."
  processingText="Traitement de votre demande..."
/>
```

### CSS personnalisé

```css
.my-custom-widget {
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-widget-content {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.custom-widget-content button {
  background: linear-gradient(45deg, #007bff, #0056b3);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-widget-content button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
```

## 🚀 Intégration Next.js

### Composant client

```typescript
'use client';

import { BjPassWidget } from 'bj-pass-auth-widget';

export default function LoginPage() {
  return (
    <div>
      <h1>Connexion</h1>
      <BjPassWidget
        config={authConfig}
        onAuthSuccess={handleSuccess}
        onAuthError={handleError}
      />
    </div>
  );
}
```

### Page de callback

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      // Traiter le callback d'authentification
      handleCallback(code, state);
    }
  }, [searchParams]);

  const handleCallback = async (code: string, state: string) => {
    try {
      // Échanger le code contre des tokens
      // Rediriger vers la page principale
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur de callback:', error);
      router.push('/login?error=callback_failed');
    }
  };

  return (
    <div className="callback-page">
      <h2>Traitement de l'authentification...</h2>
      <div className="spinner"></div>
    </div>
  );
}
```

### Configuration des routes

```typescript
// app/auth/callback/page.tsx
export default function CallbackPage() {
  // ... logique de callback
}

// app/login/page.tsx
export default function LoginPage() {
  // ... page de connexion
}

// app/dashboard/page.tsx
export default function DashboardPage() {
  // ... page protégée
}
```

## 🧪 Tests

### Test du composant

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { BjPassWidget } from 'bj-pass-auth-widget';

describe('BjPassWidget', () => {
  it('should render login button when not authenticated', () => {
    render(<BjPassWidget config={mockConfig} />);
    
    expect(screen.getByText(/se connecter/i)).toBeInTheDocument();
  });

  it('should handle auth success', () => {
    const onSuccess = jest.fn();
    
    render(
      <BjPassWidget 
        config={mockConfig} 
        onAuthSuccess={onSuccess} 
      />
    );
    
    // Simuler une authentification réussie
    // Vérifier que onSuccess est appelé
  });
});
```

### Test du hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useBjPassAuth } from 'bj-pass-auth-widget';

describe('useBjPassAuth', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useBjPassAuth(mockConfig));
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.tokens).toBe(null);
  });

  it('should handle authentication flow', async () => {
    const { result } = renderHook(() => useBjPassAuth(mockConfig));
    
    await act(async () => {
      await result.current.startAuth();
    });
    
    // Vérifier les changements d'état
  });
});
```

## 🔧 Configuration avancée

### Variables d'environnement

```typescript
// .env.local
NEXT_PUBLIC_BJPASS_CLIENT_ID=your-client-id
NEXT_PUBLIC_BJPASS_ENVIRONMENT=test
NEXT_PUBLIC_BJPASS_REDIRECT_URI=http://localhost:3000/auth/callback

// Configuration
const authConfig = {
  clientId: process.env.NEXT_PUBLIC_BJPASS_CLIENT_ID!,
  environment: process.env.NEXT_PUBLIC_BJPASS_ENVIRONMENT as 'test' | 'production',
  redirectUri: process.env.NEXT_PUBLIC_BJPASS_REDIRECT_URI,
  // ... autres options
};
```

### Configuration centralisée

```typescript
// lib/auth-config.ts
export const authConfig = {
  clientId: process.env.NEXT_PUBLIC_BJPASS_CLIENT_ID!,
  environment: process.env.NEXT_PUBLIC_BJPASS_ENVIRONMENT as 'test' | 'production',
  redirectUri: process.env.NEXT_PUBLIC_BJPASS_REDIRECT_URI,
  scope: 'openid profile email',
  pkce: true,
  ui: {
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'default'
  }
};

// Utilisation
import { authConfig } from '@/lib/auth-config';
const { isAuthenticated } = useBjPassAuth(authConfig);
```

## 🚨 Dépannage

### Erreurs courantes

1. **"BjPassAuthWidget not available"**
   - Vérifiez que le package est correctement installé
   - Assurez-vous que l'import est correct

2. **Erreurs de compilation TypeScript**
   - Vérifiez que les types sont correctement importés
   - Assurez-vous que `tsconfig.json` inclut le package

3. **Problèmes de rendu côté serveur**
   - Utilisez `'use client'` pour les composants avec le widget
   - Évitez le rendu côté serveur pour les composants d'authentification

### Support

Pour plus d'informations, consultez :
- [Documentation complète](../README.md)
- [Exemples d'utilisation](../../examples/nextjs-example.tsx)
- [Guide de déploiement](../DEPLOYMENT.md)
