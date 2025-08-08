# Configuration

Ce guide détaille toutes les options de configuration disponibles pour le widget d'authentification bj-pass.

## Options de configuration

### Paramètres de base

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `clientId` | String | Requis | Votre ID client OAuth |
| `environment` | String | "test" | Environnement à utiliser ("test" ou "production") |
| `authServer` | String | "main-as" | Serveur d'authentification à utiliser |
| `scope` | String | "openid profile" | Liste des scopes séparés par des espaces |
| `redirectUri` | String | `window.location.origin + "/examples/redirect.html"` | URI de redirection OAuth |
| `pkce` | Boolean | true | Activer la sécurité PKCE |
| `verifyAccessToken` | Boolean | false | Activer la vérification du token d'accès |

### Configuration backend

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `beUrl` | String | "" | URL du backend pour l'échange de code |
| `beBearer` | String | "" | Token Bearer pour l'API backend |

### Configuration de l'interface utilisateur

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `ui.showEnvSelector` | Boolean | true | Afficher le sélecteur d'environnement |
| `ui.container` | String | "#bj-pass-auth-container" | Sélecteur de l'élément DOM pour le widget |
| `ui.language` | String | "fr" | Langue de l'interface ("fr" ou "en") |
| `ui.primaryColor` | String | "#0066cc" | Couleur primaire pour les éléments UI |
| `ui.theme` | String | "default" | Thème UI ("default", "dark", "modern", "minimal") |

### Callbacks

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `onSuccess` | Function | null | Callback pour l'authentification réussie |
| `onError` | Function | null | Callback pour les erreurs d'authentification |

### Options avancées

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `debug` | Boolean | false | Activer le mode debug |
| `analytics` | Boolean | false | Activer le plugin analytics |
| `maxRetries` | Number | 0 | Nombre maximum de tentatives pour l'échange de tokens |
| `retryDelay` | Number | 1000 | Délai entre les tentatives en millisecondes |

## Exemples de configuration

### Configuration minimale

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});
```

### Configuration complète

```javascript
const widget = new BjPassAuthWidget({
    // Paramètres de base
    clientId: "your-client-id",
    environment: "production",
    authServer: "main-as",
    scope: "openid profile email",
    redirectUri: "https://yourapp.com/auth/callback",
    pkce: true,
    verifyAccessToken: true,
    
    // Configuration backend
    beUrl: "https://your-api.com/auth/exchange",
    beBearer: "Bearer your-api-token",
    
    // Configuration UI
    ui: {
        showEnvSelector: false,
        container: "#auth-container",
        language: "fr",
        primaryColor: "#4f46e5",
        theme: "modern"
    },
    
    // Callbacks
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
        handleSuccessfulAuth(tokens);
    },
    onError: (error) => {
        console.error("Erreur d'authentification :", error);
        handleAuthError(error);
    },
    
    // Options avancées
    debug: false,
    analytics: true,
    maxRetries: 3,
    retryDelay: 2000
});
```

### Configuration pour le développement

```javascript
const widget = new BjPassAuthWidget({
    clientId: "dev-client-id",
    environment: "test",
    debug: true,
    analytics: true,
    ui: {
        showEnvSelector: true,
        theme: "dark"
    },
    onSuccess: (tokens) => {
        console.log("Dev - Authentification réussie !", tokens);
    },
    onError: (error) => {
        console.error("Dev - Erreur :", error);
    }
});
```

### Configuration pour la production

```javascript
const widget = new BjPassAuthWidget({
    clientId: "prod-client-id",
    environment: "production",
    beUrl: "https://api.yourapp.com/auth/exchange",
    beBearer: process.env.API_TOKEN,
    ui: {
        showEnvSelector: false,
        theme: "minimal"
    },
    onSuccess: (tokens) => {
        // Gestion sécurisée des tokens
        secureTokenStorage(tokens);
    },
    onError: (error) => {
        // Gestion d'erreur en production
        logError(error);
        showUserFriendlyError(error);
    }
});
```

## Thèmes disponibles

### Default
```javascript
ui: {
    theme: "default"
}
```

### Dark
```javascript
ui: {
    theme: "dark"
}
```

### Modern
```javascript
ui: {
    theme: "modern"
}
```

### Minimal
```javascript
ui: {
    theme: "minimal"
}
```

## Configuration des environnements

### Environnement de test
```javascript
{
    environment: "test",
    // Utilise les serveurs de test bj-pass
}
```

### Environnement de production
```javascript
{
    environment: "production",
    // Utilise les serveurs de production bj-pass
}
```

## Validation de la configuration

Le widget valide automatiquement la configuration et lance des erreurs pour les paramètres invalides :

```javascript
try {
    const widget = new BjPassAuthWidget({
        clientId: "invalid-client-id",
        environment: "invalid-env"
    });
} catch (error) {
    console.error("Erreur de configuration :", error.message);
}
```

## Mise à jour de la configuration

Vous pouvez mettre à jour la configuration en cours d'exécution :

```javascript
// Mettre à jour la langue
widget.updateConfig({
    ui: {
        language: "en"
    }
});

// Mettre à jour le thème
widget.updateConfig({
    ui: {
        theme: "dark"
    }
});

// Mettre à jour plusieurs paramètres
widget.updateConfig({
    environment: "production",
    ui: {
        primaryColor: "#ff6b6b",
        theme: "modern"
    }
});
```

## Récupération de la configuration

Pour récupérer la configuration actuelle :

```javascript
const currentConfig = widget.getConfig();
console.log("Configuration actuelle :", currentConfig);
```

## Prochaines étapes

- [Référence API](../api-reference/core-api.md) pour les méthodes disponibles
- [Gestion des erreurs](../advanced/error-handling.md) pour une gestion robuste
- [Exemples avancés](../advanced/examples.md) pour des cas d'usage complexes