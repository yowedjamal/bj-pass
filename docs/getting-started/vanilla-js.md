# Utilisation avec Vanilla JavaScript

Ce guide vous explique comment utiliser le widget d'authentification BjPass dans vos projets JavaScript vanilla, sans framework.

## 🚀 Installation

### Via CDN (Recommandé)

```html
<script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget@latest/dist/bj-pass-auth-widget.umd.js"></script>
```

### Via NPM

```bash
npm install bj-pass-auth-widget
```

```javascript
import BjPassAuthWidget from 'bj-pass-auth-widget';
```

### Auto-initialisation

```html
<div id="auth-container" data-bj-pass-widget='{"clientId":"your-client-id"}'>
</div>
```

## 📦 Ce qui est inclus

- **BjPassAuthWidget** : Classe principale pour l'authentification
- **EnhancedBjPassAuthWidget** : Version étendue avec fonctionnalités avancées
- **BjPassWidgetFactory** : Factory pour créer des widgets avec thèmes
- **Support UMD/ESM/CommonJS** : Compatible avec tous les environnements

## 🔧 Configuration rapide

### 1. Configuration de base

```javascript
const widget = new BjPassAuthWidget({
  clientId: 'your-client-id',
  environment: 'test', // ou 'production'
  onSuccess: (tokens) => {
    console.log('Authentification réussie:', tokens);
  },
  onError: (error) => {
    console.error('Erreur:', error);
  }
});
```

### 2. Configuration avancée

```javascript
const widget = new BjPassAuthWidget({
  clientId: 'your-client-id',
  environment: 'production',
  scope: 'openid profile email',
  redirectUri: 'https://your-domain.com/auth/callback',
  pkce: true,
  verifyAccessToken: true,
  ui: {
    primaryColor: '#0066cc',
    language: 'fr',
    theme: 'default'
  },
  onSuccess: (tokens) => {
    // Gérer le succès
    console.log('Utilisateur connecté:', tokens);
    localStorage.setItem('access_token', tokens.accessToken);
  },
  onError: (error) => {
    // Gérer l'erreur
    console.error('Échec de l\'authentification:', error);
  }
});
```

## 🎯 Utilisation de base

### Initialisation et démarrage

```javascript
// Créer l'instance du widget
const authWidget = new BjPassAuthWidget({
  clientId: 'your-client-id',
  environment: 'test',
  onSuccess: handleAuthSuccess,
  onError: handleAuthError
});

// Démarrer l'authentification
async function startAuth() {
  try {
    await authWidget.startAuthFlow();
  } catch (error) {
    console.error('Erreur lors du démarrage:', error);
  }
}

// Gestionnaires d'événements
function handleAuthSuccess(result) {
  console.log('Authentification réussie:', result);
  
  if (result.user) {
    displayUserInfo(result.user);
  }
  
  if (result.tokens) {
    storeTokens(result.tokens);
    updateUI(true);
  }
}

function handleAuthError(error) {
  console.error('Erreur d\'authentification:', error);
  showErrorMessage(error);
  updateUI(false);
}

// Mettre à jour l'interface
function updateUI(isAuthenticated) {
  const loginBtn = document.getElementById('login-btn');
  const userInfo = document.getElementById('user-info');
  
  if (isAuthenticated) {
    loginBtn.style.display = 'none';
    userInfo.style.display = 'block';
  } else {
    loginBtn.style.display = 'block';
    userInfo.style.display = 'none';
  }
}
```

## 🔧 Support

Pour plus d'informations, consultez :
- [Documentation complète](../README.md)
- [Guide de déploiement](../DEPLOYMENT.md)
- [Référence API](../api-reference/core-api.md)
