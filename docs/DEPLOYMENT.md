# Déploiement de la Documentation GitBook

Ce guide vous explique comment déployer votre documentation GitBook de plusieurs façons différentes.

## Option 1: GitBook.com (Recommandé)

### 1. Créer un compte GitBook
1. Allez sur [gitbook.com](https://gitbook.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "Create a new space"

### 2. Connecter votre repository GitHub
1. Dans GitBook, choisissez "Import from Git"
2. Connectez votre compte GitHub
3. Sélectionnez le repository `yowedjamal/bj-pass`
4. GitBook détectera automatiquement la structure de votre documentation

### 3. Configuration automatique
GitBook reconnaîtra automatiquement :
- `book.json` pour la configuration
- `SUMMARY.md` pour la table des matières
- Tous les fichiers Markdown dans `docs/`

### 4. Déploiement automatique
- Chaque push sur votre repository déclenchera un nouveau déploiement
- Votre documentation sera accessible via une URL comme : `https://yowedjamal.gitbook.io/bj-pass`

## Option 2: GitHub Pages avec GitBook CLI

### 1. Installer Honkit (Alternative moderne à GitBook CLI)
```bash
npm install -g honkit
```

### 2. Construire la documentation
```bash
cd docs
honkit build . ../_book
```

### 4. Configurer GitHub Pages
1. Allez dans les paramètres de votre repository GitHub
2. Activez GitHub Pages
3. Choisissez la branche `gh-pages` ou le dossier `_book`

### 5. Déployer automatiquement
Créez un workflow GitHub Actions dans `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install Honkit
      run: npm install -g honkit
    
    - name: Build documentation
      run: |
        cd docs
        honkit build . ../_book
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./_book
```

## Option 3: Netlify

### 1. Construire localement
```bash
cd docs
honkit build . ../_book
```

### 2. Déployer sur Netlify
1. Allez sur [netlify.com](https://netlify.com)
2. Créez un compte
3. Connectez votre repository GitHub
4. Configurez :
   - **Build command** : `cd docs && honkit build . ../_book`
   - **Publish directory** : `_book`

### 3. Configuration Netlify
Créez un fichier `netlify.toml` à la racine :

```toml
[build]
  command = "cd docs && honkit build . ../_book"
  publish = "_book"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Option 4: Vercel

### 1. Installer Vercel CLI
```bash
npm install -g vercel
```

### 2. Construire et déployer
```bash
cd docs
honkit build . ../_book
cd ..
vercel _book
```

### 3. Configuration Vercel
Créez un fichier `vercel.json` :

```json
{
  "buildCommand": "cd docs && honkit build . ../_book",
  "outputDirectory": "_book",
  "framework": null
}
```

## Configuration personnalisée

### Domaine personnalisé
Pour utiliser un domaine personnalisé (ex: `docs.bj-pass.com`) :

1. **GitBook.com** : Paramètres → Domains
2. **GitHub Pages** : Paramètres → Pages → Custom domain
3. **Netlify/Vercel** : Paramètres → Domains

### Variables d'environnement
Ajoutez dans `book.json` :

```json
{
  "variables": {
    "version": "1.0.0",
    "github": "yowedjamal/bj-pass",
    "email": "yowedjamal@gmail.com",
    "baseUrl": "https://docs.bj-pass.com"
  }
}
```

## Recommandations

### Pour le développement
- **GitBook.com** : Idéal pour la collaboration et les mises à jour fréquentes
- **GitHub Pages** : Parfait si vous voulez garder tout dans GitHub

### Pour la production
- **GitBook.com** : Solution complète avec analytics et collaboration
- **Netlify/Vercel** : Performance optimale et déploiement automatique

### Pour l'entreprise
- **GitBook.com** : Version Enterprise avec SSO et contrôle d'accès
- **Self-hosted** : Déploiement sur vos propres serveurs

## Prochaines étapes

1. **Choisissez votre plateforme** selon vos besoins
2. **Configurez le déploiement automatique**
3. **Testez la documentation** en local avant déploiement
4. **Configurez un domaine personnalisé** si nécessaire
5. **Ajoutez des analytics** pour suivre l'usage

## Support

Si vous rencontrez des problèmes :
- **GitBook.com** : [support.gitbook.com](https://support.gitbook.com)
- **GitHub Pages** : [docs.github.com/pages](https://docs.github.com/pages)
- **Netlify** : [docs.netlify.com](https://docs.netlify.com)
- **Vercel** : [vercel.com/docs](https://vercel.com/docs)

---

*Documentation générée pour bj-pass Authentication Widget*  
*© 2024 bj-pass - Contact : yowedjamal@gmail.com* 