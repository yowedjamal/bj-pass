# Utilisation de base

Ce guide vous explique comment utiliser le widget d'authentification bj-pass dans vos applications.

## Initialisation simple

Voici un exemple d'initialisation basique :

```javascript
// Initialisation basique
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    environment: "test", // ou "production"
    ui: {
        container: "#auth-container",
        primaryColor: "#0066cc",
        language: "fr" // ou "en"
    },
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
        // Gérer l'authentification réussie
    },
    onError: (error) => {
        console.error("Échec de l'authentification :", error);
        // Gérer les erreurs d'authentification
    }
});
```

## Utilisation du widget amélioré

Pour des fonctionnalités avancées, utilisez le widget amélioré avec plugins :

```javascript
// Widget amélioré avec plugins
const enhancedWidget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    debug: true,
    analytics: true,
    maxRetries: 3,
    onSuccess: (tokens) => {
        // Gérer les tokens
        console.log("Tokens reçus :", tokens);
    }
});
```

## Démarrage de l'authentification

Pour lancer le processus d'authentification :

```javascript
// Démarrer le flux d'authentification
widget.startAuthFlow();
```

## Gestion des tokens

### Exemple complet avec gestion des tokens

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        // Stocker les tokens
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        
        // Mettre à jour l'interface utilisateur
        updateUserInterface(tokens);
        
        // Rediriger vers la page principale
        window.location.href = '/dashboard';
    },
    onError: (error) => {
        // Afficher l'erreur à l'utilisateur
        showErrorMessage(error.message);
        
        // Logger l'erreur pour le débogage
        console.error('Erreur d\'authentification :', error);
    }
});

// Fonction pour mettre à jour l'interface
function updateUserInterface(tokens) {
    const userInfo = tokens.user_info || {};
    document.getElementById('user-name').textContent = userInfo.name || 'Utilisateur';
    document.getElementById('user-email').textContent = userInfo.email || '';
}

// Fonction pour afficher les erreurs
function showErrorMessage(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}
```

## Intégration avec un backend

Pour les applications nécessitant une validation côté serveur :

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    beUrl: "https://your-api.com/auth/exchange",
    beBearer: "Bearer your-api-token",
    onSuccess: (response) => {
        // Réponse du backend
        console.log("Réponse du backend :", response);
        
        // Le backend peut retourner des données supplémentaires
        if (response.user) {
            updateUserProfile(response.user);
        }
    }
});
```

## Échange direct de tokens

Pour un échange direct sans backend :

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    verifyAccessToken: true,
    onSuccess: (tokens) => {
        // Tokens directement depuis bj-pass
        console.log("Tokens directs :", tokens);
        
        // Validation locale du token
        if (tokens.access_token) {
            validateTokenLocally(tokens.access_token);
        }
    }
});
```

## Gestion du cycle de vie

### Nettoyage et destruction

```javascript
// Nettoyer le widget quand il n'est plus nécessaire
function cleanupWidget() {
    if (widget) {
        widget.destroy();
        widget = null;
    }
}

// Rafraîchir le widget
function refreshWidget() {
    if (widget) {
        widget.refresh();
    }
}
```

### Mise à jour de la configuration

```javascript
// Mettre à jour la configuration en cours d'exécution
widget.updateConfig({
    ui: {
        language: "en",
        primaryColor: "#ff6b6b"
    }
});
```

## Exemples d'intégration

### Intégration dans une application React

```javascript
import React, { useEffect, useRef } from 'react';
import { BjPassAuthWidget } from '@bj-pass/auth-widget';

function AuthComponent() {
    const widgetRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        widgetRef.current = new BjPassAuthWidget({
            clientId: "your-client-id",
            ui: {
                container: containerRef.current
            },
            onSuccess: (tokens) => {
                console.log("Authentification réussie !", tokens);
            }
        });

        return () => {
            if (widgetRef.current) {
                widgetRef.current.destroy();
            }
        };
    }, []);

    return <div ref={containerRef} />;
}
```

### Intégration dans une application Vue.js

```javascript
import { BjPassAuthWidget } from '@bj-pass/auth-widget';

export default {
    mounted() {
        this.widget = new BjPassAuthWidget({
            clientId: "your-client-id",
            ui: {
                container: this.$refs.authContainer
            },
            onSuccess: (tokens) => {
                this.$emit('auth-success', tokens);
            }
        });
    },
    
    beforeDestroy() {
        if (this.widget) {
            this.widget.destroy();
        }
    }
}
```

## Prochaines étapes

- [Configuration avancée](configuration.md) pour personnaliser le comportement
- [Gestion des erreurs](../advanced/error-handling.md) pour une gestion robuste des erreurs
- [Exemples avancés](../advanced/examples.md) pour des cas d'usage complexes 