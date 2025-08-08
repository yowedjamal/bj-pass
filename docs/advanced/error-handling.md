# Gestion des erreurs

Guide complet de la gestion des erreurs pour le widget d'authentification bj-pass.

## Vue d'ensemble

Le widget bj-pass fournit une gestion d'erreurs complète avec des codes d'erreur standardisés et des messages conviviaux pour une expérience utilisateur optimale.

## Codes d'erreur

### Erreurs OAuth 2.0

| Code | Description | Solution recommandée |
|------|-------------|---------------------|
| `invalid_token` | Token invalide ou expiré | Demander une nouvelle authentification |
| `insufficient_scope` | Permissions insuffisantes | Vérifier les scopes demandés |
| `invalid_grant` | Code d'autorisation invalide ou expiré | Redémarrer le flux d'authentification |
| `access_denied` | Authentification annulée | Informer l'utilisateur et proposer de réessayer |
| `invalid_request` | Requête invalide | Vérifier la configuration du widget |
| `invalid_scope` | Permissions invalides | Corriger les scopes dans la configuration |
| `server_error` | Erreur du serveur | Réessayer plus tard |

### Erreurs spécifiques au widget

| Code | Description | Solution recommandée |
|------|-------------|---------------------|
| `popup_closed` | La fenêtre d'authentification a été fermée | Informer l'utilisateur et proposer de réessayer |
| `browser_error` | Navigateur non supporté | Afficher un message de compatibilité |
| `backend_error` | Erreur du backend | Vérifier la configuration backend |
| `token_error` | Erreur de validation du token | Vérifier la configuration de validation |

## Gestion des erreurs

### Callback onError

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onError: (error) => {
        console.error("Erreur d'authentification :", error);
        
        // Gestion basée sur le code d'erreur
        switch (error.code) {
            case 'popup_closed':
                showUserMessage("La fenêtre d'authentification a été fermée. Veuillez réessayer.");
                break;
            case 'access_denied':
                showUserMessage("Authentification annulée. Vous pouvez réessayer à tout moment.");
                break;
            case 'invalid_token':
                showUserMessage("Session expirée. Veuillez vous reconnecter.");
                break;
            default:
                showUserMessage("Une erreur s'est produite. Veuillez réessayer.");
        }
    }
});
```

### Gestion avancée avec hooks

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

// Hook pour les erreurs de démarrage
widget.addHook('authStartError', (error) => {
    console.error("Erreur au démarrage de l'authentification :", error);
    
    if (error.code === 'browser_error') {
        showBrowserCompatibilityMessage();
    } else if (error.code === 'popup_blocked') {
        showPopupBlockedMessage();
    }
});

// Hook pour les erreurs d'échange de tokens
widget.addHook('tokenExchangeError', (error) => {
    console.error("Erreur d'échange de tokens :", error);
    
    if (error.code === 'invalid_grant') {
        // Le code a expiré, redémarrer l'authentification
        setTimeout(() => {
            widget.startAuthFlow();
        }, 1000);
    } else if (error.code === 'server_error') {
        showRetryMessage();
    }
});
```

## Messages d'erreur personnalisés

### Fonction de gestion des messages

```javascript
function handleAuthError(error) {
    const errorMessages = {
        'popup_closed': {
            title: 'Fenêtre fermée',
            message: 'La fenêtre d\'authentification a été fermée. Veuillez réessayer.',
            type: 'warning'
        },
        'access_denied': {
            title: 'Authentification annulée',
            message: 'Vous avez annulé l\'authentification. Vous pouvez réessayer à tout moment.',
            type: 'info'
        },
        'invalid_token': {
            title: 'Session expirée',
            message: 'Votre session a expiré. Veuillez vous reconnecter.',
            type: 'error'
        },
        'server_error': {
            title: 'Erreur serveur',
            message: 'Le serveur d\'authentification est temporairement indisponible. Veuillez réessayer dans quelques minutes.',
            type: 'error'
        },
        'browser_error': {
            title: 'Navigateur non supporté',
            message: 'Votre navigateur n\'est pas compatible avec cette fonctionnalité. Veuillez utiliser un navigateur moderne.',
            type: 'error'
        },
        'default': {
            title: 'Erreur',
            message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
            type: 'error'
        }
    };
    
    const errorInfo = errorMessages[error.code] || errorMessages.default;
    
    showNotification(errorInfo.title, errorInfo.message, errorInfo.type);
    
    // Log pour le débogage
    console.error('Erreur d\'authentification:', {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString()
    });
}

// Utilisation
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onError: handleAuthError
});
```

### Affichage des notifications

```javascript
function showNotification(title, message, type = 'error') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-header">
            <h4>${title}</h4>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="notification-body">
            <p>${message}</p>
        </div>
    `;
    
    // Ajouter au DOM
    const container = document.getElementById('notification-container') || document.body;
    container.appendChild(notification);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
