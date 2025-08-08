# Déploiement sur jsDelivr CDN

Ce guide vous explique comment déployer le widget `bj-pass` sur [jsDelivr CDN](https://cdn.jsdelivr.net/) pour une distribution mondiale.

## 🚀 Étape 1: Préparer le package npm

### 1. Installer les dépendances de développement

```bash
npm install
```

### 2. Construire le widget

```bash
npm run build
```

Cela générera les fichiers dans le dossier `dist/` :
- `bj-pass-auth-widget.min.js` - Version minifiée
- `bj-pass-auth-widget.min.js.map` - Source map

### 3. Tester la construction

```bash
# Tester en local
npm run build:dev
```

## 📦 Étape 2: Publier sur npm

### 1. Créer un compte npm

```bash
npm adduser
```

### 2. Vérifier le package

```bash
npm pack
```

### 3. Publier

```bash
npm publish
```

## 🌐 Étape 3: Utilisation via jsDelivr

Une fois publié sur npm, le widget sera automatiquement disponible sur jsDelivr :

### URL de base

```
https://cdn.jsdelivr.net/npm/bj-pass-auth-widget@2.0.0/dist/bj-pass-auth-widget.min.js
```

### Exemples d'utilisation

#### Version spécifique
```html
<script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget@2.0.0/dist/bj-pass-auth-widget.min.js"></script>
```

#### Dernière version
```html
<script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget/dist/bj-pass-auth-widget.min.js"></script>
```

#### Version avec range
```html
<script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget@2/dist/bj-pass-auth-widget.min.js"></script>
```

## 🔧 Étape 4: Intégration dans vos projets

### HTML simple

```html
<!DOCTYPE html>
<html>
<head>
    <title>bj-pass Widget Demo</title>
    <script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget@2.0.0/dist/bj-pass-auth-widget.min.js"></script>
</head>
<body>
    <div id="auth-container"></div>
    
    <script>
        const widget = new BjPassAuthWidget({
            clientId: 'your-client-id',
            onSuccess: (tokens) => {
                console.log('Authentification réussie !', tokens);
            },
            onError: (error) => {
                console.error('Erreur:', error);
            }
        });
    </script>
</body>
</html>
```

### Auto-initialisation

```html
<div id="auth-widget" 
     data-bj-pass-widget 
     data-bj-pass-config='{"clientId": "your-client-id"}'>
</div>
```

## 📊 Étape 5: Statistiques et monitoring

### Statistiques jsDelivr

- **Statistiques globales** : [https://www.jsdelivr.com/package/npm/bj-pass-auth-widget](https://www.jsdelivr.com/package/npm/bj-pass-auth-widget)
- **API de statistiques** : `https://data.jsdelivr.com/v1/packages/npm/bj-pass-auth-widget/stats`

### Exemple de requête API

```javascript
fetch('https://data.jsdelivr.com/v1/packages/npm/bj-pass-auth-widget/stats')
  .then(response => response.json())
  .then(data => {
    console.log('Statistiques de téléchargement:', data);
  });
```

## 🔄 Étape 6: Mises à jour

### Pour une nouvelle version

1. **Mettre à jour la version** dans `package.json`
2. **Construire** : `npm run build`
3. **Publier** : `npm publish`
4. **Mettre à jour la documentation** avec la nouvelle URL

### Exemple de mise à jour

```bash
# Mettre à jour la version
npm version patch  # ou minor, major

# Construire et publier
npm run build
npm publish
```

## 🌍 Avantages de jsDelivr

### Performance
- **Réseau global** : Plus de 540 points de présence
- **HTTP/3** : Protocole moderne pour de meilleures performances
- **Compression Brotli** : Réduction de la taille des fichiers
- **Cache intelligent** : Mise en cache optimisée

### Fiabilité
- **Multi-CDN** : 4 CDN + 3 fournisseurs DNS
- **Failover automatique** : Basculement en cas de problème
- **Uptime 99.9%** : Disponibilité garantie

### Fonctionnalités
- **Minification automatique** : Ajoutez `.min` à n'importe quel fichier
- **Source maps** : Support complet pour le débogage
- **Versioning flexible** : Ranges de versions supportés

## 📋 Checklist de déploiement

- [ ] Code testé et fonctionnel
- [ ] `package.json` configuré correctement
- [ ] Fichiers construits (`npm run build`)
- [ ] Tests passés (`npm test`)
- [ ] Package testé localement (`npm pack`)
- [ ] Compte npm créé et connecté
- [ ] Package publié (`npm publish`)
- [ ] URL jsDelivr testée
- [ ] Documentation mise à jour
- [ ] Exemples de code vérifiés

## 🆘 Support

### Problèmes courants

#### Erreur 404 sur jsDelivr
- Vérifiez que le package est bien publié sur npm
- Attendez quelques minutes (délai de propagation)
- Vérifiez l'URL exacte

#### Problèmes de cache
- Forcez le rafraîchissement : `?v=timestamp`
- Utilisez une version spécifique
- Contactez le support jsDelivr si nécessaire

### Liens utiles

- **jsDelivr** : [https://www.jsdelivr.com/](https://www.jsdelivr.com/)
- **Documentation jsDelivr** : [https://www.jsdelivr.com/documentation](https://www.jsdelivr.com/documentation)
- **API jsDelivr** : [https://data.jsdelivr.com/v1/](https://data.jsdelivr.com/v1/)
- **Support npm** : [https://docs.npmjs.com/](https://docs.npmjs.com/)

---

*Guide de déploiement pour bj-pass Authentication Widget*  
*© 2024 bj-pass - Contact : yowedjamal@gmail.com* 