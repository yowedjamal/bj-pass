# Utilisation avec Angular

Ce guide vous explique comment utiliser le widget d'authentification BjPass dans vos projets Angular.

## 🚀 Installation

```bash
npm install bj-pass-auth-widget
```

## 📦 Ce qui est inclus

- **BjPassAuthService** : Service Angular injectable pour gérer l'authentification
- **BjPassWidgetComponent** : Composant Angular avec interface complète
- **BjPassAuthDirective** : Directive pour intégration personnalisée
- **BjPassAuthModule** : Module Angular avec configuration automatique
- **Types TypeScript** : Interfaces et types complets

## 🔧 Configuration rapide

### 1. Import du module

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BjPassAuthModule } from 'bj-pass-auth-widget';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BjPassAuthModule.forRoot() // Import du module BjPass
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2. Pour Angular 15+ (Standalone Components)

```typescript
import { Component } from '@angular/core';
import { BjPassWidgetComponent } from 'bj-pass-auth-widget';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [BjPassWidgetComponent],
  template: `
    <bj-pass-widget [config]="authConfig"></bj-pass-widget>
  `
})
export class AuthComponent {
  authConfig = {
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:4200/auth/callback',
    environment: 'test'
  };
}
```

## 🎯 Utilisation de base

### Composant Widget

Le composant `<bj-pass-widget>` est la façon la plus simple d'intégrer l'authentification :

```typescript
import { Component } from '@angular/core';
import { BjPassConfig, AuthResult, UserInfo, TokenInfo } from 'bj-pass-auth-widget';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Connexion</h2>
      
      <bj-pass-widget
        [config]="authConfig"
        (authSuccess)="onAuthSuccess($event)"
        (authError)="onAuthError($event)"
        (userInfo)="onUserInfo($event)"
        (logout)="onLogout()"
        (tokensRefresh)="onTokensRefresh($event)"
        containerClass="custom-widget"
        [containerStyle]="widgetStyles"
        loadingText="Initialisation..."
        processingText="Authentification en cours...">
      </bj-pass-widget>
      
      <div *ngIf="isAuthenticated" class="user-info">
        <h3>Bienvenue, {{ user?.name }}!</h3>
        <button (click)="logout()">Se déconnecter</button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .custom-widget {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .user-info {
      margin-top: 20px;
      padding: 15px;
      background-color: #f0f8ff;
      border-radius: 4px;
    }
  `]
})
export class LoginComponent {
  authConfig: BjPassConfig = {
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:4200/auth/callback',
    environment: 'test',
    scope: 'openid profile email',
    ui: {
      language: 'fr',
      primaryColor: '#0066cc',
      theme: 'default'
    }
  };

  isAuthenticated = false;
  user: UserInfo | null = null;
  widgetStyles = {
    backgroundColor: '#fafafa',
    borderRadius: '8px'
  };

  onAuthSuccess(result: AuthResult): void {
    console.log('Authentification réussie:', result);
    this.isAuthenticated = true;
    
    if (result.user) {
      this.user = result.user;
    }
    
    if (result.tokens) {
      // Stocker les tokens
      localStorage.setItem('access_token', result.tokens.accessToken);
      if (result.tokens.refreshToken) {
        localStorage.setItem('refresh_token', result.tokens.refreshToken);
      }
    }
  }

  onAuthError(error: string): void {
    console.error('Erreur d\'authentification:', error);
    // Gérer l'erreur (afficher un message, rediriger, etc.)
  }

  onUserInfo(userInfo: UserInfo): void {
    console.log('Informations utilisateur:', userInfo);
    this.user = userInfo;
  }

  onLogout(): void {
    console.log('Déconnexion effectuée');
    this.isAuthenticated = false;
    this.user = null;
    // Nettoyer le localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  onTokensRefresh(tokens: TokenInfo): void {
    console.log('Tokens rafraîchis:', tokens);
    // Mettre à jour le localStorage
    localStorage.setItem('access_token', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refresh_token', tokens.refreshToken);
    }
  }

