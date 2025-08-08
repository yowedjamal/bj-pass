# Sécurité

Guide des considérations de sécurité pour le widget d'authentification bj-pass.

## Vue d'ensemble

Le widget bj-pass implémente plusieurs mesures de sécurité pour garantir une authentification sécurisée et protéger les données sensibles.

## Mesures de sécurité

### PKCE (Proof Key for Code Exchange)

Le widget utilise PKCE par défaut pour renforcer la sécurité du flux OAuth 2.0.

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    pkce: true, // Activé par défaut
    onSuccess: (tokens) => {
        console.log("Authentification sécurisée réussie !", tokens);
    }
});
```

**Avantages de PKCE :**
- Protection contre les attaques par interception
- Sécurité renforcée pour les clients publics
- Conformité aux standards OAuth 2.1

### Validation des tokens

Le widget peut valider les tokens d'accès localement.

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    verifyAccessToken: true,
    onSuccess: (tokens) => {
        // Token validé avant d'être retourné
        console.log("Token validé :", tokens.access_token);
    }
});
```

### Gestion sécurisée des popups

Les popups d'authentification sont gérées de manière sécurisée.

```javascript
// Le widget gère automatiquement :
// - La taille et position des popups
// - La détection de fermeture
// - La communication sécurisée entre fenêtres
// - La protection contre les attaques de clickjacking
```

## Bonnes pratiques

### Configuration sécurisée

```javascript
const secureConfig = {
    clientId: "your-client-id",
    environment: "production",
    
    // Sécurité activée
    pkce: true,
    verifyAccessToken: true,
    
    // Configuration backend sécurisée
    beUrl: "https://secure-api.yourdomain.com/auth/exchange",
    beBearer: process.env.API_BEARER_TOKEN,
    
    // UI sécurisée
    ui: {
        showEnvSelector: false, // Masquer en production
        theme: "modern"
    },
    
    // Callbacks sécurisés
    onSuccess: (tokens) => {
        // Validation supplémentaire
        if (!tokens.access_token) {
            throw new Error('Token d\'accès manquant');
        }
        
        // Stockage sécurisé
        secureTokenStorage(tokens);
    },
    
    onError: (error) => {
        // Logging sécurisé
        logSecurityEvent('auth_error', error);
    }
};
```

### Stockage sécurisé des tokens

```javascript
class SecureTokenStorage {
    static storeTokens(tokens) {
        // Chiffrement des tokens avant stockage
        if (tokens.access_token) {
            const encryptedToken = this.encrypt(tokens.access_token);
            localStorage.setItem('encrypted_access_token', encryptedToken);
        }
        
        if (tokens.refresh_token) {
            const encryptedToken = this.encrypt(tokens.refresh_token);
            localStorage.setItem('encrypted_refresh_token', encryptedToken);
        }
        
        // Stockage des métadonnées
        localStorage.setItem('token_expires_at', tokens.expires_in ? 
            (Date.now() + tokens.expires_in * 1000).toString() : '');
    }
    
    static getAccessToken() {
        const encryptedToken = localStorage.getItem('encrypted_access_token');
        if (encryptedToken) {
            return this.decrypt(encryptedToken);
        }
        return null;
    }
    
    static getRefreshToken() {
        const encryptedToken = localStorage.getItem('encrypted_refresh_token');
        if (encryptedToken) {
            return this.decrypt(encryptedToken);
        }
        return null;
    }
    
    static clearTokens() {
        localStorage.removeItem('encrypted_access_token');
        localStorage.removeItem('encrypted_refresh_token');
        localStorage.removeItem('token_expires_at');
    }
    
    static encrypt(text) {
        // Implémentation de chiffrement (exemple simple)
        // En production, utilisez une bibliothèque de chiffrement robuste
        return btoa(text);
    }
    
    static decrypt(encryptedText) {
        // Implémentation de déchiffrement
        return atob(encryptedText);
    }
}

// Utilisation
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        SecureTokenStorage.storeTokens(tokens);
    }
});
```

### Validation des tokens côté client

```javascript
class TokenValidator {
    static validateToken(token) {
        try {
            const decoded = this.decodeJWT(token);
            const currentTime = Math.floor(Date.now() / 1000);
            
            // Vérifier l'expiration
            if (decoded.exp && decoded.exp < currentTime) {
                throw new Error('Token expiré');
            }
            
            // Vérifier l'émetteur
            if (decoded.iss && !decoded.iss.includes('bj-pass.com')) {
                throw new Error('Émetteur de token invalide');
            }
            
            // Vérifier l'audience
            if (decoded.aud && decoded.aud !== 'your-client-id') {
                throw new Error('Audience de token invalide');
            }
            
            return true;
        } catch (error) {
            console.error('Erreur de validation du token:', error);
            return false;
        }
    }
    
    static decodeJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    }
}

// Utilisation
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        if (TokenValidator.validateToken(tokens.access_token)) {
            console.log('Token validé avec succès');
            // Procéder avec l'authentification
        } else {
            console.error('Token invalide');
            // Gérer l'erreur
        }
    }
});
```

## Protection contre les attaques

### Protection CSRF

Le widget utilise automatiquement le paramètre `state` pour la protection CSRF.

```javascript
// Le widget génère automatiquement un state unique
// et le valide lors de l'échange de tokens
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    // La protection CSRF est activée par défaut
});
```

