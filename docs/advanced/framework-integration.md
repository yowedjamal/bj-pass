# Intégration avec des Frameworks

Ce guide vous explique comment intégrer le widget d'authentification BjPass avec différents frameworks et bibliothèques.

## 🚀 Vue.js

### Installation

```bash
npm install bj-pass-auth-widget
```

### Composant Vue

```vue
<template>
  <div class="auth-container">
    <div v-if="!isAuthenticated" class="login-section">
      <h2>Connexion</h2>
      <div ref="authWidget" class="widget-container"></div>
    </div>
    
    <div v-else class="user-section">
      <h2>Bienvenue, {{ user?.name }}!</h2>
      <div class="user-info">
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p><strong>ID:</strong> {{ user?.sub }}</p>
      </div>
      <button @click="logout" class="logout-btn">Se déconnecter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { BjPassAuthWidget, type BjPassConfig, type UserInfo, type TokenInfo } from 'bj-pass-auth-widget';

// État réactif
const isAuthenticated = ref(false);
const user = ref<UserInfo | null>(null);
const tokens = ref<TokenInfo | null>(null);
const authWidget = ref<HTMLElement>();
const widget = ref<BjPassAuthWidget>();

// Configuration
const config: BjPassConfig = {
  clientId: 'your-client-id',
  environment: 'test',
  scope: 'openid profile email',
  redirectUri: 'http://localhost:3000/callback',
  pkce: true,
  ui: {
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'modern'
  }
};

// Initialisation
onMounted(async () => {
  if (authWidget.value) {
    widget.value = new BjPassAuthWidget({
      ...config,
      ui: {
        ...config.ui,
        container: authWidget.value
      },
      onSuccess: handleAuthSuccess,
      onError: handleAuthError
    });
    
    // Vérifier l'état d'authentification
    await checkAuthStatus();
  }
});

// Nettoyage
onUnmounted(() => {
  if (widget.value) {
    widget.value.destroy();
  }
});

// Gestionnaires d'événements
const handleAuthSuccess = (result: any) => {
  if (result.user) {
    user.value = result.user;
  }
  if (result.tokens) {
    tokens.value = result.tokens;
    storeTokens(result.tokens);
  }
  isAuthenticated.value = true;
};

const handleAuthError = (error: string) => {
  console.error('Erreur d\'authentification:', error);
  isAuthenticated.value = false;
  user.value = null;
  tokens.value = null;
};

// Méthodes
const checkAuthStatus = async () => {
  if (widget.value) {
    const authenticated = widget.value.isAuthenticated();
    if (authenticated) {
      isAuthenticated.value = true;
      tokens.value = widget.value.getTokens();
      user.value = await widget.value.getUserInfo();
    }
  }
};

const logout = async () => {
  if (widget.value) {
    await widget.value.logout();
    isAuthenticated.value = false;
    user.value = null;
    tokens.value = null;
    clearTokens();
  }
};

const storeTokens = (tokens: TokenInfo) => {
  localStorage.setItem('access_token', tokens.accessToken);
  if (tokens.refreshToken) {
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
</script>

<style scoped>
.auth-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.widget-container {
  min-height: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.user-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
```

### Plugin Vue

```typescript
// plugins/bjpass.ts
import type { App } from 'vue';
import { BjPassAuthWidget } from 'bj-pass-auth-widget';

export interface BjPassPluginOptions {
  clientId: string;
  environment?: 'test' | 'production';
  scope?: string;
  redirectUri?: string;
}

export const BjPassPlugin = {
  install: (app: App, options: BjPassPluginOptions) => {
    // Créer une instance globale
    const widget = new BjPassAuthWidget(options);
    
    // Injecter dans l'application
    app.provide('bjpass', widget);
    
    // Ajouter à l'objet global
    app.config.globalProperties.$bjpass = widget;
  }
};

// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { BjPassPlugin } from './plugins/bjpass';

const app = createApp(App);

app.use(BjPassPlugin, {
  clientId: 'your-client-id',
  environment: 'test',
  scope: 'openid profile email',
  redirectUri: 'http://localhost:3000/callback'
});

app.mount('#app');
```

## ⚡ Svelte

