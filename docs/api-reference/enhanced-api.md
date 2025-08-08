# API Enhanced

Référence de l'API pour le widget d'authentification bj-pass amélioré avec support des plugins et hooks.

## EnhancedBjPassAuthWidget

Étend BjPassAuthWidget avec le support des plugins et du système de hooks.

### Constructeur

```javascript
new EnhancedBjPassAuthWidget(config)
```

Crée une nouvelle instance de EnhancedBjPassAuthWidget avec support des plugins.

#### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `config` | Object | Objet de configuration étendu (voir [Configuration](../getting-started/configuration.md)) |

#### Exemple

```javascript
const enhancedWidget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    debug: true,
    analytics: true,
    maxRetries: 3,
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});
```

### Méthodes

#### use(name, plugin)

Enregistre un plugin avec le widget.

```javascript
widget.use('custom', new CustomPlugin());
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `name` | String | Nom du plugin |
| `plugin` | Object | Instance du plugin avec méthode `init()` |

**Retourne :** `this` - Pour l'enchaînement de méthodes

#### unuse(name)

Désenregistre un plugin du widget.

```javascript
widget.unuse('custom');
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `name` | String | Nom du plugin à supprimer |

**Retourne :** `this` - Pour l'enchaînement de méthodes

#### getPlugin(name)

Récupère une instance de plugin enregistrée.

```javascript
const plugin = widget.getPlugin('analytics');
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `name` | String | Nom du plugin |

**Retourne :** `Plugin` - L'instance du plugin

#### addHook(hookName, callback)

Ajoute un callback de hook pour un événement spécifique.

```javascript
widget.addHook('afterTokenExchange', (tokens) => {
    console.log('Tokens reçus :', tokens);
    localStorage.setItem('access_token', tokens.access_token);
});
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `hookName` | String | Nom de l'événement hook |
| `callback` | Function | Fonction à appeler quand le hook est déclenché |

**Retourne :** `this` - Pour l'enchaînement de méthodes

## Plugins intégrés

### AnalyticsPlugin

Suit automatiquement les événements d'authentification.

```javascript
const widget = new EnhancedBjPassAuthWidget({
    analytics: true,
    // autres configurations
});
```

**Événements suivis :**
- `auth_start` - Début de l'authentification
- `auth_success` - Authentification réussie
- `auth_error` - Erreur d'authentification

### DebugPlugin

Fournit des logs de débogage détaillés et un panneau UI quand le mode debug est activé.

```javascript
const widget = new EnhancedBjPassAuthWidget({
    debug: true,
    // autres configurations
});
```

**Fonctionnalités :**
- Logs détaillés dans la console
- Panneau de débogage dans l'interface
- Inspection des tokens
- État de l'authentification en temps réel

### RetryPlugin

Répète automatiquement les échanges de tokens échoués.

```javascript
const widget = new EnhancedBjPassAuthWidget({
    maxRetries: 3,
    retryDelay: 1000,
    // autres configurations
});
```

**Configuration :**
- `maxRetries` : Nombre maximum de tentatives
- `retryDelay` : Délai entre les tentatives en millisecondes

## Système de hooks

### Hooks disponibles

| Hook | Déclenchement | Paramètres |
|------|---------------|------------|
| `beforeAuthStart` | Avant de démarrer le flux d'authentification | Aucun |
| `afterAuthStart` | Après avoir démarré le flux d'authentification | Aucun |
| `authStartError` | Quand le démarrage de l'authentification échoue | Objet d'erreur |
| `beforeTokenExchange` | Avant d'échanger le code contre des tokens | `code`, `state` |
| `afterTokenExchange` | Après un échange de tokens réussi | `tokens` |
| `tokenExchangeError` | Quand l'échange de tokens échoue | Objet d'erreur |
| `beforeDestroy` | Avant la destruction du widget | Aucun |
| `afterDestroy` | Après la destruction du widget | Aucun |

### Exemples d'utilisation des hooks

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id"
});

// Hook avant le démarrage de l'authentification
widget.addHook('beforeAuthStart', () => {
    console.log("Démarrage du flux d'authentification...");
    showLoadingSpinner();
});

// Hook après réception des tokens
widget.addHook('afterTokenExchange', (tokens) => {
    console.log("Tokens reçus :", tokens);
    trackAnalytics('auth_success');
    storeTokens(tokens);
});

// Hook en cas d'erreur
widget.addHook('tokenExchangeError', (error) => {
    console.error("Erreur d'échange de tokens :", error);
    trackAnalytics('auth_error', { error: error.code });
});
```

## Création de plugins personnalisés

### Structure d'un plugin

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

## Exemples complets

### Widget avec tous les plugins

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
    showLoadingIndicator();
});

widget.addHook('afterTokenExchange', (tokens) => {
    console.log("Échange de tokens réussi");
    hideLoadingIndicator();
    trackUserLogin(tokens);
});

// Plugin personnalisé
widget.use('notifications', new NotificationPlugin());
```

### Plugin de notifications

```javascript
class NotificationPlugin {
    init(widget) {
        this.widget = widget;
        this.setupNotifications();
    }
    
    setupNotifications() {
        this.widget.addHook('afterTokenExchange', (tokens) => {
            this.showSuccessNotification('Authentification réussie !');
        });
        
        this.widget.addHook('tokenExchangeError', (error) => {
            this.showErrorNotification('Erreur d\'authentification : ' + error.message);
        });
    }
    
    showSuccessNotification(message) {
        // Afficher une notification de succès
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('bj-pass', { body: message });
        }
    }
    
    showErrorNotification(message) {
        // Afficher une notification d'erreur
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('bj-pass', { 
                body: message,
                icon: '/error-icon.png'
            });
        }
    }
}
```

## Prochaines étapes

- [API Factory](../factory-api.md) pour la création de widgets multiples
- [Système de hooks](../hooks.md) pour plus de détails sur les hooks
- [Exemples avancés](../advanced/examples.md) pour des cas d'usage complexes
