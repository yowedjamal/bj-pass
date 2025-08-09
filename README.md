# bj-pass Authentication Widget

Widget d'authentification OAuth 2.0/OpenID Connect moderne et sécurisé pour les services bj-pass.

## 🚀 Installation

### Via CDN (Recommandé)

```html
<script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget@1.0.5/dist/bj-pass-auth-widget.min.js"></script>
```

### Via NPM

```bash
npm install bj-pass-auth-widget
```

```javascript
import BjPassAuthWidget from 'bj-pass-auth-widget';
```

### Installation locale

```bash
git clone https://github.com/yowedjamal/bj-pass.git
cd bj-pass
npm install
npm run build
```

## 📖 Utilisation

### Configuration de base

```javascript
const widget = new BjPassAuthWidget({
  clientId: 'votre-client-id',
  environment: 'test', // ou 'production'
  onSuccess: (tokens) => {
    console.log('Authentification réussie:', tokens);
  },
  onError: (error) => {
    console.error('Erreur:', error);
  }
});
```

### Configuration avancée

```javascript
const widget = new BjPassAuthWidget({
  clientId: 'votre-client-id',
  environment: 'production',
  scope: 'openid profile email',
  redirectUri: 'https://votre-domaine.com/auth/callback',
  pkce: true,
  verifyAccessToken: true,
  ui: {
    primaryColor: '#0066cc',
    language: 'fr',
    theme: 'default'
  },
  onSuccess: (tokens) => {
    // Gérer le succès
  },
  onError: (error) => {
    // Gérer l'erreur
  }
});
```

### Auto-initialisation

```html
<div id="auth-container" data-bjpass-widget='{"clientId": "votre-client-id"}'>
</div>
```

## 🛠️ Développement

### Prérequis

- Node.js >= 18.0.0
- npm

### Installation des dépendances

```bash
npm install
```

### Build

```bash
# Build de production
npm run build

# Build de développement
npm run build:dev

# Mode développement avec watch
npm run dev
```

### Tests

```bash
# Tests unitaires
npm test

# Linting
npm run lint

# Formatage
npm run format
```

## 📁 Structure du projet

```
.
├── src/
│   └── bj-pass-auth-widget.js    # Code source principal
├── dist/                         # Fichiers construits (générés)
├── docs/                         # Documentation GitBook
├── examples/                     # Exemples d'utilisation
├── webpack.config.js            # Configuration Webpack
├── package.json                 # Configuration npm
└── README.md                    # Ce fichier
```

## 🔧 Configuration

### Options principales

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `clientId` | string | - | **Requis** - ID client OAuth |
| `environment` | string | 'test' | Environnement ('test' ou 'production') |
| `scope` | string | 'openid profile' | Scopes OAuth |
| `redirectUri` | string | auto | URI de redirection |
| `pkce` | boolean | true | Activer PKCE |
| `verifyAccessToken` | boolean | false | Vérifier le token d'accès |

### Options UI

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `ui.primaryColor` | string | '#0066cc' | Couleur principale |
| `ui.language` | string | 'fr' | Langue ('fr' ou 'en') |
| `ui.theme` | string | 'default' | Thème ('default', 'dark', 'modern', 'minimal') |
| `ui.showEnvSelector` | boolean | true | Afficher le sélecteur d'environnement |

## 🔌 API

### Méthodes principales

```javascript
// Démarrer l'authentification
widget.startAuthFlow();

// Vérifier si authentifié
const isAuth = widget.isAuthenticated();

// Obtenir les tokens
const tokens = widget.getTokens();

// Mettre à jour la configuration
widget.updateConfig({ environment: 'production' });

// Détruire le widget
widget.destroy();
```

### Callbacks

```javascript
const widget = new BjPassAuthWidget({
  onSuccess: (tokens) => {
    // Appelé lors d'une authentification réussie
  },
  onError: (error) => {
    // Appelé lors d'une erreur
  }
});
```

## 🎨 Thèmes disponibles

- **default** : Thème classique bleu
- **dark** : Thème sombre
- **modern** : Thème moderne avec indigo
- **minimal** : Thème minimaliste noir et blanc

## 🔒 Sécurité

- **PKCE** : Proof Key for Code Exchange activé par défaut
- **Validation des tokens** : Validation automatique des ID tokens
- **Gestion sécurisée des popups** : Protection contre les attaques XSS
- **Validation du state** : Protection contre les attaques CSRF

## 🌐 Compatibilité

- **Navigateurs** : Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Environnements** : Browser, Node.js, Webpack, Vite
- **Frameworks** : React, Vue.js, Angular, vanilla JS

## 📚 Documentation complète

Consultez la [documentation complète](docs/) pour plus de détails sur :
- API de référence
- Exemples avancés
- Gestion des erreurs
- Intégration avec des frameworks
- Déploiement

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

- **Email** : yowedjamal@gmail.com
- **GitHub** : [yowedjamal/bj-pass](https://github.com/yowedjamal/bj-pass)
- **Issues** : [GitHub Issues](https://github.com/yowedjamal/bj-pass/issues)

---

© 2024 bj-pass - Développé avec ❤️ par yowedjamal 