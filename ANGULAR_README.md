# BjPass Authentication Widget - Support Angular

Ce package fournit un support complet pour Angular avec des composants, directives et services prêts à l'emploi.

## 🚀 Installation

```bash
npm install bj-pass-auth-widget
```

## 📦 Ce qui est inclus

- **BjPassAuthService** : Service Angular pour gérer l'authentification
- **BjPassWidgetComponent** : Composant Angular avec interface complète
- **BjPassAuthDirective** : Directive pour intégration personnalisée
- **BjPassAuthModule** : Module Angular avec configuration automatique

## 🔧 Configuration rapide

### 1. Import du module

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BjPassAuthModule } from 'bj-pass-auth-widget';

@NgModule({
  imports: [
    BrowserModule,
    BjPassAuthModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2. Utilisation dans un composant

```typescript
import { Component } from '@angular/core';
import { BjPassAuthService } from 'bj-pass-auth-widget';

@Component({
  selector: 'app-login',
  template: '<button (click)="login()">Se connecter</button>'
})
export class LoginComponent {
  constructor(private authService: BjPassAuthService) {}

  async login() {
    await this.authService.initialize({
      clientId: 'your-client-id',
      redirectUri: 'http://localhost:4200/callback'
    });
    await this.authService.startAuth();
  }
}
```

## 🎯 Exemples d'utilisation

### Composant Widget complet

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
    redirectUri: 'http://localhost:4200/callback',
    environment: 'test'
  };

  onAuthSuccess(result: any) {
    console.log('Authentification réussie:', result);
  }

  onAuthError(error: string) {
    console.error('Erreur:', error);
  }
}
```

### Directive personnalisée

```typescript
import { Component } from '@angular/core';
import { BjPassAuthDirective } from 'bj-pass-auth-widget';

@Component({
  selector: 'app-custom-auth',
  template: `
    <div 
      bjPassAuth
      [bjPassConfig]="config"
      (authSuccess)="onSuccess($event)">
      Zone d'authentification personnalisée
    </div>
  `
})
export class CustomAuthComponent {
  config = {
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:4200/callback'
  };

  onSuccess(result: any) {
    console.log('Succès:', result);
  }
}
```

### Service avec contrôle total

```typescript
import { Component, OnInit } from '@angular/core';
import { BjPassAuthService } from 'bj-pass-auth-widget';

@Component({
  selector: 'app-auth-service',
  template: `
    <div>
      <p>État: {{ status }}</p>
      <button (click)="startAuth()" [disabled]="isLoading">
        {{ isLoading ? 'Chargement...' : 'Se connecter' }}
      </button>
    </div>
  `
})
export class AuthServiceComponent implements OnInit {
  status = 'Non initialisé';
  isLoading = false;

  constructor(private authService: BjPassAuthService) {}

  ngOnInit() {
    // S'abonner aux événements
    this.authService.authSuccess$.subscribe(result => {
      this.status = 'Authentifié';
      console.log('Utilisateur connecté:', result.user);
    });

    this.authService.authError$.subscribe(error => {
      this.status = `Erreur: ${error}`;
    });
  }

  async startAuth() {
    this.isLoading = true;
    try {
      await this.authService.initialize({
        clientId: 'your-client-id',
        redirectUri: 'http://localhost:4200/callback'
      });
      await this.authService.startAuth();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
```

## ⚙️ Configuration

### Options principales

```typescript
const config = {
  clientId: 'your-client-id',           // Requis
  redirectUri: 'http://localhost:4200/callback', // Requis
  environment: 'test',                   // 'test' ou 'production'
  scope: 'openid profile email',        // Scopes OAuth
  pkce: true,                           // PKCE (recommandé)
  ui: {
    language: 'fr',                     // Langue de l'interface
    primaryColor: '#0066cc',            // Couleur principale
    theme: 'default'                    // Thème
  }
};
```

### Variables d'environnement

```typescript
// environment.ts
export const environment = {
  production: false,
  bjpass: {
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:4200/callback',
    environment: 'test'
  }
};
```

## 🔄 Gestion des événements

Le service expose plusieurs observables pour gérer les événements :

```typescript
// Authentification réussie
this.authService.authSuccess$.subscribe(result => {
  console.log('Utilisateur connecté:', result.user);
  console.log('Tokens:', result.tokens);
});

// Erreur d'authentification
this.authService.authError$.subscribe(error => {
  console.error('Erreur:', error);
});

// Informations utilisateur mises à jour
this.authService.userInfo$.subscribe(user => {
  console.log('Infos utilisateur:', user);
});

// Déconnexion
this.authService.logout$.subscribe(() => {
  console.log('Utilisateur déconnecté');
});

// Tokens rafraîchis
this.authService.tokensRefresh$.subscribe(tokens => {
  console.log('Nouveaux tokens:', tokens);
});
```

## 🛡️ Protection des routes

### Guard d'authentification

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BjPassAuthService } from 'bj-pass-auth-widget';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: BjPassAuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
```

### Intercepteur HTTP

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { BjPassAuthService } from 'bj-pass-auth-widget';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: BjPassAuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const tokens = this.authService.getTokens();
    
    if (tokens?.accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      });
    }
    
    return next.handle(request);
  }
}
```

## 🧪 Tests

### Test d'un composant

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BjPassAuthModule } from 'bj-pass-auth-widget';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BjPassAuthModule],
      declarations: [LoginComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 🚨 Dépannage

### Erreurs courantes

1. **"BjPassAuthWidget not available"**
   - Assurez-vous que le script est chargé avant l'utilisation
   - Vérifiez que le package est correctement installé

2. **Erreurs de compilation TypeScript**
   - Vérifiez que les types sont correctement importés
   - Assurez-vous que `@angular/core` est disponible

3. **Problèmes de CORS**
   - Configurez correctement les origines autorisées
   - Vérifiez la configuration de votre serveur OAuth

### Support

Pour plus d'informations, consultez :
- [Documentation complète](ANGULAR_USAGE.md)
- [Exemples d'utilisation](examples/angular-example.ts)
- [Guide de déploiement](DEPLOYMENT.md)

## 📝 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.
