// Exemple d'utilisation Angular avec BjPass Authentication Widget
// Ce fichier montre comment utiliser les composants Angular du package

import { BjPassAuthService, BjPassWidgetComponent, BjPassAuthDirective, BjPassAuthModule } from 'bj-pass-auth-widget';

// =======================
// Configuration d'authentification
// =======================
const authConfig = {
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:4200/auth/callback',
  environment: 'test',
  scope: 'openid profile email',
  pkce: true,
  ui: {
    language: 'fr',
    primaryColor: '#0066cc',
    theme: 'default',
    showEnvSelector: true
  },
  backendUrl: 'https://your-backend.com',
  useBackend: true,
  popupMode: true,
  autoClosePopup: true
};

// =======================
// Exemple de composant Angular
// =======================
export class AuthExampleComponent {
  config = authConfig;
  isAuthenticated = false;
  user: any = null;
  tokens: any = null;
  isLoading = false;
  error: string | null = null;

  constructor(private authService: BjPassAuthService) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.authService.initialize(this.config);
      this.isAuthenticated = this.authService.isAuthenticated();
      
      if (this.isAuthenticated) {
        this.tokens = this.authService.getTokens();
        this.user = await this.authService.getUserInfo();
      }
    } catch (err) {
      console.error('Erreur d\'initialisation:', err);
    }
  }

  async startAuth(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    
    try {
      const result = await this.authService.startAuth();
      console.log('Authentification réussie:', result);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Échec de l\'authentification';
    } finally {
      this.isLoading = false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  }

  async getUserInfo(): Promise<void> {
    try {
      this.user = await this.authService.getUserInfo();
    } catch (err) {
      console.error('Erreur lors de la récupération des informations utilisateur:', err);
    }
  }

  async refreshTokens(): Promise<void> {
    try {
      const newTokens = await this.authService.refreshTokens();
      if (newTokens) {
        this.tokens = newTokens;
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des tokens:', err);
    }
  }
}

// =======================
// Exemple d'utilisation avec directive
// =======================
export class AuthDirectiveExampleComponent {
  config = authConfig;

  onAuthSuccess(result: any): void {
    console.log('Authentification réussie via directive:', result);
  }

  onAuthError(error: string): void {
    console.error('Erreur d\'authentification via directive:', error);
  }

  onUserInfo(userInfo: any): void {
    console.log('Informations utilisateur via directive:', userInfo);
  }

  onLogout(): void {
    console.log('Déconnexion via directive');
  }

  onTokensRefresh(tokens: any): void {
    console.log('Tokens rafraîchis via directive:', tokens);
  }
}

// =======================
// Exemple d'utilisation du service
// =======================
export class AuthServiceExampleComponent {
  serviceStatus = 'Non initialisé';
  isServiceAuthenticated = false;
  serviceUser: any = null;

  constructor(private authService: BjPassAuthService) {}

  ngOnInit(): void {
    // S'abonner aux événements du service
    this.authService.authSuccess$.subscribe(result => {
      this.serviceStatus = 'Authentifié';
      this.isServiceAuthenticated = true;
      if (result.user) {
        this.serviceUser = result.user;
      }
    });

    this.authService.authError$.subscribe(error => {
      this.serviceStatus = `Erreur: ${error}`;
      this.isServiceAuthenticated = false;
    });

    this.authService.logout$.subscribe(() => {
      this.serviceStatus = 'Déconnecté';
      this.isServiceAuthenticated = false;
      this.serviceUser = null;
    });

    this.authService.userInfo$.subscribe(user => {
      this.serviceUser = user;
    });
  }

  async initializeService(): Promise<void> {
    try {
      await this.authService.initialize(this.config);
      this.serviceStatus = 'Initialisé';
    } catch (error) {
      this.serviceStatus = `Erreur d'initialisation: ${error}`;
    }
  }

  async startAuthService(): Promise<void> {
    try {
      const result = await this.authService.startAuth();
      console.log('Authentification via service:', result);
    } catch (error) {
      console.error('Erreur d\'authentification via service:', error);
    }
  }

  async logoutService(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Erreur de déconnexion via service:', error);
    }
  }
}

// =======================
// Instructions d'utilisation
// =======================
/*
Pour utiliser ce package dans Angular :

1. Installation :
   npm install bj-pass-auth-widget

2. Import du module dans app.module.ts :
   import { BjPassAuthModule } from 'bj-pass-auth-widget';
   
   @NgModule({
     imports: [
       BjPassAuthModule.forRoot()
     ]
   })

3. Utilisation dans un composant :
   import { BjPassAuthService } from 'bj-pass-auth-widget';
   
   constructor(private authService: BjPassAuthService) {}

4. Configuration :
   - Remplacez 'your-client-id' par votre vrai client ID
   - Configurez l'URL de redirection
   - Ajustez les paramètres selon vos besoins

5. Composants disponibles :
   - BjPassWidgetComponent : Composant complet avec interface
   - BjPassAuthDirective : Directive pour intégration personnalisée
   - BjPassAuthService : Service pour contrôle programmatique

6. Événements disponibles :
   - authSuccess : Authentification réussie
   - authError : Erreur d'authentification
   - userInfo : Informations utilisateur mises à jour
   - logout : Déconnexion effectuée
   - tokensRefresh : Tokens rafraîchis
*/
