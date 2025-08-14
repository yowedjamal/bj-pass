# Utilisation avec Next.js et TypeScript

Ce guide vous explique comment utiliser le widget d'authentification BjPass dans un projet Next.js avec TypeScript.

## Installation

```bash
npm install bj-pass-auth-widget
# ou
yarn add bj-pass-auth-widget
```

## Configuration TypeScript

Assurez-vous que votre `tsconfig.json` inclut les types du package :

```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Utilisation de base

### 1. Composant React simple

```tsx
import React, { useRef } from 'react';
import { BjPassWidget, BjPassWidgetRef, BjPassConfig } from 'bj-pass-auth-widget';

const config: BjPassConfig = {
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/auth/callback',
  environment: 'test',
  scope: 'openid profile email',
  ui: {
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'default'
  }
};

export default function AuthPage() {
  const widgetRef = useRef<BjPassWidgetRef>(null);

  const handleAuthSuccess = (result: any) => {
    console.log('Authentication successful:', result);
    // Rediriger ou mettre à jour l'état
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication failed:', error);
    // Gérer l'erreur
  };

  const startAuth = async () => {
    if (widgetRef.current) {
      try {
        await widgetRef.current.startAuth();
      } catch (error) {
        console.error('Failed to start auth:', error);
      }
    }
  };

  return (
    <div>
      <h1>Authentification BjPass</h1>
      
      <BjPassWidget
        ref={widgetRef}
        config={config}
        onAuthSuccess={handleAuthSuccess}
        onAuthError={handleAuthError}
      />
      
      <button onClick={startAuth}>
        Commencer l'authentification
      </button>
    </div>
  );
}
```

### 2. Utilisation avec le hook personnalisé

```tsx
import React from 'react';
import { useBjPassAuth, BjPassConfig } from 'bj-pass-auth-widget';

const config: BjPassConfig = {
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/auth/callback',
  environment: 'test',
  scope: 'openid profile email'
};

export default function AuthWithHook() {
  const {
    widgetRef,
    isAuthenticated,
    user,
    isLoading,
    error,
    startAuth,
    logout
  } = useBjPassAuth(config);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Bienvenue, {user?.name}!</h2>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      ) : (
        <div>
          <h2>Veuillez vous connecter</h2>
          <button onClick={startAuth}>Se connecter</button>
        </div>
      )}
      
      {/* Le widget sera rendu automatiquement */}
      <div ref={widgetRef} />
    </div>
  );
}
```

### 3. Page de callback

Créez une page de callback pour gérer le retour de l'authentification :

```tsx
// pages/auth/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { BjPassAuthWidget, BjPassConfig } from 'bj-pass-auth-widget';

const config: BjPassConfig = {
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/auth/callback',
  environment: 'test'
};

export default function AuthCallback() {
  const router = useRouter();
  const { code, state } = router.query;

  useEffect(() => {
    if (code && state) {
      handleCallback();
    }
  }, [code, state]);

  const handleCallback = async () => {
    try {
      const widget = new BjPassAuthWidget(config);
      const tokens = await widget.exchangeCodeForTokens(code as string, state as string);
      
      // Stocker les tokens
      localStorage.setItem('access_token', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('refresh_token', tokens.refreshToken);
      }
      
      // Rediriger vers la page principale
      router.push('/dashboard');
    } catch (error) {
      console.error('Callback error:', error);
      router.push('/auth/error');
    }
  };

  return (
    <div>
      <h2>Traitement de l'authentification...</h2>
      <p>Veuillez patienter pendant que nous finalisons votre connexion.</p>
    </div>
  );
}
```

### 4. Hook personnalisé pour la gestion des tokens

```tsx
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { BjPassAuthWidget, BjPassConfig, TokenInfo } from 'bj-pass-auth-widget';

export function useAuth(config: BjPassConfig) {
  const [tokens, setTokens] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier les tokens existants au chargement
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (accessToken) {
      // Vérifier si le token est encore valide
      checkTokenValidity(accessToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkTokenValidity = async (token: string) => {
    try {
      const widget = new BjPassAuthWidget(config);
      // Vérifier la validité du token
      const isValid = await widget.isAuthenticated();
      
      if (isValid) {
        const currentTokens = widget.getTokens();
        setTokens(currentTokens);
      } else {
        // Token expiré, essayer de le rafraîchir
        await refreshTokens();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async () => {
    try {
      const widget = new BjPassAuthWidget(config);
      const newTokens = await widget.refreshTokens();
      
      if (newTokens) {
        setTokens(newTokens);
        localStorage.setItem('access_token', newTokens.accessToken);
        if (newTokens.refreshToken) {
          localStorage.setItem('refresh_token', newTokens.refreshToken);
        }
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      clearTokens();
    }
  };

  const clearTokens = () => {
    setTokens(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const logout = () => {
    clearTokens();
    // Rediriger vers la page de connexion
  };

  return {
    tokens,
    isLoading,
    isAuthenticated: !!tokens,
    refreshTokens,
    logout
  };
}
```

### 5. Composant de protection des routes

```tsx
// components/ProtectedRoute.tsx
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  config: any;
}

export default function ProtectedRoute({ children, config }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth(config);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Vérification de l'authentification...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

## Configuration avancée

### Variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_BJPASS_CLIENT_ID=your-client-id
NEXT_PUBLIC_BJPASS_ENVIRONMENT=test
NEXT_PUBLIC_BJPASS_REDIRECT_URI=http://localhost:3000/auth/callback
```

### Configuration centralisée

```tsx
// config/auth.ts
export const authConfig = {
  clientId: process.env.NEXT_PUBLIC_BJPASS_CLIENT_ID!,
  environment: process.env.NEXT_PUBLIC_BJPASS_ENVIRONMENT as 'test' | 'production',
  redirectUri: process.env.NEXT_PUBLIC_BJPASS_REDIRECT_URI!,
  scope: 'openid profile email',
  ui: {
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'default'
  }
};
```

## Dépannage

### Erreurs courantes

1. **"BjPassAuthWidget not available"** : Assurez-vous que le script est chargé avant l'utilisation
2. **Erreurs TypeScript** : Vérifiez que les types sont correctement importés
3. **Problèmes de CORS** : Configurez correctement les origines autorisées

### Support

Pour plus d'informations, consultez la documentation complète ou ouvrez une issue sur GitHub.
