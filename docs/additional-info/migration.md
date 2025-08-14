# Migration et Mises à Jour

Ce guide vous aide à migrer vers les nouvelles versions du package `bj-pass-auth-widget` et à comprendre les changements entre les versions.

## 📋 Historique des Versions

### Version 1.3.3 (Actuelle)

**Nouvelles fonctionnalités :**
- ✅ Support complet pour React et Next.js
- ✅ Support complet pour Angular
- ✅ Support TypeScript complet
- ✅ Wrappers pour frameworks populaires
- ✅ Builds multiples (UMD, ESM, CommonJS)
- ✅ Types et interfaces complets

**Améliorations :**
- 🔧 Configuration Webpack optimisée
- 🔧 Support des exports conditionnels
- 🔧 Gestion des dépendances peer
- 🔧 Documentation complète

### Version 1.2.0

**Fonctionnalités :**
- ✅ Support de base pour React
- ✅ Hook `useBjPassAuth`
- ✅ Composant `BjPassWidget`

### Version 1.1.0

**Fonctionnalités :**
- ✅ Support TypeScript de base
- ✅ Types de base pour la configuration

### Version 1.0.0

**Fonctionnalités initiales :**
- ✅ Widget d'authentification de base
- ✅ Support OAuth 2.0/OpenID Connect
- ✅ Support PKCE
- ✅ Gestion des erreurs

## 🔄 Guide de Migration

### Migration depuis la version 1.2.0

#### 1. Mise à jour du package

```bash
npm update bj-pass-auth-widget
# ou
npm install bj-pass-auth-widget@latest
```

#### 2. Vérification des imports

**Avant (v1.2.0) :**
```typescript
import { BjPassWidget, useBjPassAuth } from 'bj-pass-auth-widget';
```

**Après (v1.3.3) :**
```typescript
// Même import, mais avec plus de fonctionnalités
import { BjPassWidget, useBjPassAuth } from 'bj-pass-auth-widget';
```

#### 3. Nouvelles fonctionnalités disponibles

```typescript
// Nouvelles fonctionnalités disponibles
import { 
  BjPassAuthService,        // Service Angular
  BjPassWidgetComponent,    // Composant Angular
  BjPassAuthDirective,      // Directive Angular
  BjPassAuthModule          // Module Angular
} from 'bj-pass-auth-widget';

// Types complets
import type {
  BjPassConfig,
  AuthResult,
  UserInfo,
  TokenInfo
} from 'bj-pass-auth-widget';
```

### Migration depuis la version 1.1.0

#### 1. Mise à jour du package

```bash
npm install bj-pass-auth-widget@latest
```

#### 2. Ajout des types manquants

**Avant (v1.1.0) :**
```typescript
// Types limités
interface Config {
  clientId: string;
  environment?: string;
}
```

**Après (v1.3.3) :**
```typescript
import type { BjPassConfig } from 'bj-pass-auth-widget';

const config: BjPassConfig = {
  clientId: 'your-client-id',
  environment: 'test',
  scope: 'openid profile email',
  pkce: true,
  ui: {
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'modern'
  }
};
```

#### 3. Utilisation des nouveaux composants

```typescript
// Si vous voulez migrer vers React
import { BjPassWidget } from 'bj-pass-auth-widget';

function App() {
  return (
    <BjPassWidget
      config={config}
      onAuthSuccess={handleSuccess}
      onAuthError={handleError}
    />
  );
}
```

### Migration depuis la version 1.0.0

#### 1. Mise à jour majeure

```bash
npm install bj-pass-auth-widget@latest
```

#### 2. Changements dans la configuration

**Avant (v1.0.0) :**
```javascript
const widget = new BjPassAuthWidget({
  clientId: 'your-client-id',
  environment: 'test',
  onSuccess: handleSuccess,
  onError: handleError
});
```

