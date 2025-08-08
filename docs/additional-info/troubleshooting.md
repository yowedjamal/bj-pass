# Dépannage

Guide de dépannage pour résoudre les problèmes courants avec le widget d'authentification bj-pass.

## Problèmes courants

### Widget ne s'affiche pas

**Symptômes :** Le widget n'apparaît pas dans le conteneur spécifié.

**Solutions :**

1. **Vérifier que l'élément conteneur existe :**
```javascript
// Vérifier que l'élément existe
const container = document.getElementById('auth-container');
if (!container) {
    console.error('Conteneur #auth-container non trouvé');
    return;
}

const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    ui: {
        container: "#auth-container"
    }
});
```

2. **Vérifier que le script est chargé :**
```javascript
if (typeof BjPassAuthWidget === 'undefined') {
    console.error('Script bj-pass non chargé');
    // Vérifier l'ordre de chargement des scripts
}
```

3. **Vérifier la configuration :**
```javascript
try {
    const widget = new BjPassAuthWidget({
        clientId: "your-client-id"
    });
} catch (error) {
    console.error('Erreur de configuration :', error.message);
}
```

### Popup bloquée

**Symptômes :** La fenêtre d'authentification ne s'ouvre pas ou est bloquée.

**Solutions :**

1. **Autoriser les popups pour votre domaine :**
```javascript
// Vérifier si les popups sont autorisées
function checkPopupSupport() {
    const popup = window.open('', '_blank', 'width=1,height=1');
    if (popup) {
        popup.close();
        return true;
    }
    return false;
}

if (!checkPopupSupport()) {
    alert('Veuillez autoriser les popups pour ce site');
}
```

2. **Utiliser une approche alternative :**
```javascript
// Redirection directe au lieu de popup
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    useRedirect: true, // Utiliser la redirection
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    }
});
```

### Erreur "Invalid redirect URI"

**Symptômes :** Erreur lors de l'échange de tokens.

**Solutions :**

1. **Vérifier l'URI de redirection :**
```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    redirectUri: "https://yourdomain.com/auth/callback", // Doit correspondre à l'URI enregistrée
    onError: (error) => {
        if (error.code === 'invalid_redirect_uri') {
            console.error('URI de redirection invalide');
        }
    }
});
```

2. **Vérifier la configuration côté serveur :**
```javascript
// L'URI de redirection doit être enregistrée dans votre application OAuth
// sur le serveur bj-pass
```

### Erreurs de token

**Symptômes :** Erreurs de validation ou d'expiration des tokens.

**Solutions :**

1. **Vérifier l'expiration des tokens :**
```javascript
function checkTokenExpiration(token) {
    try {
        const decoded = decodeJWT(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (decoded.exp && decoded.exp < currentTime) {
            console.error('Token expiré');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Erreur de décodage du token:', error);
        return false;
    }
}

const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        if (tokens.access_token && !checkTokenExpiration(tokens.access_token)) {
            console.error('Token d\'accès expiré');
            // Gérer l'expiration
        }
    }
});
```

2. **Implémenter le refresh automatique :**
```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    maxRetries: 3,
    retryDelay: 1000,
    onError: (error) => {
        if (error.code === 'invalid_token') {
            // Token expiré, redémarrer l'authentification
            setTimeout(() => {
                widget.startAuthFlow();
            }, 1000);
        }
    }
});
```

### Erreurs CORS

**Symptômes :** Erreurs de CORS lors des requêtes.

**Solutions :**

1. **Vérifier la configuration CORS côté serveur :**
```javascript
// Le serveur backend doit autoriser les requêtes depuis votre domaine
// Headers CORS requis :
// Access-Control-Allow-Origin: https://yourdomain.com
// Access-Control-Allow-Methods: POST, GET, OPTIONS
// Access-Control-Allow-Headers: Content-Type, Authorization
```

2. **Utiliser un proxy si nécessaire :**
```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    beUrl: "/api/auth/exchange", // Utiliser un proxy local
    onError: (error) => {
        if (error.message.includes('CORS')) {
            console.error('Erreur CORS détectée');
        }
    }
});
```

## Débogage

### Mode debug

```javascript
const widget = new EnhancedBjPassAuthWidget({
    clientId: "your-client-id",
    debug: true, // Activer le mode debug
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    },
    onError: (error) => {
        console.error("Erreur d'authentification :", error);
    }
});
```

### Logs détaillés

```javascript
// Fonction de logging personnalisée
function debugLog(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data);
}

const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        debugLog('Authentification réussie', tokens);
    },
    onError: (error) => {
        debugLog('Erreur d\'authentification', {
            code: error.code,
            message: error.message,
            details: error.details
        });
    }
});
```

### Inspection de la configuration

```javascript
// Vérifier la configuration actuelle
const widget = new BjPassAuthWidget({
    clientId: "your-client-id"
});

console.log('Configuration actuelle:', widget.getConfig());

// Vérifier l'état du widget
console.log('État du widget:', {
    isInitialized: !!widget,
    config: widget.getConfig()
});
```

## Problèmes d'environnement

### Problèmes de test vs production

```javascript
// Configuration différente selon l'environnement
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

const config = {
    clientId: isDevelopment ? "dev-client-id" : "prod-client-id",
    environment: isDevelopment ? "test" : "production",
    debug: isDevelopment,
    ui: {
        showEnvSelector: isDevelopment,
        theme: isDevelopment ? "dark" : "modern"
    }
};

const widget = new BjPassAuthWidget(config);
```