### Protection contre les attaques de clickjacking

```javascript
// Le widget utilise des techniques pour détecter
// et prévenir les attaques de clickjacking
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    // Protection automatique activée
});
```

### Validation des origines

```javascript
// Le widget valide automatiquement les origines
// pour prévenir les attaques de redirection
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    redirectUri: "https://yourdomain.com/auth/callback",
    // Validation d'origine automatique
});
```

## Logging de sécurité

### Événements de sécurité

```javascript
class SecurityLogger {
    static logSecurityEvent(eventType, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            eventType: eventType,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href,
            sessionId: this.getSessionId()
        };
        
        // Log local
        console.log('Security Event:', logEntry);
        
        // Envoi au service de sécurité
        this.sendToSecurityService(logEntry);
    }
    
    static logAuthAttempt(success, details) {
        this.logSecurityEvent('auth_attempt', {
            success: success,
            details: details
        });
    }
    
    static logTokenValidation(success, tokenInfo) {
        this.logSecurityEvent('token_validation', {
            success: success,
            tokenInfo: tokenInfo
        });
    }
    
    static logSecurityViolation(violationType, details) {
        this.logSecurityEvent('security_violation', {
            violationType: violationType,
            details: details
        });
    }
    
    static getSessionId() {
        return sessionStorage.getItem('session_id') || 'unknown';
    }
    
    static sendToSecurityService(logEntry) {
        // Envoi sécurisé au service de monitoring
        fetch('/api/security/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Security-Token': this.getSecurityToken()
            },
            body: JSON.stringify(logEntry)
        }).catch(error => {
            console.error('Erreur lors de l\'envoi du log de sécurité:', error);
        });
    }
    
    static getSecurityToken() {
        // Récupérer le token de sécurité pour l'API
        return localStorage.getItem('security_token') || '';
    }
}

// Utilisation
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        SecurityLogger.logAuthAttempt(true, {
            clientId: 'your-client-id',
            hasAccessToken: !!tokens.access_token
        });
    },
    onError: (error) => {
        SecurityLogger.logAuthAttempt(false, {
            errorCode: error.code,
            errorMessage: error.message
        });
    }
});
```

## Configuration de sécurité par environnement

### Configuration de développement

```javascript
const devSecurityConfig = {
    clientId: "dev-client-id",
    environment: "test",
    
    // Sécurité de base
    pkce: true,
    verifyAccessToken: false, // Désactivé en dev pour les tests
    
    // Logging détaillé
    debug: true,
    
    // UI de développement
    ui: {
        showEnvSelector: true,
        theme: "dark"
    }
};
```

### Configuration de production

```javascript
const prodSecurityConfig = {
    clientId: "prod-client-id",
    environment: "production",
    
    // Sécurité maximale
    pkce: true,
    verifyAccessToken: true,
    
    // Pas de debug en production
    debug: false,
    
    // UI de production
    ui: {
        showEnvSelector: false,
        theme: "modern"
    },
    
    // Callbacks sécurisés
    onSuccess: (tokens) => {
        // Validation stricte
        if (!TokenValidator.validateToken(tokens.access_token)) {
            throw new Error('Token invalide reçu');
        }
        
        // Stockage sécurisé
        SecureTokenStorage.storeTokens(tokens);
        
        // Logging de sécurité
        SecurityLogger.logAuthAttempt(true, {
            clientId: 'prod-client-id'
        });
    },
    
    onError: (error) => {
        // Logging des erreurs de sécurité
        SecurityLogger.logSecurityViolation('auth_error', {
            errorCode: error.code,
            errorMessage: error.message
        });
    }
};
```

## Audit de sécurité

### Checklist de sécurité

```javascript
class SecurityAuditor {
    static runSecurityCheck() {
        const checks = [
            {
                name: 'HTTPS',
                check: () => window.location.protocol === 'https:',
                critical: true
            },
            {
                name: 'PKCE Enabled',
                check: () => {
                    const widget = window.bjPassWidget;
                    return widget && widget.getConfig().pkce;
                },
                critical: true
            },
            {
                name: 'Secure Token Storage',
                check: () => {
                    const accessToken = localStorage.getItem('access_token');
                    return !accessToken || accessToken.startsWith('encrypted_');
                },
                critical: true
            },
            {
                name: 'Debug Disabled in Production',
                check: () => {
                    const widget = window.bjPassWidget;
                    return !widget || !widget.getConfig().debug;
                },
                critical: false
            }
        ];
        
        const results = {};
        let allPassed = true;
        
        checks.forEach(check => {
            try {
                results[check.name] = check.check();
                if (!results[check.name] && check.critical) {
                    allPassed = false;
                }
            } catch (error) {
                results[check.name] = false;
                if (check.critical) {
                    allPassed = false;
                }
            }
        });
        
        return {
            passed: allPassed,
            results: results
        };
    }
}

// Exécuter l'audit
const auditResults = SecurityAuditor.runSecurityCheck();
console.log('Résultats de l\'audit de sécurité:', auditResults);
```

## Prochaines étapes

- [Dépannage](troubleshooting.md) pour résoudre les problèmes de sécurité
- [Compatibilité](compatibility.md) pour les considérations de compatibilité
- [Gestion des erreurs](../advanced/error-handling.md) pour la gestion sécurisée des erreurs