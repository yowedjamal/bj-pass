# Exemples avancés

Collection d'exemples avancés pour le widget d'authentification bj-pass.

## Intégration avec backend

### Configuration backend complète

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    beUrl: "https://your-api.com/auth/exchange",
    beBearer: "Bearer your-api-token",
    onSuccess: (response) => {
        // Réponse du backend avec données supplémentaires
        console.log("Réponse du backend :", response);
        
        if (response.user) {
            updateUserProfile(response.user);
        }
        
        if (response.permissions) {
            updateUserPermissions(response.permissions);
        }
        
        // Redirection basée sur le rôle
        if (response.user && response.user.role === 'admin') {
            window.location.href = '/admin/dashboard';
        } else {
            window.location.href = '/user/dashboard';
        }
    },
    onError: (error) => {
        console.error("Erreur backend :", error);
        
        if (error.code === 'backend_error') {
            showBackendError(error.message);
        } else {
            handleAuthError(error);
        }
    }
});
```

### Backend avec validation personnalisée

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    beUrl: "https://your-api.com/auth/exchange",
    beBearer: "Bearer your-api-token",
    onSuccess: (response) => {
        // Validation des données du backend
        if (!response.user || !response.user.id) {
            throw new Error('Données utilisateur invalides');
        }
        
        // Stockage sécurisé
        secureStorage.setItem('user_id', response.user.id);
        secureStorage.setItem('user_role', response.user.role);
        secureStorage.setItem('session_token', response.session_token);
        
        // Mise à jour de l'interface
        updateUserInterface(response.user);
        
        // Analytics
        trackUserLogin(response.user);
    }
});
```

## Échange direct de tokens

### Configuration pour échange direct

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    verifyAccessToken: true,
    onSuccess: (tokens) => {
        // Tokens directement depuis bj-pass
        console.log("Tokens directs :", tokens);
        
        // Validation locale du token
        if (tokens.access_token) {
            validateTokenLocally(tokens.access_token);
        }
        
        // Stockage des tokens
        localStorage.setItem('access_token', tokens.access_token);
        if (tokens.refresh_token) {
            localStorage.setItem('refresh_token', tokens.refresh_token);
        }
        
        // Décodage du token ID pour obtenir les informations utilisateur
        if (tokens.id_token) {
            const userInfo = decodeJWT(tokens.id_token);
            updateUserInterface(userInfo);
        }
    }
});

function validateTokenLocally(token) {
    try {
        const decoded = decodeJWT(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (decoded.exp && decoded.exp < currentTime) {
            throw new Error('Token expiré');
        }
        
        console.log('Token valide jusqu\'au:', new Date(decoded.exp * 1000));
    } catch (error) {
        console.error('Erreur de validation du token:', error);
        // Gérer l'erreur de validation
    }
}

function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}
```

## Widgets multiples avec thèmes

### Création de widgets multiples

```javascript
// Créer plusieurs widgets avec différents thèmes
const widgets = BjPassWidgetFactory.createMultiple([
    {
        clientId: "admin-client",
        ui: {
            container: "#admin-auth",
            theme: "dark",
            language: "fr"
        },
        onSuccess: (tokens) => {
            console.log("Admin authentifié !", tokens);
            window.location.href = '/admin/dashboard';
        }
    },
    {
        clientId: "user-client",
        ui: {
            container: "#user-auth",
            theme: "modern",
            language: "en"
        },
        onSuccess: (tokens) => {
            console.log("Utilisateur authentifié !", tokens);
            window.location.href = '/user/dashboard';
        }
    },
    {
        clientId: "guest-client",
        ui: {
            container: "#guest-auth",
            theme: "minimal",
            language: "fr"
        },
        onSuccess: (tokens) => {
            console.log("Invité authentifié !", tokens);
            window.location.href = '/guest/portal';
        }
    }
]);

// Gestion centralisée des widgets
function cleanupAllWidgets() {
    widgets.forEach(widget => {
        if (widget) {
            widget.destroy();
        }
    });
}

// Mise à jour globale des thèmes
function updateAllThemes(newTheme) {
    widgets.forEach(widget => {
        widget.updateConfig({
            ui: { theme: newTheme }
        });
        widget.refresh();
    });
}
```

### Widgets avec configuration dynamique

```javascript
// Configuration de base
const baseConfig = {
    environment: "production",
    pkce: true,
    verifyAccessToken: true,
    onError: (error) => {
        console.error("Erreur d'authentification :", error);
        showErrorMessage(error.message);
    }
};

