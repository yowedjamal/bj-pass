# Plugins

Guide complet du système de plugins du widget d'authentification bj-pass pour étendre les fonctionnalités.

## Vue d'ensemble

Le système de plugins permet d'étendre les fonctionnalités du widget d'authentification bj-pass de manière modulaire. Les plugins peuvent ajouter des comportements personnalisés, des hooks, et des fonctionnalités spécifiques.

## Plugins intégrés

### AnalyticsPlugin

Suit automatiquement les événements d'authentification pour l'analyse.

#### Activation

```javascript
const widget = new EnhancedBjPassAuthWidget({
    analytics: true,
    // autres configurations
});
```

#### Événements suivis

- `auth_start` - Début de l'authentification
- `auth_success` - Authentification réussie
- `auth_error` - Erreur d'authentification

#### Exemple d'utilisation

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    analytics: true,
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});

// Les événements sont automatiquement suivis
// auth_start -> auth_success ou auth_error
```

### DebugPlugin

Fournit des logs de débogage détaillés et un panneau UI quand le mode debug est activé.

#### Activation

```javascript
const widget = new EnhancedBjPassAuthWidget({
    debug: true,
    // autres configurations
});
```

#### Fonctionnalités

- **Logs détaillés** dans la console
- **Panneau de débogage** dans l'interface
- **Inspection des tokens** en temps réel
- **État de l'authentification** visible
- **Configuration actuelle** affichée

#### Exemple d'utilisation

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    debug: true,
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});

// Le panneau de débogage apparaît automatiquement
// avec toutes les informations en temps réel
```

### RetryPlugin

Répète automatiquement les échanges de tokens échoués.

#### Activation

```javascript
const widget = new EnhancedBjPassAuthWidget({
    maxRetries: 3,
    retryDelay: 1000,
    // autres configurations
});
```

#### Configuration

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `maxRetries` | Number | 0 | Nombre maximum de tentatives |
| `retryDelay` | Number | 1000 | Délai entre les tentatives (ms) |

#### Exemple d'utilisation

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    maxRetries: 3,
    retryDelay: 2000,
    onSuccess: (tokens) => {
        console.log("Authentification réussie après retry !", tokens);
    },
    onError: (error) => {
        console.error("Échec après toutes les tentatives :", error);
    }
});
```

## Création de plugins personnalisés

### Structure d'un plugin

Un plugin doit implémenter une méthode `init(widget)` et peut optionnellement implémenter une méthode `destroy()`.

```javascript
class CustomPlugin {
    init(widget) {
        this.widget = widget;
        
        // Configuration du plugin
        this.setupPlugin();
        
        // Ajout de hooks
        this.addHooks();
    }
    
    setupPlugin() {
        // Initialisation du plugin
        console.log('Plugin personnalisé initialisé');
    }
    
    addHooks() {
        // Ajouter des hooks
        this.widget.addHook('afterTokenExchange', (tokens) => {
            this.handleTokens(tokens);
        });
    }
    
    handleTokens(tokens) {
        // Logique personnalisée
        console.log('Plugin - Tokens traités :', tokens);
    }
    
    destroy() {
        // Nettoyage si nécessaire
        console.log('Plugin personnalisé détruit');
    }
}
```

### Utilisation d'un plugin personnalisé

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

// Enregistrer le plugin
widget.use('custom', new CustomPlugin());

// Utiliser le plugin
const customPlugin = widget.getPlugin('custom');
```

## Exemples de plugins

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
        
        // Ou notifications natives du navigateur
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('bj-pass', { 
                body: message,
                icon: type === 'error' ? '/error-icon.png' : '/success-icon.png'
            });
        }
    }
}
```

### Plugin de stockage sécurisé

```javascript
class SecureStoragePlugin {
    init(widget) {
        this.widget = widget;
        this.setupSecureStorage();
    }
    
    setupSecureStorage() {
        this.widget.addHook('afterTokenExchange', (tokens) => {
            this.storeTokensSecurely(tokens);
        });
        
        this.widget.addHook('beforeDestroy', () => {
            this.cleanupStorage();
        });
    }
    
    storeTokensSecurely(tokens) {
        // Chiffrement des tokens avant stockage
        if (tokens.access_token) {
            const encryptedToken = this.encrypt(tokens.access_token);
            localStorage.setItem('encrypted_access_token', encryptedToken);
        }
        
        if (tokens.refresh_token) {
            const encryptedToken = this.encrypt(tokens.refresh_token);
            localStorage.setItem('encrypted_refresh_token', encryptedToken);
        }
        
        console.log('Tokens stockés de manière sécurisée');
    }
    
    encrypt(text) {
        // Logique de chiffrement simple (à remplacer par une vraie implémentation)
        return btoa(text);
    }
    
    decrypt(encryptedText) {
        // Logique de déchiffrement
        return atob(encryptedText);
    }
    
    cleanupStorage() {
        localStorage.removeItem('encrypted_access_token');
        localStorage.removeItem('encrypted_refresh_token');
        console.log('Stockage sécurisé nettoyé');
    }
}
```

### Plugin d'analytics personnalisé

```javascript
class CustomAnalyticsPlugin {
    constructor(analyticsConfig) {
        this.config = analyticsConfig;
    }
    
    init(widget) {
        this.widget = widget;
        this.setupAnalytics();
    }
    
