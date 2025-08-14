# Types TypeScript

Ce document décrit tous les types et interfaces TypeScript disponibles dans le package `bj-pass-auth-widget`.

## 📦 Import des types

```typescript
import type {
  BjPassConfig,
  AuthResult,
  UserInfo,
  TokenInfo,
  Plugin,
  HookCallback,
  BjPassWidgetProps,
  BjPassWidgetRef
} from 'bj-pass-auth-widget';
```

## 🔧 Configuration

### BjPassConfig

Interface principale pour la configuration du widget d'authentification.

```typescript
interface BjPassConfig {
  // Configuration requise
  clientId: string;
  
  // Configuration optionnelle
  environment?: 'test' | 'production';
  scope?: string;
  redirectUri?: string;
  pkce?: boolean;
  verifyAccessToken?: boolean;
  
  // Configuration backend
  backendUrl?: string;
  useBackend?: boolean;
  
  // Configuration popup
  popupMode?: boolean;
  autoClosePopup?: boolean;
  
  // Configuration UI
  ui?: BjPassUIConfig;
  
  // Callbacks
  onSuccess?: (tokens: TokenInfo) => void;
  onError?: (error: string) => void;
  
  // Configuration avancée
  plugins?: Plugin[];
  hooks?: Record<string, HookCallback>;
}
```

### BjPassUIConfig

Configuration de l'interface utilisateur.

```typescript
interface BjPassUIConfig {
  // Conteneur
  container?: string | HTMLElement;
  
  // Couleurs
  primaryColor?: string;
  secondaryColor?: string;
  
  // Langue et thème
  language?: 'fr' | 'en';
  theme?: 'default' | 'dark' | 'modern' | 'minimal';
  
  // Affichage
  showEnvSelector?: boolean;
  showDebugPanel?: boolean;
  
  // Styles personnalisés
  customCSS?: string;
  containerClass?: string;
  widgetClass?: string;
}
```

## 🔐 Authentification

### AuthResult

Résultat d'une authentification.

```typescript
interface AuthResult {
  success: boolean;
  user?: UserInfo;
  tokens?: TokenInfo;
  error?: string;
  code?: string;
  state?: string;
}
```

### UserInfo

Informations sur l'utilisateur authentifié.

```typescript
interface UserInfo {
  sub: string;           // Identifiant unique de l'utilisateur
  name?: string;         // Nom complet
  given_name?: string;   // Prénom
  family_name?: string;  // Nom de famille
  email?: string;        // Adresse email
  email_verified?: boolean; // Email vérifié
  picture?: string;      // URL de l'avatar
  locale?: string;       // Locale de l'utilisateur
  updated_at?: number;   // Timestamp de dernière mise à jour
  
  // Claims personnalisés
  [key: string]: any;
}
```

### TokenInfo

Informations sur les tokens d'authentification.

```typescript
interface TokenInfo {
  accessToken: string;     // Token d'accès
  tokenType: string;       // Type de token (généralement "Bearer")
  expiresIn?: number;      // Durée de vie en secondes
  scope: string;           // Scopes accordés
  refreshToken?: string;   // Token de rafraîchissement
  idToken?: string;        // Token d'identité (JWT)
  
  // Informations supplémentaires
  expiresAt?: number;      // Timestamp d'expiration
  issuedAt?: number;       // Timestamp d'émission
}
```

## 🔌 Plugins et Hooks

### Plugin

Interface pour les plugins du widget.

```typescript
interface Plugin {
  name: string;
  version: string;
  description?: string;
  
  // Méthodes du plugin
  install?: (widget: any) => void;
  uninstall?: (widget: any) => void;
  
  // Configuration du plugin
  config?: Record<string, any>;
  
  // Événements du plugin
  onInstall?: () => void;
  onUninstall?: () => void;
}
```

### HookCallback

Type pour les callbacks des hooks.

```typescript
type HookCallback = (data?: any) => void | Promise<void>;
```

## 🎯 Composants React

### BjPassWidgetProps

Props du composant React `BjPassWidget`.

```typescript
interface BjPassWidgetProps {
  // Configuration
  config: BjPassConfig;
  
  // Événements
  onAuthSuccess?: (result: AuthResult) => void;
  onAuthError?: (error: string) => void;
  onUserInfo?: (user: UserInfo) => void;
  onLogout?: () => void;
  onTokensRefresh?: (tokens: TokenInfo) => void;
  
  // Personnalisation
  containerClass?: string;
  containerStyle?: React.CSSProperties;
  widgetClass?: string;
  loadingText?: string;
  processingText?: string;
  
  // Référence
  ref?: React.Ref<BjPassWidgetRef>;
}
```