// Créer des widgets avec configuration de base + spécifique
const adminWidget = BjPassWidgetFactory.create({
    ...baseConfig,
    clientId: "admin-client",
    ui: {
        container: "#admin-auth",
        theme: "dark",
        language: "fr"
    },
    onSuccess: (tokens) => {
        console.log("Admin authentifié !", tokens);
        handleAdminAuth(tokens);
    }
});

const userWidget = BjPassWidgetFactory.create({
    ...baseConfig,
    clientId: "user-client",
    ui: {
        container: "#user-auth",
        theme: "modern",
        language: "en"
    },
    onSuccess: (tokens) => {
        console.log("Utilisateur authentifié !", tokens);
        handleUserAuth(tokens);
    }
});

function handleAdminAuth(tokens) {
    // Logique spécifique aux administrateurs
    enableAdminFeatures();
    loadAdminDashboard();
}

function handleUserAuth(tokens) {
    // Logique spécifique aux utilisateurs
    enableUserFeatures();
    loadUserDashboard();
}
```

## Exemple complet avec hooks

### Widget avec tous les plugins et hooks

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    
    // Plugins intégrés
    debug: true,
    analytics: true,
    maxRetries: 3,
    retryDelay: 1000,
    
    // Configuration UI
    ui: {
        container: "#auth-container",
        theme: "modern",
        primaryColor: "#4f46e5",
        language: "fr"
    },
    
    // Callbacks
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
        updateUserInterface(tokens);
    },
    
    onError: (error) => {
        console.error("Erreur d'authentification :", error);
        showErrorMessage(error.message);
    }
});

// Hooks personnalisés
widget.addHook('beforeAuthStart', () => {
    console.log("Démarrage de l'authentification...");
    showLoadingSpinner();
    trackAnalytics('auth_start');
});

widget.addHook('afterTokenExchange', (tokens) => {
    console.log("Échange de tokens réussi");
    hideLoadingSpinner();
    trackAnalytics('auth_success');
    storeTokens(tokens);
    updateUserInterface(tokens);
});

widget.addHook('tokenExchangeError', (error) => {
    console.error("Erreur d'échange de tokens :", error);
    hideLoadingSpinner();
    trackAnalytics('auth_error', { error: error.code });
    showErrorMessage(error.message);
});

// Plugin personnalisé
widget.use('notifications', new NotificationPlugin());
widget.use('secureStorage', new SecureStoragePlugin());

// Fonctions utilitaires
function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function updateUserInterface(tokens) {
    // Mise à jour de l'interface utilisateur
    const userInfo = tokens.user_info || {};
    
    if (userInfo.name) {
        document.getElementById('user-name').textContent = userInfo.name;
    }
    
    if (userInfo.email) {
        document.getElementById('user-email').textContent = userInfo.email;
    }
    
    // Afficher les éléments utilisateur connecté
    document.getElementById('user-section').style.display = 'block';
    document.getElementById('auth-section').style.display = 'none';
}

function storeTokens(tokens) {
    // Stockage sécurisé des tokens
    if (tokens.access_token) {
        localStorage.setItem('access_token', tokens.access_token);
    }
    
    if (tokens.refresh_token) {
        localStorage.setItem('refresh_token', tokens.refresh_token);
    }
    
    if (tokens.id_token) {
        localStorage.setItem('id_token', tokens.id_token);
    }
}

function trackAnalytics(event, data = {}) {
    // Envoi à votre service d'analytics
    if (window.gtag) {
        window.gtag('event', event, data);
    }
    
    // Log local
    console.log(`Analytics: ${event}`, data);
}

function showErrorMessage(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-masquage après 5 secondes
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}
```

## Intégration avec frameworks

### Intégration React

```javascript
import React, { useEffect, useRef, useState } from 'react';
import { BjPassAuthWidget } from '@bj-pass/auth-widget';

function AuthComponent() {
    const widgetRef = useRef(null);
    const containerRef = useRef(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        widgetRef.current = new BjPassAuthWidget({
            clientId: "your-client-id",
            ui: {
                container: containerRef.current
            },
            onSuccess: (tokens) => {
                console.log("Authentification réussie !", tokens);
                setIsAuthenticated(true);
                setUserInfo(tokens.user_info);
                setError(null);
            },
            onError: (error) => {
                console.error("Erreur d'authentification :", error);
                setError(error.message);
                setIsAuthenticated(false);
            }
        });

        return () => {
            if (widgetRef.current) {
                widgetRef.current.destroy();
            }
        };
    }, []);

    const handleLogin = () => {
        if (widgetRef.current) {
            widgetRef.current.startAuthFlow();
        }
    };

    const handleLogout = () => {
        // Nettoyer les tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('id_token');
        
        setIsAuthenticated(false);
        setUserInfo(null);
        setError(null);
    };

    if (isAuthenticated && userInfo) {
        return (
            <div className="user-dashboard">
                <h2>Bienvenue, {userInfo.name} !</h2>
                <p>Email: {userInfo.email}</p>
                <button onClick={handleLogout}>Se déconnecter</button>
            </div>
        );
    }

    return (
        <div className="auth-container">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <div ref={containerRef} />
            <button onClick={handleLogin}>Se connecter</button>
        </div>
    );
}

export default AuthComponent;
```