**Après (v1.3.3) :**
```javascript
// Configuration étendue
const widget = new BjPassAuthWidget({
  clientId: 'your-client-id',
  environment: 'test',
  scope: 'openid profile email',
  pkce: true,
  ui: {
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'modern'
  },
  onSuccess: handleSuccess,
  onError: handleError
});
```

#### 3. Nouvelle API disponible

```javascript
// Nouvelles méthodes
const user = await widget.getUserInfo();
const tokens = await widget.refreshTokens();

// Nouveaux hooks
widget.addHook('afterAuthStart', (result) => {
  console.log('Authentification démarrée:', result);
});

// Nouveaux plugins
widget.addPlugin({
  name: 'analytics',
  version: '1.0.0',
  install: (widget) => {
    // Logique du plugin
  }
});
```

## 🆕 Nouvelles Fonctionnalités

### Support React/Next.js

```typescript
// Composant React
import { BjPassWidget } from 'bj-pass-auth-widget';

function LoginPage() {
  return (
    <BjPassWidget
      config={authConfig}
      onAuthSuccess={handleSuccess}
      onAuthError={handleError}
    />
  );
}

// Hook React
import { useBjPassAuth } from 'bj-pass-auth-widget';

function AuthComponent() {
  const { isAuthenticated, startAuth, logout } = useBjPassAuth(config);
  
  return (
    <button onClick={startAuth}>
      {isAuthenticated ? 'Se déconnecter' : 'Se connecter'}
    </button>
  );
}
```

### Support Angular

```typescript
// Module Angular
import { BjPassAuthModule } from 'bj-pass-auth-widget';

@NgModule({
  imports: [BjPassAuthModule.forRoot()]
})
export class AppModule { }

// Service Angular
import { BjPassAuthService } from 'bj-pass-auth-widget';

@Injectable()
export class AuthService {
  constructor(private bjpass: BjPassAuthService) {}
  
  async login() {
    await this.bjpass.startAuth();
  }
}

// Composant Angular
@Component({
  template: '<bj-pass-widget [config]="authConfig"></bj-pass-widget>'
})
export class AuthComponent { }
```

### Support TypeScript Complet

```typescript
// Types complets
import type {
  BjPassConfig,
  AuthResult,
  UserInfo,
  TokenInfo,
  Plugin,
  HookCallback
} from 'bj-pass-auth-widget';

// Configuration typée
const config: BjPassConfig = {
  clientId: 'your-client-id',
  environment: 'test',
  scope: 'openid profile email',
  pkce: true
};

// Résultats typés
const handleAuthSuccess = (result: AuthResult) => {
  if (result.user) {
    console.log('Utilisateur:', result.user.name);
  }
  if (result.tokens) {
    console.log('Tokens:', result.tokens.accessToken);
  }
};
```

## 🔧 Changements de Configuration

### Webpack

**Avant :**
```javascript
// webpack.config.js simple
module.exports = {
  entry: './src/bj-pass-auth-widget.js',
  output: {
    filename: 'bj-pass-auth-widget.js',
    library: 'BjPassAuthWidget'
  }
};
```

**Après :**
```javascript
// webpack.config.js avec builds multiples
module.exports = [
  // UMD build
  {
    entry: './src/bj-pass-auth-widget.js',
    output: {
      filename: 'bj-pass-auth-widget.umd.js',
      library: { name: 'BjPassAuthWidget', type: 'umd' }
    }
  },
  // ESM build
  {
    entry: './src/index.ts',
    output: {
      filename: 'bj-pass-auth-widget.esm.js',
      library: { type: 'module' }
    },
    experiments: { outputModule: true }
  },
  // CommonJS build
  {
    entry: './src/bj-pass-auth-widget.js',
    target: 'node',
    output: {
      filename: 'bj-pass-auth-widget.cjs.js',
      library: { type: 'commonjs2' }
    }
  }
];
```

### Package.json

**Avant :**
```json
{
  "main": "dist/bj-pass-auth-widget.js",
  "types": "src/types/index.d.ts"
}
```