```

## Gestion des erreurs réseau

### Détection des erreurs réseau

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    onError: (error) => {
        // Vérifier si c'est une erreur réseau
        if (error.code === 'network_error' || error.message.includes('fetch')) {
            handleNetworkError(error);
        } else {
            handleAuthError(error);
        }
    }
});

function handleNetworkError(error) {
    console.error("Erreur réseau :", error);
    
    // Vérifier la connectivité
    if (!navigator.onLine) {
        showNotification(
            'Pas de connexion',
            'Vérifiez votre connexion internet et réessayez.',
            'warning'
        );
    } else {
        showNotification(
            'Erreur de connexion',
            'Impossible de se connecter au serveur. Veuillez réessayer.',
            'error'
        );
    }
}
```

### Retry automatique

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    maxRetries: 3,
    retryDelay: 2000,
    onError: (error) => {
        if (error.code === 'server_error' || error.code === 'network_error') {
            // Le retry automatique est géré par le RetryPlugin
            console.log("Retry automatique en cours...");
        } else {
            handleAuthError(error);
        }
    }
});
```

## Gestion des erreurs de configuration

### Validation de la configuration

```javascript
function validateWidgetConfig(config) {
    const errors = [];
    
    // Vérifier les paramètres requis
    if (!config.clientId) {
        errors.push('clientId est requis');
    }
    
    // Vérifier l'environnement
    if (config.environment && !['test', 'production'].includes(config.environment)) {
        errors.push('environment doit être "test" ou "production"');
    }
    
    // Vérifier la configuration UI
    if (config.ui) {
        if (config.ui.language && !['fr', 'en'].includes(config.ui.language)) {
            errors.push('ui.language doit être "fr" ou "en"');
        }
        
        if (config.ui.theme && !['default', 'dark', 'modern', 'minimal'].includes(config.ui.theme)) {
            errors.push('ui.theme doit être "default", "dark", "modern" ou "minimal"');
        }
    }
    
    return errors;
}

// Utilisation
const config = {
    clientId: "your-client-id",
    environment: "invalid-env",
    ui: {
        language: "invalid-lang"
    }
};

const errors = validateWidgetConfig(config);
if (errors.length > 0) {
    console.error("Erreurs de configuration :", errors);
    // Afficher les erreurs à l'utilisateur
    showConfigurationErrors(errors);
} else {
    const widget = new BjPassAuthWidget(config);
}
```

## Logging et monitoring

### Logging structuré

```javascript
class ErrorLogger {
    static log(error, context = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            error: {
                code: error.code,
                message: error.message,
                details: error.details
            },
            context: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                ...context
            }
        };
        
        // Log local
        console.error('Erreur bj-pass:', logEntry);
        
        // Envoi au service de monitoring (optionnel)
        this.sendToMonitoring(logEntry);
    }
    
    static sendToMonitoring(logEntry) {
        // Envoyer à votre service de monitoring
        fetch('/api/logs/errors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logEntry)
        }).catch(err => {
            console.error('Erreur lors de l\'envoi du log:', err);
        });
    }
}

// Utilisation
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onError: (error) => {
        ErrorLogger.log(error, {
            widgetId: 'main-auth-widget',
            environment: 'production'
        });
        
        handleAuthError(error);
    }
});
```

## Gestion des erreurs en production

### Configuration de production

```javascript
const productionConfig = {
    clientId: "prod-client-id",
    environment: "production",
    onError: (error) => {
        // Logging en production
        ErrorLogger.log(error, {
            environment: 'production',
            userId: getCurrentUserId()
        });
        
        // Messages utilisateur en production
        const userFriendlyMessages = {
            'popup_closed': 'Veuillez réessayer l\'authentification.',
            'access_denied': 'Authentification annulée. Vous pouvez réessayer.',
            'server_error': 'Service temporairement indisponible. Veuillez réessayer plus tard.',
            'default': 'Une erreur s\'est produite. Veuillez réessayer.'
        };
        
        const message = userFriendlyMessages[error.code] || userFriendlyMessages.default;
        showUserFriendlyError(message);
    }
};
```

### Gestion des erreurs critiques

```javascript
function handleCriticalError(error) {
    // Erreurs qui nécessitent une action immédiate
    const criticalErrors = ['browser_error', 'invalid_config'];
    
    if (criticalErrors.includes(error.code)) {
        // Afficher un message critique
        showCriticalError(error);
        
        // Désactiver le widget
        if (window.bjPassWidget) {
            window.bjPassWidget.destroy();
        }
        
        // Rediriger vers une page d'erreur si nécessaire
        if (error.code === 'browser_error') {
            window.location.href = '/browser-compatibility';
        }
    }
}

function showCriticalError(error) {
    const criticalMessage = document.createElement('div');
    criticalMessage.className = 'critical-error';
    criticalMessage.innerHTML = `
        <div class="critical-error-content">
            <h2>Erreur critique</h2>
            <p>${error.message}</p>
            <p>Veuillez contacter le support technique.</p>
            <button onclick="window.location.reload()">Recharger la page</button>
        </div>
    `;
    
    document.body.appendChild(criticalMessage);
}
```

## Prochaines étapes

- [Exemples avancés](examples.md) pour des cas d'usage complexes
- [Système de plugins](plugins.md) pour étendre la gestion d'erreurs
- [Dépannage](../additional-info/troubleshooting.md) pour résoudre les problèmes courants