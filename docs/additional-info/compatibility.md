# Compatibilité

Guide de compatibilité du widget d'authentification bj-pass avec les navigateurs et environnements.

## Compatibilité des navigateurs

### Navigateurs supportés

Le widget bj-pass nécessite un navigateur moderne avec support pour :

- **ES6+** (classes, promesses, etc.)
- **Web Crypto API** (pour PKCE)
- **Session Storage**
- **Fetch API**

### Versions minimales

| Navigateur | Version minimale | Notes |
|------------|------------------|-------|
| **Chrome** | 61+ | Support complet |
| **Firefox** | 60+ | Support complet |
| **Safari** | 11+ | Support complet |
| **Edge** | 16+ | Support complet |
| **IE** | Non supporté | APIs requises non disponibles |

### Vérification de compatibilité

Le widget inclut une vérification automatique de compatibilité :

```javascript
try {
    const widget = new BjPassAuthWidget({
        clientId: "your-client-id"
    });
} catch (error) {
    if (error.code === 'browser_error') {
        console.error('Navigateur non supporté:', error.message);
        showBrowserCompatibilityMessage();
    }
}
```

### Fonction de détection de compatibilité

```javascript
function checkBrowserCompatibility() {
    const requirements = {
        es6: () => {
            try {
                new Function('() => {}');
                return true;
            } catch (e) {
                return false;
            }
        },
        webCrypto: () => {
            return 'crypto' in window && 'subtle' in window.crypto;
        },
        sessionStorage: () => {
            try {
                sessionStorage.setItem('test', 'test');
                sessionStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        },
        fetch: () => {
            return 'fetch' in window;
        }
    };
    
    const results = {};
    let allSupported = true;
    
    for (const [feature, check] of Object.entries(requirements)) {
        results[feature] = check();
        if (!results[feature]) {
            allSupported = false;
        }
    }
    
    return {
        supported: allSupported,
        results: results
    };
}

// Utilisation
const compatibility = checkBrowserCompatibility();
if (!compatibility.supported) {
    console.error('Fonctionnalités non supportées:', compatibility.results);
    showCompatibilityWarning(compatibility.results);
}
```

## Support des environnements

### Environnements de développement

| Environnement | Support | Notes |
|---------------|---------|-------|
| **Node.js** | ✅ | Pour les tests et le développement |
| **Webpack** | ✅ | Support complet avec bundling |
| **Vite** | ✅ | Support complet |
| **Parcel** | ✅ | Support complet |
| **Rollup** | ✅ | Support complet |

### Environnements de production

| Environnement | Support | Notes |
|---------------|---------|-------|
| **CDN** | ✅ | Chargement direct via script |
| **NPM** | ✅ | Installation via package manager |
| **Docker** | ✅ | Support complet |
| **Cloudflare Workers** | ⚠️ | Limitations avec certaines APIs |
| **Service Workers** | ⚠️ | Limitations avec popups |

### Frameworks supportés

| Framework | Support | Notes |
|-----------|---------|-------|
| **React** | ✅ | Support complet |
| **Vue.js** | ✅ | Support complet |
| **Angular** | ✅ | Support complet |
| **Svelte** | ✅ | Support complet |
| **Alpine.js** | ✅ | Support complet |
| **Vanilla JS** | ✅ | Support complet |

## Configuration pour différents environnements

### Configuration de développement

```javascript
const devConfig = {
    clientId: "dev-client-id",
    environment: "test",
    debug: true,
    analytics: true,
    ui: {
        showEnvSelector: true,
        theme: "dark"
    }
};
```

### Configuration de production

```javascript
const prodConfig = {
    clientId: "prod-client-id",
    environment: "production",
    debug: false,
    analytics: true,
    ui: {
        showEnvSelector: false,
        theme: "modern"
    }
};
```

### Configuration pour tests

```javascript
const testConfig = {
    clientId: "test-client-id",
    environment: "test",
    debug: true,
    analytics: false,
    ui: {
        showEnvSelector: true,
        theme: "default"
    }
};
```

## Gestion des navigateurs non supportés

### Détection et fallback

