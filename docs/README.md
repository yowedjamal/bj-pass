# bj-pass Authentication Widget

Un composant JavaScript modulaire pour l'authentification OAuth 2.0/OpenID Connect avec les services bj-pass.

## Introduction

Le widget d'authentification bj-pass fournit des capacités d'authentification sécurisées avec support pour les échanges de tokens directs et les flux médiés par backend, incluant la sécurité PKCE et la gestion d'erreurs complète.

### Avantages clés

- **Authentification sécurisée avec PKCE** : Implémentation du Proof Key for Code Exchange pour une sécurité renforcée
- **Support multi-environnements** : Configuration pré-établie pour les environnements de test et de production
- **Architecture extensible** : Système de plugins pour personnaliser les fonctionnalités
- **Gestion d'erreurs complète** : Messages d'erreur conviviaux et standardisés

### Démarrage rapide

```javascript
const widget = new BjPassAuthWidget({
  clientId: "your-client-id",
  onSuccess: (tokens) => {
    console.log("Authentifié !", tokens);
  }
});
```

## Fonctionnalités principales

### 🔐 Sécurité avancée
- **PKCE** : Proof Key for Code Exchange implémenté pour une sécurité renforcée
- **Validation des tokens** : Validation JWT complète incluant la vérification de signature
- **Gestion sécurisée des popups** : Gestion sécurisée des fenêtres popup pour les flux d'authentification

### 🎨 Interface utilisateur
- **Composants UI personnalisables** : Sélecteur d'environnement, bouton de connexion et affichage d'erreurs
- **Thèmes multiples** : Support des thèmes par défaut, sombre, moderne et minimal
- **Support multilingue** : Interface en français et anglais

### 🔌 Architecture extensible
- **Système de plugins** : Architecture extensible avec plugins intégrés pour l'analytics, le débogage et la logique de retry
- **Système de hooks** : Points d'extension pour personnaliser le comportement
- **Pattern Factory** : Création de widgets avec support des thèmes

### 🛠️ Outils de développement
- **Mode debug** : Panneau de débogage avec logs détaillés
- **Analytics intégrés** : Suivi automatique des événements d'authentification
- **Gestion des erreurs** : Gestion d'erreurs complète avec messages conviviaux

## Installation

### CDN
```html
<script src="https://www.npmjs.com/package/bj-pass-auth-widget"></script>
```

### NPM
```bash
npm install @bj-pass/auth-widget
```

### Auto-initialisation
```html
<div id="auth-container" 
     data-bj-pass-widget='{"clientId":"your-client-id"}'>
</div>
```

## Configuration de base

```javascript
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
    },
    onError: (error) => {
        console.error("Échec de l'authentification :", error);
    }
});
```

## Support

- **Documentation** : [GitHub Pages](https://bj-pass.vercel.app)
- **Issues** : [GitHub Issues](https://github.com/yowedjamal/bj-pass/issues)
- **Contact** : [yowedjamal@gmail.com](mailto:yowedjamal@gmail.com)

## Licence

© 2024 bj-pass. Tous droits réservés.