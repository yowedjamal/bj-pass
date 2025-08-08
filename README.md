# bj-pass Authentication Widget

Widget d'authentification OAuth 2.0/OpenID Connect moderne et sécurisé pour les applications web.

## 📚 Documentation

La documentation complète est disponible dans le dossier `docs/` et peut être consultée de plusieurs façons :

### 🌐 Consultation en ligne

- **GitBook.com** : [https://yowedjamal.gitbook.io/bj-pass](https://yowedjamal.gitbook.io/bj-pass) (recommandé)
- **GitHub Pages** : [https://yowedjamal.github.io/bj-pass](https://yowedjamal.github.io/bj-pass)

## 🚀 Installation et utilisation

### Via jsDelivr CDN (Recommandé)

```html
<script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget@2.0.0/dist/bj-pass-auth-widget.min.js"></script>
```

### Via npm

```bash
npm install bj-pass-auth-widget
```

```javascript
import BjPassAuthWidget from 'bj-pass-auth-widget';
```

### Utilisation basique

```javascript
const widget = new BjPassAuthWidget({
    clientId: 'your-client-id',
    onSuccess: (tokens) => {
        console.log('Authentification réussie !', tokens);
    },
    onError: (error) => {
        console.error('Erreur:', error);
    }
});
```

### 🏃‍♂️ Consultation locale

```bash
# Installer Honkit
npm install -g honkit

# Aller dans le dossier docs
cd docs

# Construire la documentation
honkit build . ../_book

# Servir localement
honkit serve . ../_book
```

La documentation sera alors accessible sur `http://localhost:4000`

## 🚀 Déploiement

### Déploiement automatique

Le projet inclut des configurations pour plusieurs plateformes :

- **GitHub Pages** : Workflow GitHub Actions dans `.github/workflows/deploy.yml`
- **Netlify** : Configuration dans `netlify.toml`
- **Vercel** : Configuration dans `vercel.json`

### Déploiement manuel

Consultez le guide complet dans [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

## 📁 Structure de la documentation

```
docs/
├── README.md                    # Introduction
├── SUMMARY.md                   # Table des matières
├── book.json                    # Configuration GitBook
├── getting-started/             # Guide de démarrage
│   ├── installation.md
│   ├── usage.md
│   └── configuration.md
├── api-reference/               # Référence API
│   ├── core-api.md
│   ├── enhanced-api.md
│   ├── factory-api.md
│   └── hooks.md
├── advanced/                    # Fonctionnalités avancées
│   ├── plugins.md
│   ├── error-handling.md
│   └── examples.md
├── additional-info/             # Informations supplémentaires
│   ├── compatibility.md
│   ├── security.md
│   └── troubleshooting.md
└── DEPLOYMENT.md               # Guide de déploiement
```

## 🔧 Développement

### Prérequis

- Node.js 18+ (recommandé)
- Honkit (alternative moderne à GitBook CLI)

### Installation

```bash
# Cloner le repository
git clone https://github.com/yowedjamal/bj-pass.git
cd bj-pass

# Installer Honkit
npm install -g honkit

# Construire la documentation
cd docs
honkit build . ../_book
```

### Modification de la documentation

1. Modifiez les fichiers Markdown dans `docs/`
2. Testez localement : `honkit serve . ../_book`
3. Committez et poussez vos changements
4. Le déploiement se fera automatiquement

## 📞 Support

- **Email** : yowedjamal@gmail.com
- **GitHub** : [https://github.com/yowedjamal/bj-pass](https://github.com/yowedjamal/bj-pass)
- **Documentation** : [https://yowedjamal.gitbook.io/bj-pass](https://yowedjamal.gitbook.io/bj-pass)

## 📄 Licence

© 2024 bj-pass - Tous droits réservés 