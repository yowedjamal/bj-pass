# bj-pass Authentication Widget

Un composant JavaScript modulaire pour l'authentification OAuth 2.0/OpenID Connect avec les services bj-pass, maintenant avec support complet pour React, Next.js et Angular.

## Introduction

Le widget d'authentification bj-pass fournit des capacités d'authentification sécurisées avec support pour les échanges de tokens directs et les flux médiés par backend, incluant la sécurité PKCE et la gestion d'erreurs complète. **Nouveau : Support natif pour React, Next.js et Angular !**

### Avantages clés

- **Authentification sécurisée avec PKCE** : Implémentation du Proof Key for Code Exchange pour une sécurité renforcée
- **Support multi-frameworks** : Composants natifs pour React, Next.js et Angular
- **Support multi-environnements** : Configuration pré-établie pour les environnements de test et de production
- **Architecture extensible** : Système de plugins pour personnaliser les fonctionnalités
- **Gestion d'erreurs complète** : Messages d'erreur conviviaux et standardisés
- **Support TypeScript complet** : Types et interfaces pour un développement robuste

### Démarrage rapide

#### Vanilla JavaScript
```javascript
const widget = new BjPassAuthWidget({
  clientId: "your-client-id",
  onSuccess: (tokens) => {
    console.log("Authentifié !", tokens);
  }
});
```

#### React/Next.js
```typescript
import { BjPassWidget, useBjPassAuth } from 'bj-pass-auth-widget';

function AuthComponent() {
  const { isAuthenticated, startAuth, logout } = useBjPassAuth(config);
  
  return (
    <BjPassWidget 
      config={config}
      onAuthSuccess={handleSuccess}
    />
  );
}
```

#### Angular
```typescript
import { BjPassAuthModule } from 'bj-pass-auth-widget';

@NgModule({
  imports: [BjPassAuthModule.forRoot()]
})
export class AppModule { }

// Dans un composant
@Component({
  template: '<bj-pass-widget [config]="authConfig"></bj-pass-widget>'
})
export class AuthComponent { }
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

### 🚀 Support multi-frameworks
- **React/Next.js** : Composant `BjPassWidget` et hook `useBjPassAuth`
- **Angular** : Service `BjPassAuthService`, composant `BjPassWidgetComponent` et directive `BjPassAuthDirective`
- **Vanilla JS** : API native avec support UMD, ESM et CommonJS

### 🔌 Architecture extensible
- **Système de plugins** : Architecture extensible avec plugins intégrés pour l'analytics, le débogage et la logique de retry
- **Système de hooks** : Points d'extension pour personnaliser le comportement
- **Pattern Factory** : Création de widgets avec support des thèmes

### 🛠️ Outils de développement
- **Mode debug** : Panneau de débogage avec logs détaillés
- **Analytics intégrés** : Suivi automatique des événements d'authentification
- **Gestion des erreurs** : Gestion d'erreurs complète avec messages conviviaux
- **Support TypeScript** : Types complets et interfaces pour tous les composants

## Installation

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget@latest/dist/bj-pass-auth-widget.umd.js"></script>
```

### NPM
```bash
npm install bj-pass-auth-widget
```

### Auto-initialisation
```html
<div id="auth-container" 
     data-bj-pass-widget='{"clientId":"your-client-id"}'>
</div>
```

## Configuration de base

### Vanilla JavaScript
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

### React/Next.js
```typescript
const config = {
    clientId: "your-client-id",
    environment: "test",
    redirectUri: "http://localhost:3000/callback"
};

// Avec le composant
<BjPassWidget 
    config={config}
    onAuthSuccess={handleSuccess}
    onAuthError={handleError}
/>

// Avec le hook
const { isAuthenticated, startAuth, logout } = useBjPassAuth(config);
```

### Angular
```typescript
const config = {
    clientId: "your-client-id",
    environment: "test",
    redirectUri: "http://localhost:4200/callback"
};

// Dans le template
<bj-pass-widget 
    [config]="config"
    (authSuccess)="onAuthSuccess($event)"
    (authError)="onAuthError($event)">
</bj-pass-widget>
```

## Formats de sortie

Le package est disponible en plusieurs formats pour une compatibilité maximale :

- **UMD** : Compatible navigateur et AMD
- **ESM** : Modules ES6 pour les bundlers modernes
- **CommonJS** : Compatible Node.js et bundlers traditionnels
- **TypeScript** : Types et interfaces complets

## Support

- **Documentation** : [GitHub Pages](https://bj-pass.vercel.app)
- **Issues** : [GitHub Issues](https://github.com/yowedjamal/bj-pass/issues)
- **Contact** : [yowedjamal@gmail.com](mailto:yowedjamal@gmail.com)

## Licence

© 2024 bj-pass. Tous droits réservés.