**Après :**
```json
{
  "main": "dist/bj-pass-auth-widget.cjs.js",
  "module": "dist/bj-pass-auth-widget.esm.js",
  "types": "dist/bj-pass-auth-widget.d.ts",
  "exports": {
    ".": {
      "import": "./dist/bj-pass-auth-widget.esm.js",
      "require": "./dist/bj-pass-auth-widget.cjs.js",
      "types": "./dist/bj-pass-auth-widget.d.ts"
    },
    "./react": {
      "import": "./dist/bj-pass-auth-widget.esm.js",
      "require": "./dist/bj-pass-auth-widget.cjs.js",
      "types": "./dist/bj-pass-auth-widget.d.ts"
    },
    "./angular": {
      "import": "./dist/bj-pass-auth-widget.esm.js",
      "require": "./dist/bj-pass-auth-widget.cjs.js",
      "types": "./dist/bj-pass-auth-widget.d.ts"
    }
  }
}
```

## 🚨 Changements Breaking

### Version 1.3.0

**Changements :**
- Ajout de nouvelles propriétés dans `BjPassConfig`
- Modification de la structure des exports
- Nouveaux formats de build

**Migration :**
```typescript
// Avant
const config = {
  clientId: 'your-client-id',
  environment: 'test'
};

// Après (ajout des nouvelles propriétés optionnelles)
const config = {
  clientId: 'your-client-id',
  environment: 'test',
  scope: 'openid profile email',  // Nouveau
  pkce: true,                     // Nouveau
  ui: {                           // Nouveau
    language: 'fr',
    primaryColor: '#0066cc'
  }
};
```

### Version 1.2.0

**Changements :**
- Introduction des composants React
- Nouveau hook `useBjPassAuth`

**Migration :**
```typescript
// Avant (utilisation directe)
const widget = new BjPassAuthWidget(config);

// Après (optionnel, utilisation des composants React)
import { BjPassWidget, useBjPassAuth } from 'bj-pass-auth-widget';

// Ou continuer avec l'API directe
const widget = new BjPassAuthWidget(config);
```

## 📚 Exemples de Migration

### Migration d'une application React

**Avant (v1.1.0) :**
```typescript
import React, { useEffect, useRef } from 'react';

function AuthComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Utilisation directe du widget
      widgetRef.current = new (window as any).BjPassAuthWidget({
        clientId: 'your-client-id',
        container: containerRef.current
      });
    }
  }, []);

  return <div ref={containerRef} />;
}
```

**Après (v1.3.3) :**
```typescript
import React from 'react';
import { BjPassWidget, useBjPassAuth } from 'bj-pass-auth-widget';

function AuthComponent() {
  const { isAuthenticated, startAuth, logout } = useBjPassAuth({
    clientId: 'your-client-id',
    environment: 'test',
    scope: 'openid profile email'
  });

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={startAuth}>Se connecter</button>
      ) : (
        <button onClick={logout}>Se déconnecter</button>
      )}
      
      <BjPassWidget
        config={authConfig}
        onAuthSuccess={handleSuccess}
        onAuthError={handleError}
      />
    </div>
  );
}
```

### Migration d'une application Angular

**Avant (v1.1.0) :**
```typescript
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: '<div #authContainer></div>'
})
export class AuthComponent implements OnInit {
  @ViewChild('authContainer', { static: true }) container: ElementRef;

  ngOnInit() {
    // Utilisation directe du widget
    const widget = new (window as any).BjPassAuthWidget({
      clientId: 'your-client-id',
      container: this.container.nativeElement
    });
  }
}
```

**Après (v1.3.3) :**
```typescript
import { Component } from '@angular/core';
import { BjPassWidgetComponent } from 'bj-pass-auth-widget';

@Component({
  selector: 'app-auth',
  template: `
    <bj-pass-widget
      [config]="authConfig"
      (authSuccess)="onAuthSuccess($event)"
      (authError)="onAuthError($event)">
    </bj-pass-widget>
  `
})
export class AuthComponent {
  authConfig = {
    clientId: 'your-client-id',
    environment: 'test',
    scope: 'openid profile email'
  };

  onAuthSuccess(result: any) {
    console.log('Authentification réussie:', result);
  }

  onAuthError(error: string) {
    console.error('Erreur:', error);
  }
}
```

