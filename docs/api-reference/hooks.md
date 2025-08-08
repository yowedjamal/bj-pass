# Système de Hooks

Guide complet du système de hooks du widget d'authentification bj-pass pour personnaliser le comportement.

## Vue d'ensemble

Les hooks permettent d'exécuter du code à des moments spécifiques du flux d'authentification. Ils offrent une flexibilité maximale pour personnaliser le comportement du widget.

## Hooks disponibles

### Hooks d'authentification

| Hook | Déclenchement | Paramètres | Description |
|------|---------------|------------|-------------|
| `beforeAuthStart` | Avant de démarrer le flux d'authentification | Aucun | Permet de préparer l'interface ou valider les conditions |
| `afterAuthStart` | Après avoir démarré le flux d'authentification | Aucun | Confirme que le processus a commencé |
| `authStartError` | Quand le démarrage de l'authentification échoue | `error` | Gère les erreurs de démarrage |

### Hooks d'échange de tokens

| Hook | Déclenchement | Paramètres | Description |
|------|---------------|------------|-------------|
| `beforeTokenExchange` | Avant d'échanger le code contre des tokens | `code`, `state` | Permet de modifier ou valider les paramètres |
| `afterTokenExchange` | Après un échange de tokens réussi | `tokens` | Traite les tokens reçus |
| `tokenExchangeError` | Quand l'échange de tokens échoue | `error` | Gère les erreurs d'échange |

### Hooks de cycle de vie

| Hook | Déclenchement | Paramètres | Description |
|------|---------------|------------|-------------|
| `beforeDestroy` | Avant la destruction du widget | Aucun | Permet le nettoyage personnalisé |
| `afterDestroy` | Après la destruction du widget | Aucun | Confirme la destruction |

## Utilisation des hooks

### Ajout d'un hook

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

// Ajouter un hook
widget.addHook('afterTokenExchange', (tokens) => {
    console.log('Tokens reçus :', tokens);
    localStorage.setItem('access_token', tokens.access_token);
});
```

### Ajout de plusieurs hooks

```javascript
// Hook avant démarrage
widget.addHook('beforeAuthStart', () => {
    console.log("Démarrage de l'authentification...");
    showLoadingSpinner();
});

// Hook après réception des tokens
widget.addHook('afterTokenExchange', (tokens) => {
    console.log("Échange de tokens réussi");
    hideLoadingSpinner();
    storeTokens(tokens);
});

// Hook en cas d'erreur
widget.addHook('tokenExchangeError', (error) => {
    console.error("Erreur d'échange :", error);
    hideLoadingSpinner();
    showErrorMessage(error.message);
});
```

## Exemples d'utilisation

### Gestion des états de chargement

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

// Afficher le spinner au démarrage
widget.addHook('beforeAuthStart', () => {
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('login-button').disabled = true;
});

// Masquer le spinner après réception des tokens
widget.addHook('afterTokenExchange', (tokens) => {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('login-button').disabled = false;
    handleSuccessfulAuth(tokens);
});

// Masquer le spinner en cas d'erreur
widget.addHook('tokenExchangeError', (error) => {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('login-button').disabled = false;
    handleAuthError(error);
});
```

### Analytics et tracking

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

// Tracking du début d'authentification
widget.addHook('beforeAuthStart', () => {
    trackEvent('auth_start', {
        timestamp: new Date().toISOString(),
        clientId: widget.getConfig().clientId
    });
});

// Tracking de la réussite
widget.addHook('afterTokenExchange', (tokens) => {
    trackEvent('auth_success', {
        timestamp: new Date().toISOString(),
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token
    });
});

// Tracking des erreurs
widget.addHook('tokenExchangeError', (error) => {
    trackEvent('auth_error', {
        timestamp: new Date().toISOString(),
        errorCode: error.code,
        errorMessage: error.message
    });
});
```

### Stockage personnalisé des tokens

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

widget.addHook('afterTokenExchange', (tokens) => {
    // Stockage sécurisé des tokens
    if (tokens.access_token) {
        secureStorage.setItem('access_token', tokens.access_token);
    }
    
    if (tokens.refresh_token) {
        secureStorage.setItem('refresh_token', tokens.refresh_token);
    }
    
    if (tokens.id_token) {
        secureStorage.setItem('id_token', tokens.id_token);
    }
    
    // Mise à jour de l'interface utilisateur
    updateUserInterface(tokens);
});
```

### Validation personnalisée

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