```javascript
function initializeWidgetWithFallback() {
    const compatibility = checkBrowserCompatibility();
    
    if (compatibility.supported) {
        // Initialiser le widget normalement
        const widget = new BjPassAuthWidget({
            clientId: "your-client-id",
            onSuccess: handleAuthSuccess,
            onError: handleAuthError
        });
    } else {
        // Afficher un message de compatibilité
        showCompatibilityFallback(compatibility.results);
    }
}

function showCompatibilityFallback(results) {
    const unsupportedFeatures = Object.entries(results)
        .filter(([feature, supported]) => !supported)
        .map(([feature]) => feature);
    
    const message = `
        <div class="compatibility-warning">
            <h3>Navigateur non supporté</h3>
            <p>Votre navigateur ne supporte pas les fonctionnalités requises :</p>
            <ul>
                ${unsupportedFeatures.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <p>Veuillez utiliser un navigateur moderne comme Chrome, Firefox, Safari ou Edge.</p>
            <a href="https://browsehappy.com/" target="_blank">Mettre à jour votre navigateur</a>
        </div>
    `;
    
    document.getElementById('auth-container').innerHTML = message;
}
```

### Message de compatibilité personnalisé

```javascript
function showBrowserCompatibilityMessage() {
    const userAgent = navigator.userAgent;
    let browserName = 'votre navigateur';
    let updateUrl = 'https://browsehappy.com/';
    
    if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
        browserName = 'Internet Explorer';
        updateUrl = 'https://www.microsoft.com/edge';
    } else if (userAgent.includes('Chrome')) {
        browserName = 'Chrome';
        updateUrl = 'https://www.google.com/chrome/';
    } else if (userAgent.includes('Firefox')) {
        browserName = 'Firefox';
        updateUrl = 'https://www.mozilla.org/firefox/';
    } else if (userAgent.includes('Safari')) {
        browserName = 'Safari';
        updateUrl = 'https://www.apple.com/safari/';
    }
    
    const message = `
        <div class="browser-compatibility">
            <h3>Mise à jour requise</h3>
            <p>${browserName} ne supporte pas les fonctionnalités de sécurité modernes requises pour l'authentification.</p>
            <p>Veuillez mettre à jour votre navigateur pour une expérience sécurisée.</p>
            <a href="${updateUrl}" target="_blank" class="update-button">
                Mettre à jour ${browserName}
            </a>
        </div>
    `;
    
    document.getElementById('auth-container').innerHTML = message;
}
```

## Support mobile

### Navigateurs mobiles

| Navigateur | Support | Notes |
|------------|---------|-------|
| **Chrome Mobile** | ✅ | Support complet |
| **Safari Mobile** | ✅ | Support complet (iOS 11+) |
| **Firefox Mobile** | ✅ | Support complet |
| **Samsung Internet** | ✅ | Support complet |
| **UC Browser** | ⚠️ | Limitations avec certaines APIs |

### Optimisations mobiles

```javascript
const mobileConfig = {
    clientId: "your-client-id",
    ui: {
        theme: "modern", // Interface optimisée pour mobile
        primaryColor: "#4f46e5"
    },
    // Désactiver certaines fonctionnalités sur mobile
    debug: !isMobile(),
    analytics: true
};

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
```

## Support des versions

### Politique de support

- **Versions LTS** : Support complet pendant 2 ans
- **Versions stables** : Support complet pendant 1 an
- **Versions de développement** : Support limité

### Versions supportées

| Version | Statut | Support jusqu'à |
|---------|--------|-----------------|
| **2.x** | ✅ Actif | Décembre 2025 |
| **1.x** | ⚠️ Maintenance | Juin 2024 |
| **0.x** | ❌ Déprécié | Décembre 2023 |

### Migration entre versions

```javascript
// Vérifier la version
if (typeof BjPassAuthWidget !== 'undefined') {
    console.log('Version bj-pass:', BjPassAuthWidget.version);
    
    // Vérifier la compatibilité de version
    if (BjPassAuthWidget.version.startsWith('1.')) {
        console.warn('Version 1.x détectée. Considérez la migration vers la version 2.x.');
    }
}
```

## Tests de compatibilité

### Suite de tests automatisés

```javascript
// Tests de compatibilité à exécuter
const compatibilityTests = [
    {
        name: 'ES6 Support',
        test: () => {
            try {
                new Function('() => {}');
                return true;
            } catch (e) {
                return false;
            }
        }
    },
    {
        name: 'Web Crypto API',
        test: () => {
            return 'crypto' in window && 'subtle' in window.crypto;
        }
    },
    {
        name: 'Session Storage',
        test: () => {
            try {
                sessionStorage.setItem('test', 'test');
                sessionStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        }
    },
    {
        name: 'Fetch API',
        test: () => {
            return 'fetch' in window;
        }
    },
    {
        name: 'Promise Support',
        test: () => {
            return 'Promise' in window;
        }
    }
];

// Exécuter tous les tests
function runCompatibilityTests() {
    const results = {};
    
    compatibilityTests.forEach(test => {
        try {
            results[test.name] = test.test();
        } catch (error) {
            results[test.name] = false;
            console.error(`Test ${test.name} failed:`, error);
        }
    });
    
    return results;
}

// Utilisation
const testResults = runCompatibilityTests();
console.log('Résultats des tests de compatibilité:', testResults);
```

## Prochaines étapes

- [Sécurité](security.md) pour les considérations de sécurité
- [Dépannage](troubleshooting.md) pour résoudre les problèmes de compatibilité
- [Installation](../getting-started/installation.md) pour les instructions d'installation