### Composant Svelte

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { BjPassAuthWidget, type BjPassConfig, type UserInfo, type TokenInfo } from 'bj-pass-auth-widget';
  
  // État
  let isAuthenticated = false;
  let user: UserInfo | null = null;
  let tokens: TokenInfo | null = null;
  let authContainer: HTMLElement;
  let widget: BjPassAuthWidget;
  
  // Configuration
  const config: BjPassConfig = {
    clientId: 'your-client-id',
    environment: 'test',
    scope: 'openid profile email',
    redirectUri: 'http://localhost:3000/callback',
    pkce: true,
    ui: {
      language: 'fr',
      primaryColor: '#0066cc',
      theme: 'modern'
    }
  };
  
  // Initialisation
  onMount(async () => {
    if (authContainer) {
      widget = new BjPassAuthWidget({
        ...config,
        ui: {
          ...config.ui,
          container: authContainer
        },
        onSuccess: handleAuthSuccess,
        onError: handleAuthError
      });
      
      await checkAuthStatus();
    }
  });
  
  // Nettoyage
  onDestroy(() => {
    if (widget) {
      widget.destroy();
    }
  });
  
  // Gestionnaires d'événements
  const handleAuthSuccess = (result: any) => {
    if (result.user) {
      user = result.user;
    }
    if (result.tokens) {
      tokens = result.tokens;
      storeTokens(result.tokens);
    }
    isAuthenticated = true;
  };
  
  const handleAuthError = (error: string) => {
    console.error('Erreur d\'authentification:', error);
    isAuthenticated = false;
    user = null;
    tokens = null;
  };
  
  // Méthodes
  const checkAuthStatus = async () => {
    if (widget) {
      const authenticated = widget.isAuthenticated();
      if (authenticated) {
        isAuthenticated = true;
        tokens = widget.getTokens();
        user = await widget.getUserInfo();
      }
    }
  };
  
  const logout = async () => {
    if (widget) {
      await widget.logout();
      isAuthenticated = false;
      user = null;
      tokens = null;
      clearTokens();
    }
  };
  
  const storeTokens = (tokens: TokenInfo) => {
    localStorage.setItem('access_token', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refresh_token', tokens.refreshToken);
    }
  };
  
  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };
</script>

