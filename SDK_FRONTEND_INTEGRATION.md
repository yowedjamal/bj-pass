# Intégration SDK Frontend avec SDK Backend

Ce document détaille les modifications nécessaires dans le SDK frontend existant (`bj-pass-auth-widget.js`) pour une intégration parfaite avec le nouveau SDK backend Laravel.

## 🔄 Architecture de l'intégration

### Avant (SDK Frontend seul)

```
Frontend → Provider OIDC → Frontend (callback)
```

### Après (SDK Frontend + Backend)

```
Frontend → Backend (/auth/start) → Provider OIDC → Backend (/auth/callback) → Frontend (postMessage)
```

## 📝 Modifications requises dans le SDK Frontend

### 1. Configuration du backend

Ajoutez ces nouvelles options de configuration :

```javascript
const config = {
  // Configuration existante...
  clientId: "your_client_id",
  scope: "openid profile",

  // NOUVELLES OPTIONS BACKEND
  backendUrl: "https://your-backend.com", // URL de votre backend Laravel
  backendEndpoints: {
    start: "/auth/start", // Endpoint de démarrage
    status: "/auth/api/status", // Vérification du statut
    user: "/auth/api/user", // Informations utilisateur
    logout: "/auth/api/logout", // Déconnexion
    refresh: "/auth/api/refresh", // Rafraîchissement token
  },

  // Configuration de sécurité
  frontendOrigin: "https://your-frontend.com", // Origine autorisée
  backendOrigin: "https://your-backend.com", // Origine du backend

  // Options de communication
  useBackend: true, // Activer l'utilisation du backend
  popupMode: true, // Mode popup recommandé
  autoClosePopup: true, // Fermeture automatique après succès
};
```

### 2. Modification de la méthode `startAuthFlow`

Remplacez la logique existante par :

```javascript
async startAuthFlow() {
    try {
        this.uiManager.setState({ isLoading: true, error: null });

        if (this.config.useBackend) {
            // Utiliser le backend pour l'authentification
            await this.startBackendAuthFlow();
        } else {
            // Fallback vers l'ancienne méthode
            await this.startDirectAuthFlow();
        }

    } catch (error) {
        this.handleError("auth_flow_error", error.message);
    }
}

async startBackendAuthFlow() {
    const config = this.configManager.get();

    if (!config.backendUrl) {
        throw new Error("Backend URL not configured");
    }

    // Construire l'URL de démarrage du backend
    const startUrl = new URL(config.backendEndpoints.start, config.backendUrl);

    // Ajouter des paramètres optionnels
    if (config.returnUrl) {
        startUrl.searchParams.set('return_url', config.returnUrl);
    }

    // Ouvrir la popup vers le backend
    this.popupManager.open(startUrl.toString(), () => {
        this.uiManager.setState({ isLoading: false });
        if (!SessionManager.getItem("success")) {
            this.handleError("popup_closed", "La fenêtre d'authentification a été fermée");
        }
    });
}

async startDirectAuthFlow() {
    // Ancienne logique existante...
    const config = this.configManager.get();
    const authData = SessionManager.generateAndStoreAuthData(config.scope);
    const authUrl = await this.urlBuilder.buildAuthorizationUrl(authData);

    this.popupManager.open(authUrl, () => {
        this.uiManager.setState({ isLoading: false });
        if (!SessionManager.getItem("success")) {
            this.handleError("popup_closed", "La fenêtre d'authentification a été fermée");
        }
    });
}
```

### 3. Modification du gestionnaire de messages

Remplacez le gestionnaire existant par :

```javascript
setupMessageListener() {
    window.addEventListener("message", (event) => {
        // Vérifier l'origine du message
        if (!this.isValidMessageOrigin(event.origin)) {
            console.warn("Message from unauthorized origin:", event.origin);
            return;
        }

        // Vérifier le type de message
        if (event.data && event.data.type === "bjpass-auth-response") {
            this.handleBackendAuthResponse(event.data);
        }
    });
}

isValidMessageOrigin(origin) {
    const config = this.configManager.get();
    const allowedOrigins = [config.backendOrigin, config.frontendOrigin];

    // Permettre l'origine exacte ou wildcard
    return allowedOrigins.some(allowed =>
        allowed === "*" || allowed === origin
    );
}

async handleBackendAuthResponse(data) {
    try {
        if (data.status === "success") {
            // Authentification réussie
            await this.handleBackendAuthSuccess(data);
        } else {
            // Erreur d'authentification
            this.handleBackendAuthError(data);
        }
    } catch (error) {
        this.handleError("callback_error", error.message);
    }
}

async handleBackendAuthSuccess(data) {
    try {
        // Stocker les informations utilisateur
        SessionManager.setItem("user", JSON.stringify(data.user));
        SessionManager.setItem("success", "true");

        // Fermer la popup
        this.popupManager.close();

        // Mettre à jour l'UI
        this.uiManager.setState({ isLoading: false, error: null });

        // Appeler le callback de succès
        const config = this.configManager.get();
        if (config.onSuccess) {
            config.onSuccess({
                user: data.user,
                backendData: data,
                source: 'backend'
            });
        }

        // Vérifier le statut via l'API backend
        await this.verifyBackendStatus();

    } catch (error) {
        this.handleError("success_verification_error", error.message);
    }
}

handleBackendAuthError(data) {
    // Fermer la popup
    this.popupManager.close();

    // Afficher l'erreur
    this.handleError(data.error || "backend_error", data.message || "Erreur d'authentification");

    // Appeler le callback d'erreur
    const config = this.configManager.get();
    if (config.onError) {
        config.onError({
            error: data.error,
            error_description: data.message,
            source: 'backend'
        });
    }
}
```