  logout(): void {
    // Cette méthode sera appelée depuis le composant
    // Le widget gère automatiquement la déconnexion
  }
}
```

## 🔧 Utilisation avec le Service

Le service `BjPassAuthService` vous donne un contrôle total sur l'authentification :

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BjPassAuthService, BjPassConfig, AuthResult, UserInfo, TokenInfo } from 'bj-pass-auth-widget';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-service',
  template: `
    <div class="auth-container">
      <h2>Authentification via Service</h2>
      
      <div class="status">
        <p><strong>État:</strong> {{ status }}</p>
        <p><strong>Connecté:</strong> {{ isAuthenticated ? 'Oui' : 'Non' }}</p>
      </div>
      
      <div class="actions">
        <button 
          *ngIf="!isAuthenticated" 
          (click)="startAuth()" 
          [disabled]="isLoading"
          class="btn btn-primary">
          {{ isLoading ? 'Chargement...' : 'Se connecter' }}
        </button>
        
        <button 
          *ngIf="isAuthenticated" 
          (click)="logout()" 
          class="btn btn-danger">
          Se déconnecter
        </button>
        
        <button 
          *ngIf="isAuthenticated" 
          (click)="getUserInfo()" 
          class="btn btn-info">
          Infos utilisateur
        </button>
        
        <button 
          *ngIf="isAuthenticated" 
          (click)="refreshTokens()" 
          class="btn btn-warning">
          Rafraîchir tokens
        </button>
      </div>
      
      <div *ngIf="user" class="user-details">
        <h3>Utilisateur connecté</h3>
        <p><strong>Nom:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>ID:</strong> {{ user.sub }}</p>
      </div>
      
      <div *ngIf="tokens" class="token-details">
        <h3>Tokens</h3>
        <p><strong>Type:</strong> {{ tokens.tokenType || 'Bearer' }}</p>
        <p><strong>Portée:</strong> {{ tokens.scope || 'openid profile' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .status {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    .actions {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-primary { background-color: #007bff; color: white; }
    .btn-danger { background-color: #dc3545; color: white; }
    .btn-info { background-color: #17a2b8; color: white; }
    .btn-warning { background-color: #ffc107; color: black; }
    
    .user-details, .token-details {
      background-color: #e8f5e8;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
  `]
})
export class AuthServiceComponent implements OnInit, OnDestroy {
  authConfig: BjPassConfig = {
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:4200/auth/callback',
    environment: 'test',
    scope: 'openid profile email'
  };

  status = 'Non initialisé';
  isAuthenticated = false;
  isLoading = false;
  user: UserInfo | null = null;
  tokens: TokenInfo | null = null;

  private subscriptions: Subscription[] = [];

  constructor(private authService: BjPassAuthService) {}

  ngOnInit(): void {
    this.initializeAuth();
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private async initializeAuth(): Promise<void> {
    try {
      await this.authService.initialize(this.authConfig);
      this.status = 'Initialisé';
      
      // Vérifier l'état d'authentification
      this.isAuthenticated = this.authService.isAuthenticated();
      if (this.isAuthenticated) {
        this.tokens = this.authService.getTokens();
        this.user = await this.authService.getUserInfo();
      }
    } catch (error) {
      this.status = `Erreur d'initialisation: ${error}`;
    }
  }

  private setupEventListeners(): void {
    // S'abonner aux événements du service
    this.subscriptions.push(
      this.authService.authSuccess$.subscribe(result => {
        this.status = 'Authentifié';
        this.isAuthenticated = true;
        this.isLoading = false;
        
        if (result.user) {
          this.user = result.user;
        }
        
        if (result.tokens) {
          this.tokens = result.tokens;
          this.storeTokens(result.tokens);
        }
      }),

      this.authService.authError$.subscribe(error => {
        this.status = `Erreur: ${error}`;
        this.isAuthenticated = false;
        this.isLoading = false;
      }),

      this.authService.userInfo$.subscribe(user => {
        this.user = user;
      }),

      this.authService.logout$.subscribe(() => {
        this.status = 'Déconnecté';
        this.isAuthenticated = false;
        this.user = null;
        this.tokens = null;
        this.clearTokens();
      }),

      this.authService.tokensRefresh$.subscribe(tokens => {
        this.tokens = tokens;
        this.storeTokens(tokens);
      })
    );
  }

  async startAuth(): Promise<void> {
    this.isLoading = true;
    this.status = 'Authentification en cours...';
    
    try {
      await this.authService.startAuth();
    } catch (error) {
      this.status = `Erreur d'authentification: ${error}`;
      this.isLoading = false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  async getUserInfo(): Promise<void> {
    try {
      this.user = await this.authService.getUserInfo();
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
    }
  }

  async refreshTokens(): Promise<void> {
    try {
      const newTokens = await this.authService.refreshTokens();
      if (newTokens) {
        this.tokens = newTokens;
        this.storeTokens(newTokens);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des tokens:', error);
    }
  }

  private storeTokens(tokens: TokenInfo): void {
    localStorage.setItem('access_token', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refresh_token', tokens.refreshToken);
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
```

## 🎯 Utilisation avec la Directive

La directive `bjPassAuth` vous permet d'intégrer l'authentification dans n'importe quel élément :

```typescript
import { Component } from '@angular/core';
import { BjPassConfig, AuthResult, UserInfo, TokenInfo } from 'bj-pass-auth-widget';

@Component({
  selector: 'app-auth-directive',
  template: `
    <div class="directive-example">
      <h2>Authentification via Directive</h2>
      
      <div 
        bjPassAuth
        [bjPassConfig]="authConfig"
        [bjPassAutoInit]="true"
        (authSuccess)="onAuthSuccess($event)"
        (authError)="onAuthError($event)"
        (userInfo)="onUserInfo($event)"
        (logout)="onLogout()"
        (tokensRefresh)="onTokensRefresh($event)"
        class="auth-container">
        
        <p>Le widget d'authentification sera rendu dans cette div</p>
      </div>
      
      <div class="actions">
        <button (click)="startAuth()" class="btn btn-primary">
          Démarrer l'authentification
        </button>
        <button (click)="logout()" class="btn btn-danger">
          Déconnexion
        </button>
      </div>
    </div>
  `,
  styles: [`
    .directive-example {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .auth-container {
      min-height: 200px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 20px;
      margin: 20px 0;
      background-color: #f9f9f9;
    }
    
    .actions {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-primary { background-color: #007bff; color: white; }
    .btn-danger { background-color: #dc3545; color: white; }
  `]
})
export class AuthDirectiveComponent {
  authConfig: BjPassConfig = {
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:4200/auth/callback',
    environment: 'test',
    scope: 'openid profile email'
  };

  onAuthSuccess(result: AuthResult): void {
    console.log('Authentification réussie via directive:', result);
  }

  onAuthError(error: string): void {
    console.error('Erreur d\'authentification via directive:', error);
  }

  onUserInfo(userInfo: UserInfo): void {
    console.log('Informations utilisateur via directive:', userInfo);
  }

  onLogout(): void {
    console.log('Déconnexion via directive');
  }

  onTokensRefresh(tokens: TokenInfo): void {
    console.log('Tokens rafraîchis via directive:', tokens);
  }

  startAuth(): void {
    // Cette méthode serait appelée via une référence à la directive
    console.log('Démarrage de l\'authentification');
  }

  logout(): void {
    // Cette méthode serait appelée via une référence à la directive
    console.log('Déconnexion');
  }
}
```

## ⚙️ Configuration avancée

### Variables d'environnement

Créez un fichier `environment.ts` :

```typescript
export const environment = {
  production: false,
  bjpass: {
    clientId: 'your-client-id',
    environment: 'test',
    redirectUri: 'http://localhost:4200/auth/callback',
    scope: 'openid profile email',
    ui: {
      language: 'fr',
      primaryColor: '#0066cc',
      theme: 'default'
    }
  }
};
```

### Service centralisé

Créez un service pour gérer la configuration :

```typescript
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BjPassConfig } from 'bj-pass-auth-widget';

@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {
  getConfig(): BjPassConfig {
    return {
      clientId: environment.bjpass.clientId,
      redirectUri: environment.bjpass.redirectUri,
      environment: environment.bjpass.environment as 'test' | 'production',
      scope: environment.bjpass.scope,
      ui: environment.bjpass.ui
    };
  }
}
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

### Intercepteur HTTP pour les tokens

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BjPassAuthService } from 'bj-pass-auth-widget';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: BjPassAuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokens = this.authService.getTokens();
    
    if (tokens && tokens.accessToken) {
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

## 🧪 Tests

### Test du composant

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

  it('should handle auth success', () => {
    const mockResult = {
      success: true,
      user: { name: 'Test User', email: 'test@example.com' },
      tokens: { accessToken: 'test-token' }
    };

    component.onAuthSuccess(mockResult);
    expect(component.isAuthenticated).toBe(true);
    expect(component.user).toEqual(mockResult.user);
  });
});
```

### Test du service

```typescript
import { TestBed } from '@angular/core/testing';
import { BjPassAuthService } from 'bj-pass-auth-widget';

describe('BjPassAuthService', () => {
  let service: BjPassAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BjPassAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getTokens()).toBe(null);
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

4. **Erreurs de zone Angular**
   - Utilisez `ngZone.run()` pour les callbacks externes
   - Assurez-vous que les événements sont émis dans la zone Angular

### Support

Pour plus d'informations, consultez :
- [Documentation complète](../README.md)
- [Exemples d'utilisation](../../examples/angular-example.ts)
- [Guide de déploiement](../DEPLOYMENT.md)
