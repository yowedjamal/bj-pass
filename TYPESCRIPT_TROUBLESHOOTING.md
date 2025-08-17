# Dépannage TypeScript - bj-pass-auth-widget

Ce document explique comment résoudre les problèmes TypeScript courants lors de l'utilisation du package `bj-pass-auth-widget`.

## Problème : "Le fichier de déclaration du module 'bj-pass-auth-widget' est introuvable"

### Symptômes
```
Le fichier de déclaration du module 'bj-pass-auth-widget' est introuvable. 
'path/to/bj-pass-auth-widget.min.js' a implicitement un type 'any'.
```

### Solutions

#### 1. Vérifier l'installation
Assurez-vous que le package est correctement installé :
```bash
npm install bj-pass-auth-widget
# ou
yarn add bj-pass-auth-widget
```

#### 2. Vérifier la version
Assurez-vous d'utiliser la version 1.3.4 ou plus récente qui inclut le support TypeScript complet :
```bash
npm list bj-pass-auth-widget
```

#### 3. Importer depuis le bon chemin
Utilisez l'import principal du package :
```typescript
// ✅ Correct
import { BjPassAuthWidget, BjPassConfig } from 'bj-pass-auth-widget';

// ❌ Incorrect - ne pas importer directement depuis le fichier .js
import { BjPassAuthWidget } from 'bj-pass-auth-widget/dist/bj-pass-auth-widget.min.js';
```

#### 4. Pour les bundles UMD
Si vous utilisez le bundle UMD dans le navigateur, les types sont automatiquement disponibles via la déclaration globale :
```typescript
// Les types sont disponibles globalement
declare const widget: BjPassAuthWidget;
```

#### 5. Vérifier tsconfig.json
Assurez-vous que votre `tsconfig.json` inclut :
```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "moduleResolution": "node",
    "skipLibCheck": true
  }
}
```

## Problème : Erreurs de type avec les composants React/Angular

### Symptômes
```
Property 'BjPassWidget' does not exist on type 'typeof bj-pass-auth-widget'
```

### Solutions

#### Pour React/Next.js
```typescript
import { BjPassWidget, useBjPassAuth } from 'bj-pass-auth-widget/react';
```

#### Pour Angular
```typescript
import { BjPassAuthService, BjPassWidgetComponent } from 'bj-pass-auth-widget/angular';
```

## Problème : Types manquants pour les événements

### Symptômes
```
Property 'onAuthSuccess' does not exist on type 'BjPassWidgetProps'
```

### Solutions
Assurez-vous d'importer les types corrects :
```typescript
import { 
  BjPassWidget, 
  BjPassWidgetProps, 
  BjPassConfig, 
  AuthResult 
} from 'bj-pass-auth-widget';
```

## Vérification des types

Pour vérifier que les types fonctionnent correctement, créez un fichier de test :

```typescript
// test-types.ts
import { BjPassAuthWidget, BjPassConfig } from 'bj-pass-auth-widget';

const config: BjPassConfig = {
  clientId: 'test',
  redirectUri: 'http://localhost:3000/callback'
};

const widget = new BjPassAuthWidget(config);
widget.getConfig(); // Devrait avoir l'autocomplétion TypeScript
```

Puis compilez avec :
```bash
npx tsc --noEmit test-types.ts
```

## Support des frameworks

### React/Next.js
```typescript
import { BjPassWidget, useBjPassAuth } from 'bj-pass-auth-widget/react';
```

### Angular
```typescript
import { BjPassAuthService } from 'bj-pass-auth-widget/angular';
```

### Vanilla JavaScript
```typescript
import { BjPassAuthWidget } from 'bj-pass-auth-widget';
```

## Structure des fichiers de déclaration

Le package inclut plusieurs fichiers de déclaration TypeScript :
- `dist/types.d.ts` - Déclarations principales et globales
- `dist/bj-pass-auth-widget-types.d.ts` - Types du widget principal
- `dist/wrappers/ReactWrapper.d.ts` - Types des composants React
- `dist/wrappers/AngularWrapper.d.ts` - Types des composants Angular

## Support

Si vous rencontrez encore des problèmes :
1. Vérifiez que vous utilisez la dernière version
2. Consultez la documentation complète dans le dossier `docs/`
3. Ouvrez une issue sur GitHub avec les détails de l'erreur