    setupAnalytics() {
        // Hook pour le début d'authentification
        this.widget.addHook('beforeAuthStart', () => {
            this.trackEvent('auth_start', {
                clientId: this.widget.getConfig().clientId,
                timestamp: new Date().toISOString()
            });
        });
        
        // Hook pour la réussite
        this.widget.addHook('afterTokenExchange', (tokens) => {
            this.trackEvent('auth_success', {
                hasAccessToken: !!tokens.access_token,
                hasRefreshToken: !!tokens.refresh_token,
                hasIdToken: !!tokens.id_token,
                timestamp: new Date().toISOString()
            });
        });
        
        // Hook pour les erreurs
        this.widget.addHook('tokenExchangeError', (error) => {
            this.trackEvent('auth_error', {
                errorCode: error.code,
                errorMessage: error.message,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    trackEvent(eventName, data = {}) {
        // Logique de tracking personnalisée
        console.log(`Custom Analytics: ${eventName}`, data);
        
        // Envoi à votre service d'analytics
        if (this.config.endpoint) {
            this.sendToAnalytics(eventName, data);
        }
        
        // Google Analytics
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }
        
        // Mixpanel
        if (window.mixpanel) {
            window.mixpanel.track(eventName, data);
        }
    }
    
    sendToAnalytics(eventName, data) {
        fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventName,
                data: data,
                timestamp: new Date().toISOString()
            })
        }).catch(error => {
            console.error('Erreur lors de l\'envoi analytics:', error);
        });
    }
}
```

### Plugin de validation personnalisée

```javascript
class ValidationPlugin {
    init(widget) {
        this.widget = widget;
        this.setupValidation();
    }
    
    setupValidation() {
        // Validation avant échange de tokens
        this.widget.addHook('beforeTokenExchange', (code, state) => {
            this.validateExchange(code, state);
        });
        
        // Validation après réception des tokens
        this.widget.addHook('afterTokenExchange', (tokens) => {
            this.validateTokens(tokens);
        });
    }
    
    validateExchange(code, state) {
        // Vérifier que le code n'est pas vide
        if (!code) {
            throw new Error('Code d\'autorisation manquant');
        }
        
        // Vérifier que le state correspond
        const expectedState = sessionStorage.getItem('auth_state');
        if (state !== expectedState) {
            throw new Error('State invalide - possible attaque CSRF');
        }
        
        // Vérifier la longueur du code
        if (code.length < 10) {
            throw new Error('Code d\'autorisation trop court');
        }
        
        console.log('Validation d\'échange réussie');
    }
    
    validateTokens(tokens) {
        // Vérifier la présence des tokens requis
        if (!tokens.access_token) {
            throw new Error('Token d\'accès manquant');
        }
        
        // Vérifier la structure des tokens
        if (typeof tokens.access_token !== 'string') {
            throw new Error('Token d\'accès invalide');
        }
        
        // Vérifier l'expiration si disponible
        if (tokens.expires_in) {
            const expirationTime = Date.now() + (tokens.expires_in * 1000);
            console.log(`Token expire le: ${new Date(expirationTime)}`);
        }
        
        console.log('Validation des tokens réussie');
    }
}
```

## Gestion des plugins

### Enregistrement et désenregistrement

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

// Enregistrer un plugin
widget.use('notifications', new NotificationPlugin());
widget.use('analytics', new CustomAnalyticsPlugin({
    endpoint: 'https://your-analytics.com/events'
}));

// Récupérer un plugin
const analyticsPlugin = widget.getPlugin('analytics');

// Désenregistrer un plugin
widget.unuse('notifications');
```

### Gestion du cycle de vie

```javascript
class LifecyclePlugin {
    init(widget) {
        this.widget = widget;
        this.setupLifecycle();
    }
    
    setupLifecycle() {
        // Hook avant destruction
        this.widget.addHook('beforeDestroy', () => {
            this.cleanup();
        });
        
        // Hook après destruction
        this.widget.addHook('afterDestroy', () => {
            this.finalize();
        });
    }
    
    cleanup() {
        console.log('Plugin - Nettoyage en cours...');
        // Nettoyer les ressources
    }
    
    finalize() {
        console.log('Plugin - Finalisation terminée');
        // Actions finales
    }
    
    destroy() {
        console.log('Plugin - Destruction manuelle');
        // Destruction manuelle si nécessaire
    }
}
```

## Bonnes pratiques

### Gestion des erreurs

```javascript
class SafePlugin {
    init(widget) {
        this.widget = widget;
        this.setupSafeHooks();
    }
    
    setupSafeHooks() {
        this.widget.addHook('afterTokenExchange', (tokens) => {
            try {
                this.handleTokens(tokens);
            } catch (error) {
                console.error('Erreur dans le plugin:', error);
                // Ne pas laisser l'erreur interrompre le flux principal
            }
        });
    }
    
    handleTokens(tokens) {
        // Logique du plugin
        console.log('Traitement sécurisé des tokens');
    }
}
```

### Configuration des plugins

```javascript
class ConfigurablePlugin {
    constructor(config = {}) {
        this.config = {
            enabled: true,
            logLevel: 'info',
            ...config
        };
    }
    
    init(widget) {
        if (!this.config.enabled) {
            console.log('Plugin désactivé');
            return;
        }
        
        this.widget = widget;
        this.setupPlugin();
    }
    
    setupPlugin() {
        console.log(`Plugin configuré avec logLevel: ${this.config.logLevel}`);
        // Configuration du plugin
    }
}

// Utilisation avec configuration
widget.use('configurable', new ConfigurablePlugin({
    enabled: true,
    logLevel: 'debug'
}));
```

## Prochaines étapes

- [Système de hooks](../api-reference/hooks.md) pour plus de détails sur les hooks
- [Exemples avancés](examples.md) pour des cas d'usage complexes
- [Gestion des erreurs](error-handling.md) pour une gestion robuste