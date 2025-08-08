# API Core

Référence complète de l'API principale du widget d'authentification bj-pass.

## BjPassAuthWidget

La classe principale pour créer et gérer le widget d'authentification.

### Constructeur

```javascript
new BjPassAuthWidget(config)
```

Crée une nouvelle instance de BjPassAuthWidget.

#### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `config` | Object | Objet de configuration (voir [Configuration](../getting-started/configuration.md)) |

#### Exemple

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});
```

### Méthodes

#### startAuthFlow()

Démarre le flux d'authentification en ouvrant la popup d'autorisation.

```javascript
widget.startAuthFlow();
```

**Retourne :** `Promise<void>`

#### destroy()

Nettoie le widget en supprimant tous les écouteurs d'événements et éléments DOM.

```javascript
widget.destroy();
```

**Retourne :** `void`

#### refresh()

Réinitialise l'interface utilisateur du widget tout en conservant la configuration.

```javascript
widget.refresh();
```

**Retourne :** `void`

#### getConfig()

Récupère l'objet de configuration actuel.

```javascript
const config = widget.getConfig();
console.log("Configuration actuelle :", config);
```

**Retourne :** `Object` - Configuration actuelle

#### updateConfig(newConfig)

Met à jour la configuration du widget.

```javascript
widget.updateConfig({
    ui: {
        language: "en",
        theme: "dark"
    }
});
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `newConfig` | Object | Objet de configuration partiel avec les mises à jour |

**Retourne :** `void`

## Événements

### onSuccess

Appelé lors d'une authentification réussie.

```javascript
onSuccess: (tokens) => {
    console.log("Tokens reçus :", tokens);
    // tokens.access_token - Token d'accès
    // tokens.refresh_token - Token de rafraîchissement
    // tokens.id_token - Token d'identité
    // tokens.user_info - Informations utilisateur (si disponibles)
}
```

### onError

Appelé lors d'une erreur d'authentification.

```javascript
onError: (error) => {
    console.error("Code d'erreur :", error.code);
    console.error("Message d'erreur :", error.message);
    console.error("Détails :", error.details);
}
```

## Exemples d'utilisation

### Exemple basique

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    environment: "test",
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
        localStorage.setItem('access_token', tokens.access_token);
    },
    onError: (error) => {
        console.error("Erreur d'authentification :", error);
        alert("Erreur d'authentification : " + error.message);
    }
});

// Démarrer l'authentification
document.getElementById('login-btn').addEventListener('click', () => {
    widget.startAuthFlow();
});
```

### Exemple avec gestion du cycle de vie

```javascript
let widget = null;

function initializeWidget() {
    widget = new BjPassAuthWidget({
        clientId: "your-client-id",
        ui: {
            container: "#auth-container"
        },
        onSuccess: handleAuthSuccess,
        onError: handleAuthError
    });
}

function handleAuthSuccess(tokens) {
    console.log("Authentification réussie !", tokens);
    updateUI(tokens);
}

function handleAuthError(error) {
    console.error("Erreur d'authentification :", error);
    showError(error.message);
}

function cleanupWidget() {
    if (widget) {
        widget.destroy();
        widget = null;
    }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', initializeWidget);

// Nettoyer à la fermeture
window.addEventListener('beforeunload', cleanupWidget);
```

### Exemple avec mise à jour dynamique

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    ui: {
        language: "fr",
        theme: "default"
    },
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});

// Changer la langue
document.getElementById('lang-fr').addEventListener('click', () => {
    widget.updateConfig({
        ui: { language: "fr" }
    });
    widget.refresh();
});

document.getElementById('lang-en').addEventListener('click', () => {
    widget.updateConfig({
        ui: { language: "en" }
    });
    widget.refresh();
});

// Changer le thème
document.getElementById('theme-dark').addEventListener('click', () => {
    widget.updateConfig({
        ui: { theme: "dark" }
    });
    widget.refresh();
});
```

## Gestion des erreurs

### Codes d'erreur courants

| Code | Description |
|------|-------------|
| `invalid_token` | Token invalide ou expiré |
| `insufficient_scope` | Permissions insuffisantes |
| `invalid_grant` | Code d'autorisation invalide ou expiré |
| `access_denied` | Authentification annulée |
| `popup_closed` | La fenêtre d'authentification a été fermée |
| `browser_error` | Navigateur non supporté |

### Exemple de gestion d'erreurs

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onError: (error) => {
        switch (error.code) {
            case 'popup_closed':
                console.log("L'utilisateur a fermé la fenêtre d'authentification");
                break;
            case 'access_denied':
                console.log("L'utilisateur a annulé l'authentification");
                break;
            case 'invalid_token':
                console.error("Token invalide, nouvelle authentification requise");
                break;
            default:
                console.error("Erreur inconnue :", error.message);
        }
    }
});
```

## Prochaines étapes

- [API Enhanced](../enhanced-api.md) pour les fonctionnalités avancées
- [API Factory](../factory-api.md) pour la création de widgets multiples
- [Système de hooks](../hooks.md) pour personnaliser le comportement