### Problèmes de version

```javascript
// Vérifier la version du widget
if (typeof BjPassAuthWidget !== 'undefined') {
    console.log('Version bj-pass:', BjPassAuthWidget.version);
    
    // Vérifier la compatibilité
    const version = BjPassAuthWidget.version;
    const majorVersion = parseInt(version.split('.')[0]);
    
    if (majorVersion < 2) {
        console.warn('Version obsolète détectée. Considérez la mise à jour.');
    }
}
```

## Problèmes de performance

### Widget lent à charger

**Solutions :**

1. **Vérifier la taille du script :**
```javascript
// Charger le script de manière asynchrone
const script = document.createElement('script');
script.src = 'https://cdn.yourdomain.com/bj-pass-widget.js';
script.async = true;
script.onload = () => {
    console.log('Script bj-pass chargé');
    initializeWidget();
};
document.head.appendChild(script);
```

2. **Optimiser l'initialisation :**
```javascript
// Initialiser le widget seulement quand nécessaire
function initializeWidgetWhenNeeded() {
    if (document.getElementById('auth-container')) {
        const widget = new BjPassAuthWidget({
            clientId: "your-client-id"
        });
    }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', initializeWidgetWhenNeeded);
```

### Problèmes de mémoire

```javascript
// Nettoyer le widget quand il n'est plus nécessaire
let widget = null;

function initializeWidget() {
    widget = new BjPassAuthWidget({
        clientId: "your-client-id"
    });
}

function cleanupWidget() {
    if (widget) {
        widget.destroy();
        widget = null;
    }
}

// Nettoyer à la fermeture de la page
window.addEventListener('beforeunload', cleanupWidget);
```

## Problèmes spécifiques aux frameworks

### Problèmes React

```javascript
import React, { useEffect, useRef } from 'react';

function AuthComponent() {
    const widgetRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Initialiser le widget
        widgetRef.current = new BjPassAuthWidget({
            clientId: "your-client-id",
            ui: {
                container: containerRef.current
            }
        });

        // Nettoyer à la destruction du composant
        return () => {
            if (widgetRef.current) {
                widgetRef.current.destroy();
            }
        };
    }, []);

    return <div ref={containerRef} />;
}
```

### Problèmes Vue.js

```javascript
export default {
    data() {
        return {
            widget: null
        };
    },
    
    mounted() {
        this.widget = new BjPassAuthWidget({
            clientId: "your-client-id",
            ui: {
                container: this.$refs.authContainer
            }
        });
    },
    
    beforeDestroy() {
        if (this.widget) {
            this.widget.destroy();
        }
    }
};
```

## Outils de diagnostic

### Diagnostic complet

```javascript
class BjPassDiagnostic {
    static runDiagnostic() {
        const results = {
            browser: this.checkBrowser(),
            script: this.checkScript(),
            container: this.checkContainer(),
            configuration: this.checkConfiguration(),
            network: this.checkNetwork()
        };
        
        console.log('Diagnostic bj-pass:', results);
        return results;
    }
    
    static checkBrowser() {
        return {
            userAgent: navigator.userAgent,
            supportsES6: this.supportsES6(),
            supportsCrypto: 'crypto' in window && 'subtle' in window.crypto,
            supportsStorage: 'localStorage' in window
        };
    }
    
    static checkScript() {
        return {
            loaded: typeof BjPassAuthWidget !== 'undefined',
            version: typeof BjPassAuthWidget !== 'undefined' ? BjPassAuthWidget.version : null
        };
    }
    
    static checkContainer() {
        const container = document.getElementById('auth-container');
        return {
            exists: !!container,
            visible: container ? container.offsetParent !== null : false,
            dimensions: container ? {
                width: container.offsetWidth,
                height: container.offsetHeight
            } : null
        };
    }
    
    static checkConfiguration() {
        try {
            const widget = new BjPassAuthWidget({
                clientId: "test-client-id"
            });
            return {
                valid: true,
                config: widget.getConfig()
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }
    
    static checkNetwork() {
        return {
            online: navigator.onLine,
            protocol: window.location.protocol
        };
    }
    
    static supportsES6() {
        try {
            new Function('() => {}');
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Exécuter le diagnostic
const diagnostic = BjPassDiagnostic.runDiagnostic();
```

## Support

### Informations à fournir

Lorsque vous contactez le support, fournissez :

1. **Informations de base :**
   - Version du widget
   - Navigateur et version
   - Système d'exploitation

2. **Détails de l'erreur :**
   - Message d'erreur complet
   - Code d'erreur
   - Étapes pour reproduire

3. **Configuration :**
   - Configuration du widget (sans les secrets)
   - Environnement (test/production)

4. **Logs :**
   - Console du navigateur
   - Logs du serveur (si applicable)

### Contact

- **Email :** [yowedjamal@gmail.com](mailto:yowedjamal@gmail.com)
- **GitHub Issues :** [https://github.com/yowedjamal/bj-pass/issues](https://github.com/yowedjamal/bj-pass/issues)

## Prochaines étapes

- [Gestion des erreurs](../advanced/error-handling.md) pour une gestion robuste
- [Compatibilité](compatibility.md) pour vérifier la compatibilité
- [Sécurité](security.md) pour les problèmes de sécurité