### 4. Nouvelle méthode de vérification du statut

Ajoutez cette méthode pour vérifier le statut via le backend :

```javascript
async verifyBackendStatus() {
    try {
        const config = this.configManager.get();
        const statusUrl = new URL(config.backendEndpoints.status, config.backendUrl);

        const response = await fetch(statusUrl.toString(), {
            method: 'GET',
            credentials: 'include', // Inclure les cookies de session
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Status check failed: ${response.status}`);
        }

        const statusData = await response.json();

        if (statusData.authenticated) {
            // Mettre à jour les informations utilisateur
            SessionManager.setItem("user", JSON.stringify(statusData.user));
            SessionManager.setItem("authenticated", "true");

            console.log("Backend status verified:", statusData);
        } else {
            // L'utilisateur n'est pas authentifié côté backend
            SessionManager.clear();
            throw new Error("User not authenticated on backend");
        }

    } catch (error) {
        console.error("Backend status verification failed:", error);
        throw error;
    }
}
```

### 5. Modification de la méthode `getUserInfo`

Ajoutez la possibilité de récupérer les informations via le backend :

```javascript
async getUserInfo() {
    const config = this.configManager.get();

    if (config.useBackend) {
        try {
            // Essayer de récupérer depuis le backend
            return await this.getUserInfoFromBackend();
        } catch (error) {
            console.warn("Failed to get user info from backend, falling back to session:", error);
        }
    }

    // Fallback vers la session locale
    const userData = SessionManager.getItem("user");
    return userData ? JSON.parse(userData) : null;
}

async getUserInfoFromBackend() {
    const config = this.configManager.get();
    const userUrl = new URL(config.backendEndpoints.user, config.backendUrl);

    const response = await fetch(userUrl.toString(), {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`User info request failed: ${response.status}`);
    }

    const userData = await response.json();
    return userData.user;
}
```

### 6. Modification de la méthode `logout`

Ajoutez la déconnexion via le backend :

```javascript
async logout() {
    const config = this.configManager.get();

    if (config.useBackend) {
        try {
            await this.logoutFromBackend();
        } catch (error) {
            console.warn("Backend logout failed:", error);
        }
    }

    // Nettoyer la session locale
    SessionManager.clear();

    // Mettre à jour l'UI
    this.uiManager.setState({ isLoading: false, error: null });

    // Appeler le callback de déconnexion
    if (config.onLogout) {
        config.onLogout();
    }
}

async logoutFromBackend() {
    const config = this.configManager.get();
    const logoutUrl = new URL(config.backendEndpoints.logout, config.backendUrl);

    const response = await fetch(logoutUrl.toString(), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Backend logout failed: ${response.status}`);
    }

    console.log("Backend logout successful");
}
```

### 7. Nouvelle méthode de rafraîchissement des tokens

Ajoutez la gestion du rafraîchissement via le backend :

```javascript
async refreshToken() {
    const config = this.configManager.get();

    if (!config.useBackend) {
        throw new Error("Token refresh not supported in direct mode");
    }

    try {
        const refreshUrl = new URL(config.backendEndpoints.refresh, config.backendUrl);

        const response = await fetch(refreshUrl.toString(), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Token refresh failed: ${response.status}`);
        }

        const refreshData = await response.json();
        console.log("Token refreshed successfully");

        return refreshData.token_info;

    } catch (error) {
        console.error("Token refresh failed:", error);
        throw error;
    }
}
```

## 🔧 Configuration recommandée

### Configuration minimale

```javascript
const bjpassWidget = new BjPassAuthWidget({
  clientId: "your_client_id",
  scope: "openid profile email",

  // Configuration backend
  backendUrl: "https://your-backend.com",
  useBackend: true,

  // Callbacks
  onSuccess: (data) => {
    console.log("Authentifié:", data.user);
    // Rediriger ou mettre à jour l'UI
  },
  onError: (error) => {
    console.error("Erreur:", error);
    // Afficher l'erreur à l'utilisateur
  },
  onLogout: () => {
    console.log("Déconnecté");
    // Rediriger vers la page de connexion
  },
});
```

### Configuration avancée

```javascript
const bjpassWidget = new BjPassAuthWidget({
  clientId: "your_client_id",
  scope: "openid profile email",

  // Configuration backend complète
  backendUrl: "https://your-backend.com",
  backendEndpoints: {
    start: "/auth/start",
    status: "/auth/api/status",
    user: "/auth/api/user",
    logout: "/auth/api/logout",
    refresh: "/auth/api/refresh",
  },
  useBackend: true,
  popupMode: true,
  autoClosePopup: true,

  // Configuration de sécurité
  frontendOrigin: "https://your-frontend.com",
  backendOrigin: "https://your-backend.com",

  // Callbacks étendus
  onSuccess: (data) => {
    console.log("Authentifié via backend:", data);
    // Traitement personnalisé
  },
  onError: (error) => {
    console.error("Erreur backend:", error);
    // Gestion d'erreur personnalisée
  },
  onLogout: () => {
    console.log("Déconnecté du backend");
    // Nettoyage personnalisé
  },
  onTokenRefresh: (tokenInfo) => {
    console.log("Token rafraîchi:", tokenInfo);
    // Mise à jour des headers API
  },
});
```

## 🚀 Exemple de flux complet

### 1. Initialisation

```javascript
// Créer le widget
const widget = new BjPassAuthWidget(config);

