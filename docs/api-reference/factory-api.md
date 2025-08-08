# API Factory

Référence de l'API pour la factory de création de widgets d'authentification bj-pass avec support des thèmes.

## BjPassWidgetFactory

Factory pour créer des instances de widgets d'authentification avec différentes configurations et thèmes.

### Méthodes

#### create(config)

Crée une nouvelle instance de BjPassAuthWidget.

```javascript
const widget = BjPassWidgetFactory.create({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `config` | Object | Objet de configuration (voir [Configuration](../getting-started/configuration.md)) |

**Retourne :** `BjPassAuthWidget` - Nouvelle instance de widget

#### createMultiple(configs)

Crée plusieurs instances de BjPassAuthWidget.

```javascript
const widgets = BjPassWidgetFactory.createMultiple([
    {
        clientId: "client1",
        ui: {
            container: "#widget1",
            theme: "dark"
        }
    },
    {
        clientId: "client2",
        ui: {
            container: "#widget2",
            theme: "modern"
        }
    }
]);
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `configs` | Array | Tableau d'objets de configuration |

**Retourne :** `Array` - Tableau d'instances de widgets

#### createWithTheme(theme, config)

Crée une nouvelle instance de BjPassAuthWidget avec un thème spécifique.

```javascript
const widget = BjPassWidgetFactory.createWithTheme("dark", {
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `theme` | String | Nom du thème ("default", "dark", "modern", "minimal") |
| `config` | Object | Objet de configuration |

**Retourne :** `BjPassAuthWidget` - Nouvelle instance de widget avec thème

## Thèmes disponibles

### Default
Thème standard avec couleurs bleues.

```javascript
const widget = BjPassWidgetFactory.createWithTheme("default", {
    clientId: "your-client-id"
});
```

### Dark
Thème sombre pour les interfaces sombres.

```javascript
const widget = BjPassWidgetFactory.createWithTheme("dark", {
    clientId: "your-client-id"
});
```

### Modern
Design épuré et minimaliste pour les applications contemporaines.

```javascript
const widget = BjPassWidgetFactory.createWithTheme("modern", {
    clientId: "your-client-id"
});
```

### Minimal
Style ultra-minimal pour personnalisation avancée.

```javascript
const widget = BjPassWidgetFactory.createWithTheme("minimal", {
    clientId: "your-client-id"
});
```

## Exemples d'utilisation

### Création simple

```javascript
// Création basique
const widget = BjPassWidgetFactory.create({
    clientId: "your-client-id",
    environment: "test",
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});
```

### Création avec thème

```javascript
// Création avec thème sombre
const darkWidget = BjPassWidgetFactory.createWithTheme("dark", {
    clientId: "your-client-id",
    ui: {
        container: "#dark-auth-container",
        language: "en"
    },
    onSuccess: (tokens) => {
        console.log("Authentification sombre réussie !", tokens);
    }
});
```

### Création multiple

```javascript
// Créer plusieurs widgets avec différents thèmes
const widgets = BjPassWidgetFactory.createMultiple([
    {
        clientId: "client1",
        ui: {
            container: "#widget1",
            theme: "dark",
            language: "fr"
        },
        onSuccess: (tokens) => {
            console.log("Widget 1 - Authentification réussie !", tokens);
        }
    },
    {
        clientId: "client2",
        ui: {
            container: "#widget2",
            theme: "modern",
            language: "en"
        },
        onSuccess: (tokens) => {
            console.log("Widget 2 - Authentification réussie !", tokens);
        }
    },
    {
        clientId: "client3",
        ui: {
            container: "#widget3",
            theme: "minimal",
            language: "fr"
        },
        onSuccess: (tokens) => {
            console.log("Widget 3 - Authentification réussie !", tokens);
        }
    }
]);
```

### Gestion des widgets multiples

```javascript
// Créer et gérer plusieurs widgets
const widgetConfigs = [
    {
        clientId: "admin-client",
        ui: { container: "#admin-auth", theme: "dark" },
        onSuccess: handleAdminAuth
    },
    {
        clientId: "user-client",
        ui: { container: "#user-auth", theme: "modern" },
        onSuccess: handleUserAuth
    }
];

const widgets = BjPassWidgetFactory.createMultiple(widgetConfigs);

// Fonctions de gestion
function handleAdminAuth(tokens) {
    console.log("Authentification admin réussie !", tokens);
    // Logique spécifique aux administrateurs
}

function handleUserAuth(tokens) {
    console.log("Authentification utilisateur réussie !", tokens);
    // Logique spécifique aux utilisateurs
}

// Nettoyage de tous les widgets
function cleanupAllWidgets() {
    widgets.forEach(widget => {
        if (widget) {
            widget.destroy();
        }
    });
}
```

## Configuration avancée avec factory

### Factory avec configuration globale

```javascript
// Configuration de base pour tous les widgets
const baseConfig = {
    environment: "production",
    pkce: true,
    verifyAccessToken: true,
    onError: (error) => {
        console.error("Erreur d'authentification :", error);
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
    }
});
```

### Factory avec thèmes dynamiques

```javascript
// Fonction pour créer un widget avec thème basé sur les préférences utilisateur
function createWidgetWithUserTheme(clientId, containerId) {
    const userTheme = localStorage.getItem('user-theme') || 'default';
    const userLanguage = localStorage.getItem('user-language') || 'fr';
    
    return BjPassWidgetFactory.createWithTheme(userTheme, {
        clientId: clientId,
        ui: {
            container: containerId,
            language: userLanguage
        },
        onSuccess: (tokens) => {
            console.log(`Widget ${clientId} - Authentification réussie !`, tokens);
        }
    });
}

// Utilisation
const widget1 = createWidgetWithUserTheme("client1", "#auth1");
const widget2 = createWidgetWithUserTheme("client2", "#auth2");
```

### Factory avec validation

```javascript
// Factory avec validation de configuration
class ValidatedBjPassWidgetFactory {
    static create(config) {
        // Validation de la configuration
        if (!config.clientId) {
            throw new Error("clientId est requis");
        }
        
        if (!config.ui || !config.ui.container) {
            throw new Error("ui.container est requis");
        }
        
        // Création du widget
        return BjPassWidgetFactory.create(config);
    }
    
    static createMultiple(configs) {
        // Validation de toutes les configurations
        configs.forEach((config, index) => {
            if (!config.clientId) {
                throw new Error(`Configuration ${index}: clientId est requis`);
            }
        });
        
        // Création des widgets
        return BjPassWidgetFactory.createMultiple(configs);
    }
}

// Utilisation
try {
    const widget = ValidatedBjPassWidgetFactory.create({
        clientId: "valid-client",
        ui: { container: "#valid-container" }
    });
} catch (error) {
    console.error("Erreur de validation :", error.message);
}
```

## Prochaines étapes

- [API Core](../core-api.md) pour les méthodes de base
- [API Enhanced](../enhanced-api.md) pour les fonctionnalités avancées
- [Système de hooks](../hooks.md) pour personnaliser le comportement