<div class="auth-container">
  {#if !isAuthenticated}
    <div class="login-section">
      <h2>Connexion</h2>
      <div bind:this={authContainer} class="widget-container"></div>
    </div>
  {:else}
    <div class="user-section">
      <h2>Bienvenue, {user?.name}!</h2>
      <div class="user-info">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>ID:</strong> {user?.sub}</p>
      </div>
      <button on:click={logout} class="logout-btn">Se déconnecter</button>
    </div>
  {/if}
</div>

<style>
  .auth-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .widget-container {
    min-height: 200px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  
  .user-section {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
  }
  
  .logout-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
  }
</style>
```

## 🎯 Solid.js

### Composant Solid

```tsx
import { createSignal, onMount, onCleanup, createEffect } from 'solid-js';
import { BjPassAuthWidget, type BjPassConfig, type UserInfo, type TokenInfo } from 'bj-pass-auth-widget';

interface AuthComponentProps {
  config: BjPassConfig;
}

export default function AuthComponent(props: AuthComponentProps) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [user, setUser] = createSignal<UserInfo | null>(null);
  const [tokens, setTokens] = createSignal<TokenInfo | null>(null);
  let authContainer: HTMLDivElement | undefined;
  let widget: BjPassAuthWidget | undefined;

  // Initialisation
  onMount(async () => {
    if (authContainer) {
      widget = new BjPassAuthWidget({
        ...props.config,
        ui: {
          ...props.config.ui,
          container: authContainer
        },
        onSuccess: handleAuthSuccess,
        onError: handleAuthError
      });
      
      await checkAuthStatus();
    }
  });

  // Nettoyage
  onCleanup(() => {
    if (widget) {
      widget.destroy();
    }
  });

  // Gestionnaires d'événements
  const handleAuthSuccess = (result: any) => {
    if (result.user) {
      setUser(result.user);
    }
    if (result.tokens) {
      setTokens(result.tokens);
      storeTokens(result.tokens);
    }
    setIsAuthenticated(true);
  };

  const handleAuthError = (error: string) => {
    console.error('Erreur d\'authentification:', error);
    setIsAuthenticated(false);
    setUser(null);
    setTokens(null);
  };

  // Méthodes
  const checkAuthStatus = async () => {
    if (widget) {
      const authenticated = widget.isAuthenticated();
      if (authenticated) {
        setIsAuthenticated(true);
        setTokens(widget.getTokens());
        const userInfo = await widget.getUserInfo();
        setUser(userInfo);
      }
    }
  };

  const logout = async () => {
    if (widget) {
      await widget.logout();
      setIsAuthenticated(false);
      setUser(null);
      setTokens(null);
      clearTokens();
    }
  };

  const storeTokens = (tokens: TokenInfo) => {
    localStorage.setItem('access_token', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refresh_token', tokens.refreshToken);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <div class="auth-container">
      {!isAuthenticated() ? (
        <div class="login-section">
          <h2>Connexion</h2>
          <div ref={authContainer} class="widget-container"></div>
        </div>
      ) : (
        <div class="user-section">
          <h2>Bienvenue, {user()?.name}!</h2>
          <div class="user-info">
            <p><strong>Email:</strong> {user()?.email}</p>
            <p><strong>ID:</strong> {user()?.sub}</p>
          </div>
          <button onClick={logout} class="logout-btn">Se déconnecter</button>
        </div>
      )}
    </div>
  );
}
```

## 🔧 Alpine.js

### Composant Alpine

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentification BjPass - Alpine.js</title>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget@latest/dist/bj-pass-auth-widget.umd.js"></script>
    <style>
        .auth-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .widget-container {
            min-height: 200px;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            background-color: #f9f9f9;
        }
        
        .user-section {
            background-color: #e8f5e8;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .logout-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
        }
        
        .logout-btn:hover {
            background: #c82333;
        }
        
        .status {
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            font-weight: 500;
        }
        
        .status.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="auth-container" x-data="authComponent()">
        <h1>🔐 Authentification BjPass</h1>
        
        <div x-show="!isAuthenticated" class="login-section">
            <h2>Connexion requise</h2>
            <div class="widget-container" x-ref="authContainer"></div>
        </div>
        
        <div x-show="isAuthenticated" class="user-section">
            <h2>👋 Bienvenue, <span x-text="user?.name || 'Utilisateur'"></span>!</h2>
            <div class="user-info">
                <p><strong>Email:</strong> <span x-text="user?.email || 'Non spécifié'"></span></p>
                <p><strong>ID:</strong> <span x-text="user?.sub || 'Non spécifié'"></span></p>
            </div>
            <button @click="logout()" class="logout-btn">Se déconnecter</button>
        </div>
        
        <div x-show="status.message" 
             :class="`status ${status.type}`" 
             x-text="status.message">
        </div>
    </div>

    <script>
        function authComponent() {
            return {
                isAuthenticated: false,
                user: null,
                tokens: null,
                status: { message: '', type: '' },
                widget: null,
                
                init() {
                    this.initializeWidget();
                },
                
                initializeWidget() {
                    const config = {
                        clientId: 'your-client-id',
                        environment: 'test',
                        scope: 'openid profile email',
                        redirectUri: 'http://localhost:3000/callback',
                        pkce: true,
                        ui: {
                            container: this.$refs.authContainer,
                            language: 'fr',
                            primaryColor: '#0066cc',
                            theme: 'modern'
                        },
                        onSuccess: (result) => this.handleAuthSuccess(result),
                        onError: (error) => this.handleAuthError(error)
                    };
                    
                    this.widget = new BjPassAuthWidget(config);
                    this.checkAuthStatus();
                },
                
                async checkAuthStatus() {
                    if (this.widget) {
                        const authenticated = this.widget.isAuthenticated();
                        if (authenticated) {
                            this.isAuthenticated = true;
                            this.tokens = this.widget.getTokens();
                            this.user = await this.widget.getUserInfo();
                        }
                    }
                },
                
                handleAuthSuccess(result) {
                    if (result.user) {
                        this.user = result.user;
                    }
                    if (result.tokens) {
                        this.tokens = result.tokens;
                        this.storeTokens(result.tokens);
                    }
                    
                    this.isAuthenticated = true;
                    this.showStatus('Authentification réussie !', 'success');
                },
                
                handleAuthError(error) {
                    console.error('Erreur d\'authentification:', error);
                    this.isAuthenticated = false;
                    this.user = null;
                    this.tokens = null;
                    this.showStatus(`Erreur: ${error}`, 'error');
                },
                
                async logout() {
                    if (this.widget) {
                        try {
                            await this.widget.logout();
                            this.isAuthenticated = false;
                            this.user = null;
                            this.tokens = null;
                            this.clearTokens();
                            this.showStatus('Déconnexion effectuée', 'success');
                        } catch (error) {
                            console.error('Erreur lors de la déconnexion:', error);
                            this.showStatus('Erreur lors de la déconnexion', 'error');
                        }
                    }
                },
                
                storeTokens(tokens) {
                    localStorage.setItem('access_token', tokens.accessToken);
                    if (tokens.refreshToken) {
                        localStorage.setItem('refresh_token', tokens.refreshToken);
                    }
                },
                
                clearTokens() {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                },
                
                showStatus(message, type) {
                    this.status = { message, type };
                    setTimeout(() => {
                        this.status.message = '';
                    }, 5000);
                }
            };
        }
    </script>
</body>
</html>
```

## 🎨 Stencil.js

### Composant Stencil

```tsx
import { Component, h, State, Element } from '@stencil/core';
import { BjPassAuthWidget, type BjPassConfig, type UserInfo, type TokenInfo } from 'bj-pass-auth-widget';

@Component({
  tag: 'bjpass-auth',
  styleUrl: 'bjpass-auth.css',
  shadow: true
})
export class BjpassAuth {
  @Element() el: HTMLElement;
  @State() isAuthenticated = false;
  @State() user: UserInfo | null = null;
  @State() tokens: TokenInfo | null = null;
  @State() status = { message: '', type: '' };
  
  private widget: BjPassAuthWidget;
  private authContainer: HTMLDivElement;
  
  componentDidLoad() {
    this.initializeWidget();
  }
  
  disconnectedCallback() {
    if (this.widget) {
      this.widget.destroy();
    }
  }
  
  private initializeWidget() {
    const config: BjPassConfig = {
      clientId: 'your-client-id',
      environment: 'test',
      scope: 'openid profile email',
      redirectUri: 'http://localhost:3000/callback',
      pkce: true,
      ui: {
        container: this.authContainer,
        language: 'fr',
        primaryColor: '#0066cc',
        theme: 'modern'
      },
      onSuccess: (result) => this.handleAuthSuccess(result),
      onError: (error) => this.handleAuthError(error)
    };
    
    this.widget = new BjPassAuthWidget(config);
    this.checkAuthStatus();
  }
  
  private async checkAuthStatus() {
    if (this.widget) {
      const authenticated = this.widget.isAuthenticated();
      if (authenticated) {
        this.isAuthenticated = true;
        this.tokens = this.widget.getTokens();
        this.user = await this.widget.getUserInfo();
      }
    }
  }
  
  private handleAuthSuccess(result: any) {
    if (result.user) {
      this.user = result.user;
    }
    if (result.tokens) {
      this.tokens = result.tokens;
      this.storeTokens(result.tokens);
    }
    
    this.isAuthenticated = true;
    this.showStatus('Authentification réussie !', 'success');
  }
  
  private handleAuthError(error: string) {
    console.error('Erreur d\'authentification:', error);
    this.isAuthenticated = false;
    this.user = null;
    this.tokens = null;
    this.showStatus(`Erreur: ${error}`, 'error');
  }
  
  private async logout() {
    if (this.widget) {
      try {
        await this.widget.logout();
        this.isAuthenticated = false;
        this.user = null;
        this.tokens = null;
        this.clearTokens();
        this.showStatus('Déconnexion effectuée', 'success');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        this.showStatus('Erreur lors de la déconnexion', 'error');
      }
    }
  }
  
  private storeTokens(tokens: TokenInfo) {
    localStorage.setItem('access_token', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refresh_token', tokens.refreshToken);
    }
  }
  
  private clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  
  private showStatus(message: string, type: string) {
    this.status = { message, type };
    setTimeout(() => {
      this.status.message = '';
    }, 5000);
  }
  
  render() {
    return (
      <div class="auth-container">
        <h1>🔐 Authentification BjPass</h1>
        
        {!this.isAuthenticated ? (
          <div class="login-section">
            <h2>Connexion requise</h2>
            <div 
              ref={(el) => this.authContainer = el} 
              class="widget-container">
            </div>
          </div>
        ) : (
          <div class="user-section">
            <h2>👋 Bienvenue, {this.user?.name || 'Utilisateur'}!</h2>
            <div class="user-info">
              <p><strong>Email:</strong> {this.user?.email || 'Non spécifié'}</p>
              <p><strong>ID:</strong> {this.user?.sub || 'Non spécifié'}</p>
            </div>
            <button onClick={() => this.logout()} class="logout-btn">
              Se déconnecter
            </button>
          </div>
        )}
        
        {this.status.message && (
          <div class={`status ${this.status.type}`}>
            {this.status.message}
          </div>
        )}
      </div>
    );
  }
}
```

## 🔧 Support

Pour plus d'informations sur l'intégration avec des frameworks, consultez :
- [Documentation complète](../README.md)
- [Guide de démarrage](../getting-started/installation.md)
- [Types TypeScript](../api-reference/types.md)