### BjPassWidgetRef

Référence du composant React pour accéder aux méthodes.

```typescript
interface BjPassWidgetRef {
  // Méthodes d'authentification
  startAuth: () => Promise<any>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<UserInfo | null>;
  refreshTokens: () => Promise<TokenInfo | null>;
  
  // État
  isAuthenticated: () => boolean;
  getTokens: () => TokenInfo | null;
  
  // Configuration
  updateConfig: (newConfig: Partial<BjPassConfig>) => void;
  getConfig: () => BjPassConfig | null;
  
  // Destruction
  destroy: () => void;
}
```

## 🚀 Classes principales

### BjPassAuthWidget

Classe principale du widget d'authentification.

```typescript
class BjPassAuthWidget {
  constructor(config: BjPassConfig);
  
  // Méthodes d'authentification
  startAuthFlow(): Promise<any>;
  logout(): Promise<void>;
  getUserInfo(): Promise<UserInfo | null>;
  refreshTokens(): Promise<TokenInfo | null>;
  
  // État
  isAuthenticated(): boolean;
  getTokens(): TokenInfo | null;
  
  // Configuration
  updateConfig(newConfig: Partial<BjPassConfig>): void;
  getConfig(): BjPassConfig | null;
  
  // Hooks
  addHook(event: string, callback: HookCallback): void;
  removeHook(event: string, callback: HookCallback): void;
  
  // Plugins
  addPlugin(plugin: Plugin): void;
  removePlugin(pluginName: string): void;
  
  // Destruction
  destroy(): void;
}
```

### EnhancedBjPassAuthWidget

Version étendue avec fonctionnalités avancées.

```typescript
class EnhancedBjPassAuthWidget extends BjPassAuthWidget {
  // Méthodes étendues
  startAuthWithRetry(maxRetries?: number): Promise<any>;
  refreshTokensWithRetry(maxRetries?: number): Promise<TokenInfo | null>;
  
  // Gestion des sessions
  checkSessionStatus(): boolean;
  extendSession(): Promise<boolean>;
  
  // Analytics
  trackEvent(event: string, data?: any): void;
  getAnalytics(): Record<string, any>;
}
```

### BjPassWidgetFactory

Factory pour créer des widgets avec thèmes.

```typescript
class BjPassWidgetFactory {
  // Créer un widget avec thème
  createWidget(config: BjPassConfig, theme?: string): BjPassAuthWidget;
  
  // Créer un widget avec thème personnalisé
  createCustomWidget(config: BjPassConfig, themeConfig: any): BjPassAuthWidget;
  
  // Lister les thèmes disponibles
  getAvailableThemes(): string[];
  
  // Obtenir la configuration d'un thème
  getThemeConfig(theme: string): any;
}
```

## 🔄 Événements et Hooks

### Événements disponibles

```typescript
type BjPassEvent = 
  | 'beforeAuthStart'      // Avant le démarrage de l'authentification
  | 'afterAuthStart'       // Après le démarrage de l'authentification
  | 'beforeTokenExchange'  // Avant l'échange de tokens
  | 'afterTokenExchange'   // Après l'échange de tokens
  | 'beforeLogout'         // Avant la déconnexion
  | 'afterLogout'          // Après la déconnexion
  | 'beforeUserInfo'       // Avant la récupération des infos utilisateur
  | 'afterUserInfo'        // Après la récupération des infos utilisateur
  | 'beforeTokenRefresh'   // Avant le rafraîchissement des tokens
  | 'afterTokenRefresh'    // Après le rafraîchissement des tokens
  | 'error'                // En cas d'erreur
  | '*'                     // Tous les événements
```

### Utilisation des hooks

```typescript
const widget = new BjPassAuthWidget(config);

// Ajouter un hook
widget.addHook('afterAuthStart', (result) => {
  if (result.success) {
    console.log('Authentification réussie:', result.user);
  } else {
    console.error('Erreur:', result.error);
  }
});

// Hook pour tous les événements
widget.addHook('*', (event, data) => {
  console.log(`Événement ${event}:`, data);
});

// Hook avec promesse
widget.addHook('beforeTokenExchange', async (code, state) => {
  // Validation personnalisée
  if (!code || !state) {
    throw new Error('Code ou state manquant');
  }
});
```