// Attendre que la page soit chargée
document.addEventListener("DOMContentLoaded", () => {
  // Le widget est prêt
  console.log("BjPass widget ready");
});
```

### 2. Démarrage de l'authentification

```javascript
// L'utilisateur clique sur le bouton de connexion
document.getElementById("login-btn").addEventListener("click", () => {
  widget.startAuthFlow();
});
```

### 3. Gestion du callback

```javascript
// Le callback est géré automatiquement par le widget
// L'utilisateur est redirigé vers le backend, puis vers le provider OIDC
// Après authentification, le provider redirige vers le backend
// Le backend communique avec le frontend via postMessage
```

### 4. Vérification du statut

```javascript
// Vérifier si l'utilisateur est connecté
if (widget.isAuthenticated()) {
  const user = widget.getUserInfo();
  console.log("Utilisateur connecté:", user);

  // Afficher le contenu protégé
  showProtectedContent(user);
} else {
  // Afficher le formulaire de connexion
  showLoginForm();
}
```

### 5. Déconnexion

```javascript
// L'utilisateur clique sur le bouton de déconnexion
document.getElementById("logout-btn").addEventListener("click", () => {
  widget.logout();

  // Rediriger vers la page d'accueil
  window.location.href = "/";
});
```

## 🔒 Sécurité

### Vérification des origines

Le SDK vérifie automatiquement l'origine des messages reçus :

```javascript
// Seuls les messages du backend configuré sont acceptés
if (!this.isValidMessageOrigin(event.origin)) {
  console.warn("Message from unauthorized origin:", event.origin);
  return;
}
```

### Gestion des sessions

- Les tokens sont stockés côté backend (plus sécurisé)
- Le frontend ne stocke que les informations utilisateur de base
- La session est gérée via les cookies HTTPOnly du backend

### Protection CSRF

- Le paramètre `state` est généré et validé côté backend
- Les requêtes vers le backend incluent automatiquement les cookies de session

## 🧪 Tests et débogage

### Mode debug

```javascript
const config = {
  // ... autres options
  debug: true,
  backendUrl: "https://your-backend.com",
  useBackend: true,
};
```

### Logs de débogage

Le SDK affiche des logs détaillés en mode debug :

```
[BjPass] Starting backend authentication flow
[BjPass] Opening popup to: https://your-backend.com/auth/start
[BjPass] Message received from backend: {type: "bjpass-auth-response", status: "success"}
[BjPass] Backend authentication successful
[BjPass] Verifying backend status
[BjPass] Status verified, user authenticated
```

### Gestion des erreurs

```javascript
widget.onError = (error) => {
  console.error("Erreur BjPass:", error);

  switch (error.error) {
    case "popup_closed":
      showMessage("Fenêtre d'authentification fermée");
      break;
    case "backend_error":
      showMessage("Erreur du serveur d'authentification");
      break;
    default:
      showMessage("Erreur d'authentification inconnue");
  }
};
```

## 📱 Compatibilité

### Navigateurs supportés

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Fonctionnalités requises

- `window.crypto.subtle` (pour PKCE)
- `window.postMessage` (pour la communication)
- `fetch` API (pour les requêtes HTTP)
- `Promise` support (pour async/await)

## 🔄 Migration depuis l'ancienne version

### Étapes de migration

1. **Mettre à jour la configuration** : Ajouter `backendUrl` et `useBackend: true`
2. **Modifier les callbacks** : Adapter les callbacks pour le nouveau format de données
3. **Tester l'intégration** : Vérifier que l'authentification fonctionne via le backend
4. **Supprimer l'ancien code** : Une fois validé, supprimer les méthodes obsolètes

### Code de compatibilité

```javascript
// Maintenir la compatibilité avec l'ancienne API
if (config.useBackend) {
  // Nouvelle logique backend
  await this.startBackendAuthFlow();
} else {
  // Ancienne logique directe
  await this.startDirectAuthFlow();
}
```

## 📚 Ressources additionnelles

- [Documentation du SDK Backend](../README.md)
- [Guide de configuration Laravel](../docs/laravel-setup.md)
- [Exemples d'intégration](../examples/)
- [FAQ et dépannage](../docs/faq.md)

---

**Note** : Cette intégration nécessite que le SDK backend soit correctement configuré et déployé sur votre serveur Laravel.