## 🧪 Tests de Migration

### Vérification de la compatibilité

```bash
# 1. Sauvegarder la version actuelle
npm list bj-pass-auth-widget

# 2. Installer la nouvelle version
npm install bj-pass-auth-widget@latest

# 3. Vérifier que l'application fonctionne
npm run build
npm run test

# 4. Tester les nouvelles fonctionnalités
npm run dev
```

### Script de migration automatique

```javascript
// scripts/migrate.js
const fs = require('fs');
const path = require('path');

function migrateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remplacer les anciens imports
  content = content.replace(
    /import.*BjPassAuthWidget.*from.*['"]bj-pass-auth-widget['"]/g,
    `import { BjPassAuthWidget, BjPassWidget, useBjPassAuth } from 'bj-pass-auth-widget'`
  );
  
  // Ajouter les nouveaux types
  if (content.includes('BjPassAuthWidget')) {
    content = content.replace(
      /import.*BjPassAuthWidget/g,
      `import { BjPassAuthWidget } from 'bj-pass-auth-widget'`
    );
  }
  
  fs.writeFileSync(filePath, content);
}

function migrateProject() {
  const srcDir = path.join(process.cwd(), 'src');
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        migrateImports(filePath);
      }
    });
  }
  
  walkDir(srcDir);
  console.log('Migration terminée !');
}

migrateProject();
```

## 🔧 Support et Aide

### En cas de problème

1. **Vérifier la version :**
   ```bash
   npm list bj-pass-auth-widget
   ```

2. **Consulter les logs :**
   ```bash
   npm run build --verbose
   ```

3. **Vérifier la compatibilité :**
   ```bash
   npm run test
   ```

4. **Consulter la documentation :**
   - [Guide de démarrage](../getting-started/installation.md)
   - [Types TypeScript](../api-reference/types.md)
   - [Exemples d'utilisation](../advanced/examples.md)

### Ressources utiles

- **GitHub Issues :** [Signaler un bug](https://github.com/yowedjamal/bj-pass/issues)
- **Documentation :** [Documentation complète](../README.md)
- **Exemples :** [Exemples d'utilisation](../advanced/examples.md)
- **Changelog :** [Historique des versions](https://github.com/yowedjamal/bj-pass/releases)

## 📝 Notes de Version

### Version 1.3.3

**Ajouts :**
- Support complet pour Angular
- Wrappers pour composants Angular
- Service Angular injectable
- Directive Angular personnalisable
- Module Angular avec configuration automatique

**Améliorations :**
- Documentation complète pour Angular
- Exemples d'utilisation Angular
- Support des composants standalone Angular 15+
- Gestion des événements Angular

**Corrections :**
- Résolution des conflits de types
- Amélioration de la compatibilité TypeScript
- Optimisation des builds

### Version 1.3.0

**Ajouts :**
- Support complet pour React et Next.js
- Composant React `BjPassWidget`
- Hook React `useBjPassAuth`
- Support TypeScript complet
- Builds multiples (UMD, ESM, CommonJS)

**Améliorations :**
- Configuration Webpack optimisée
- Support des exports conditionnels
- Gestion des dépendances peer
- Types et interfaces complets

### Version 1.2.0

**Ajouts :**
- Support de base pour React
- Hook `useBjPassAuth`
- Composant `BjPassWidget`
- Documentation React

### Version 1.1.0

**Ajouts :**
- Support TypeScript de base
- Types de base pour la configuration
- Amélioration de la documentation

### Version 1.0.0

**Fonctionnalités initiales :**
- Widget d'authentification de base
- Support OAuth 2.0/OpenID Connect
- Support PKCE
- Gestion des erreurs
- Interface utilisateur personnalisable