## 🎨 Thèmes et UI

### Configuration des thèmes

```typescript
interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  fonts: {
    family: string;
    sizes: {
      small: string;
      normal: string;
      large: string;
      heading: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    small: string;
    normal: string;
    large: string;
  };
  shadows: {
    small: string;
    normal: string;
    large: string;
  };
}
```

### Utilisation des thèmes

```typescript
const factory = new BjPassWidgetFactory();

// Créer un widget avec thème moderne
const modernWidget = factory.createWidget(config, 'modern');

// Créer un widget avec thème personnalisé
const customTheme: ThemeConfig = {
  name: 'custom',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b'
  },
  // ... autres propriétés
};

const customWidget = factory.createCustomWidget(config, customTheme);
```

## 🧪 Types pour les tests

### MockConfig

Configuration pour les tests.

```typescript
interface MockConfig extends Partial<BjPassConfig> {
  // Propriétés spécifiques aux tests
  testMode?: boolean;
  mockResponses?: Record<string, any>;
  delay?: number;
}
```

### TestUtils

Utilitaires pour les tests.

```typescript
interface TestUtils {
  // Créer une configuration de test
  createTestConfig(overrides?: Partial<MockConfig>): BjPassConfig;
  
  // Simuler des réponses
  mockAuthSuccess(user?: Partial<UserInfo>, tokens?: Partial<TokenInfo>): AuthResult;
  mockAuthError(error: string): AuthResult;
  
  // Attendre des événements
  waitForEvent(widget: BjPassAuthWidget, event: string): Promise<any>;
  
  // Nettoyer après les tests
  cleanup(widget: BjPassAuthWidget): void;
}
```

## 📝 Exemples d'utilisation

### Configuration complète

```typescript
const config: BjPassConfig = {
  clientId: 'your-client-id',
  environment: 'production',
  scope: 'openid profile email',
  redirectUri: 'https://your-domain.com/auth/callback',
  pkce: true,
  verifyAccessToken: true,
  
  ui: {
    container: '#auth-container',
    primaryColor: '#0066cc',
    language: 'fr',
    theme: 'modern',
    showEnvSelector: false,
    customCSS: `
      .bjpass-widget {
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }
    `
  },
  
  onSuccess: (tokens: TokenInfo) => {
    console.log('Authentification réussie:', tokens);
    localStorage.setItem('access_token', tokens.accessToken);
  },
  
  onError: (error: string) => {
    console.error('Erreur d\'authentification:', error);
    showErrorMessage(error);
  }
};

const widget = new BjPassAuthWidget(config);
```

### Utilisation avec TypeScript strict

```typescript
// Configuration avec vérification stricte
const strictConfig: Required<BjPassConfig> = {
  clientId: 'your-client-id',
  environment: 'test',
  scope: 'openid profile email',
  redirectUri: 'http://localhost:3000/callback',
  pkce: true,
  verifyAccessToken: false,
  backendUrl: 'https://your-backend.com',
  useBackend: false,
  popupMode: false,
  autoClosePopup: true,
  ui: {
    container: '#auth-container',
    primaryColor: '#0066cc',
    secondaryColor: '#6c757d',
    language: 'fr',
    theme: 'default',
    showEnvSelector: true,
    showDebugPanel: false,
    customCSS: '',
    containerClass: '',
    widgetClass: ''
  },
  onSuccess: (tokens: TokenInfo) => {
    console.log('Succès:', tokens);
  },
  onError: (error: string) => {
    console.error('Erreur:', error);
  },
  plugins: [],
  hooks: {}
};

const widget = new BjPassAuthWidget(strictConfig);
```

### Gestion des erreurs typées

```typescript
class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

const widget = new BjPassAuthWidget({
  ...config,
  onError: (error: string) => {
    const authError = new AuthError(error, 'AUTH_FAILED');
    console.error('Erreur d\'authentification:', authError);
    
    // Gestion typée des erreurs
    switch (error) {
      case 'access_denied':
        showUserMessage('Accès refusé par l\'utilisateur');
        break;
      case 'invalid_client':
        showUserMessage('Client non autorisé');
        break;
      default:
        showUserMessage('Une erreur est survenue lors de l\'authentification');
    }
  }
});
```

## 🔧 Support

Pour plus d'informations sur les types TypeScript, consultez :
- [Documentation complète](../README.md)
- [Guide de démarrage](../getting-started/installation.md)
- [Référence API](core-api.md)
