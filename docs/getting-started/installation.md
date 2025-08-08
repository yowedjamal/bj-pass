# Installation

Ce guide vous explique comment installer et configurer le widget d'authentification bj-pass dans votre projet.

## Méthodes d'installation

### 1. CDN (Recommandé pour les tests)

Incluez le script du widget dans votre HTML :

```html
<script src="https://cdn.yourdomain.com/bj-pass-widget.js"></script>
```

### 2. NPM (Recommandé pour la production)

Installez via npm :

```bash
npm install @bj-pass/auth-widget
```

Puis importez dans votre code :

```javascript
import { BjPassAuthWidget } from '@bj-pass/auth-widget';
```

### 3. Téléchargement direct

Téléchargez les fichiers depuis le [repository GitHub](https://github.com/yowedjamal/bj-pass) :

```bash
git clone https://github.com/yowedjamal/bj-pass.git
cd bj-pass
npm install
npm run build
```

## Auto-initialisation

Utilisez les attributs data pour l'auto-initialisation :

```html
<div id="auth-container" 
     data-bj-pass-widget='{"clientId":"your-client-id"}'>
</div>
```

> **Note** : Assurez-vous que le script du widget est chargé après l'élément DOM.

## Configuration minimale

Voici la configuration minimale requise pour démarrer :

```javascript
const widget = new BjPassAuthWidget({
    clientId: "your-client-id",
    onSuccess: (tokens) => {
        console.log("Authentification réussie !", tokens);
    },
    onError: (error) => {
        console.error("Échec de l'authentification :", error);
    }
});
```

## Vérification de l'installation

Pour vérifier que l'installation s'est bien déroulée :

```javascript
// Vérifiez que la classe est disponible
if (typeof BjPassAuthWidget !== 'undefined') {
    console.log('bj-pass widget installé avec succès !');
} else {
    console.error('Erreur : bj-pass widget non trouvé');
}
```

## Prochaines étapes

Une fois l'installation terminée, consultez :

- [Guide d'utilisation de base](usage.md) pour apprendre à utiliser le widget
- [Guide de configuration](configuration.md) pour personnaliser le comportement
- [Référence API](../api-reference/core-api.md) pour les options avancées