// Validation avant échange de tokens
widget.addHook('beforeTokenExchange', (code, state) => {
    // Vérifier que le code n'est pas vide
    if (!code) {
        throw new Error('Code d\'autorisation manquant');
    }
    
    // Vérifier que le state correspond
    const expectedState = sessionStorage.getItem('auth_state');
    if (state !== expectedState) {
        throw new Error('State invalide');
    }
    
    console.log('Validation réussie, échange de tokens...');
});
```

### Nettoyage personnalisé

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

// Nettoyage avant destruction
widget.addHook('beforeDestroy', () => {
    // Nettoyer les listeners personnalisés
    cleanupCustomListeners();
    
    // Sauvegarder l'état si nécessaire
    saveWidgetState();
    
    console.log('Widget en cours de destruction...');
});

// Confirmation après destruction
widget.addHook('afterDestroy', () => {
    console.log('Widget détruit avec succès');
});
```

## Hooks dans les plugins

### Création d'un plugin avec hooks

```javascript
class AnalyticsPlugin {
    init(widget) {
        this.widget = widget;
        this.setupHooks();
    }
    
    setupHooks() {
        // Hook pour le début d'authentification
        this.widget.addHook('beforeAuthStart', () => {
            this.trackEvent('auth_start');
        });
        
        // Hook pour la réussite
        this.widget.addHook('afterTokenExchange', (tokens) => {
            this.trackEvent('auth_success', { tokens });
        });
        
        // Hook pour les erreurs
        this.widget.addHook('tokenExchangeError', (error) => {
            this.trackEvent('auth_error', { error });
        });
    }
    
    trackEvent(eventName, data = {}) {
        // Logique de tracking
        console.log(`Analytics: ${eventName}`, data);
        
        // Envoi à votre service d'analytics
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }
    }
}

// Utilisation
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

widget.use('analytics', new AnalyticsPlugin());
```

### Plugin de notifications

```javascript
class NotificationPlugin {
    init(widget) {
        this.widget = widget;
        this.setupNotifications();
    }
    
    setupNotifications() {
        // Notification de succès
        this.widget.addHook('afterTokenExchange', (tokens) => {
            this.showSuccessNotification('Authentification réussie !');
        });
        
        // Notification d'erreur
        this.widget.addHook('tokenExchangeError', (error) => {
            this.showErrorNotification(`Erreur : ${error.message}`);
        });
        
        // Notification de démarrage
        this.widget.addHook('beforeAuthStart', () => {
            this.showInfoNotification('Démarrage de l\'authentification...');
        });
    }
    
    showSuccessNotification(message) {
        this.showNotification(message, 'success');
    }
    
    showErrorNotification(message) {
        this.showNotification(message, 'error');
    }
    
    showInfoNotification(message) {
        this.showNotification(message, 'info');
    }
    
    showNotification(message, type) {
        // Logique d'affichage des notifications
        console.log(`Notification [${type}]: ${message}`);
        
        // Utilisation d'une bibliothèque de notifications
        if (window.toastr) {
            window.toastr[type](message);
        }
    }
}
```

## Bonnes pratiques

### Gestion des erreurs dans les hooks

```javascript
widget.addHook('afterTokenExchange', (tokens) => {
    try {
        // Logique personnalisée
        processTokens(tokens);
        updateUI(tokens);
    } catch (error) {
        console.error('Erreur dans le hook afterTokenExchange:', error);
        // Ne pas laisser l'erreur interrompre le flux principal
    }
});
```

### Hooks conditionnels

```javascript
// Hook qui ne s'exécute que dans certains cas
widget.addHook('afterTokenExchange', (tokens) => {
    // Vérifier si l'utilisateur est un administrateur
    if (tokens.user_info && tokens.user_info.role === 'admin') {
        enableAdminFeatures();
    }
    
    // Vérifier si c'est la première connexion
    if (tokens.user_info && tokens.user_info.first_login) {
        showWelcomeMessage();
    }
});
```

### Nettoyage des hooks

```javascript
// Stocker les références des callbacks pour pouvoir les supprimer
const beforeAuthCallback = () => {
    console.log('Démarrage de l\'authentification...');
};

const afterTokenCallback = (tokens) => {
    console.log('Tokens reçus:', tokens);
};

// Ajouter les hooks
widget.addHook('beforeAuthStart', beforeAuthCallback);
widget.addHook('afterTokenExchange', afterTokenCallback);

// Plus tard, supprimer les hooks si nécessaire
// Note: Le widget actuel ne supporte pas la suppression de hooks individuels
// mais vous pouvez détruire le widget complet
widget.destroy();
```

## Prochaines étapes

- [API Enhanced](../enhanced-api.md) pour plus de détails sur les plugins
- [Exemples avancés](../advanced/examples.md) pour des cas d'usage complexes
- [Gestion des erreurs](../advanced/error-handling.md) pour une gestion robuste