### Intégration Vue.js

```javascript
<template>
  <div class="auth-container">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="!isAuthenticated">
      <div ref="authContainer"></div>
      <button @click="startAuth">Se connecter</button>
    </div>
    
    <div v-else class="user-dashboard">
      <h2>Bienvenue, {{ userInfo.name }} !</h2>
      <p>Email: {{ userInfo.email }}</p>
      <button @click="logout">Se déconnecter</button>
    </div>
  </div>
</template>

<script>
import { BjPassAuthWidget } from '@bj-pass/auth-widget';

export default {
  name: 'AuthComponent',
  data() {
    return {
      widget: null,
      isAuthenticated: false,
      userInfo: null,
      error: null
    };
  },
  
  mounted() {
    this.initializeWidget();
  },
  
  beforeDestroy() {
    if (this.widget) {
      this.widget.destroy();
    }
  },
  
  methods: {
    initializeWidget() {
      this.widget = new BjPassAuthWidget({
        clientId: "your-client-id",
        ui: {
          container: this.$refs.authContainer
        },
        onSuccess: (tokens) => {
          console.log("Authentification réussie !", tokens);
          this.isAuthenticated = true;
          this.userInfo = tokens.user_info;
          this.error = null;
          this.$emit('auth-success', tokens);
        },
        onError: (error) => {
          console.error("Erreur d'authentification :", error);
          this.error = error.message;
          this.isAuthenticated = false;
          this.$emit('auth-error', error);
        }
      });
    },
    
    startAuth() {
      if (this.widget) {
        this.widget.startAuthFlow();
      }
    },
    
    logout() {
      // Nettoyer les tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('id_token');
      
      this.isAuthenticated = false;
      this.userInfo = null;
      this.error = null;
      
      this.$emit('logout');
    }
  }
};
</script>
```

## Gestion avancée des sessions

### Session avec refresh automatique

```javascript
class SessionManager {
    constructor() {
        this.refreshTimer = null;
        this.setupSessionMonitoring();
    }
    
    setupSessionMonitoring() {
        // Vérifier la session toutes les 5 minutes
        setInterval(() => {
            this.checkSession();
        }, 5 * 60 * 1000);
        
        // Vérifier au chargement de la page
        this.checkSession();
    }
    
    checkSession() {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!accessToken) {
            this.handleSessionExpired();
            return;
        }
        
        // Vérifier l'expiration du token
        try {
            const decoded = this.decodeJWT(accessToken);
            const currentTime = Math.floor(Date.now() / 1000);
            
            // Si le token expire dans moins de 5 minutes, le rafraîchir
            if (decoded.exp && (decoded.exp - currentTime) < 300) {
                this.refreshSession(refreshToken);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de session:', error);
            this.handleSessionExpired();
        }
    }
    
    async refreshSession(refreshToken) {
        if (!refreshToken) {
            this.handleSessionExpired();
            return;
        }
        
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            });
            
            if (response.ok) {
                const tokens = await response.json();
                
                // Mettre à jour les tokens
                localStorage.setItem('access_token', tokens.access_token);
                if (tokens.refresh_token) {
                    localStorage.setItem('refresh_token', tokens.refresh_token);
                }
                
                console.log('Session rafraîchie avec succès');
            } else {
                throw new Error('Échec du rafraîchissement de session');
            }
        } catch (error) {
            console.error('Erreur lors du rafraîchissement de session:', error);
            this.handleSessionExpired();
        }
    }
    
    handleSessionExpired() {
        // Nettoyer les tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('id_token');
        
        // Rediriger vers la page de connexion
        window.location.href = '/login';
    }
    
    decodeJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    }
}

// Initialiser le gestionnaire de session
const sessionManager = new SessionManager();
```

## Prochaines étapes

- [Système de plugins](plugins.md) pour étendre les fonctionnalités
- [Gestion des erreurs](error-handling.md) pour une gestion robuste
- [Dépannage](../additional-info/troubleshooting.md) pour résoudre les problèmes
