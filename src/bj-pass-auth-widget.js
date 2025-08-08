/**
 * bj-pass Authentication Widget
 * Widget d'authentification OAuth 2.0/OpenID Connect moderne et sécurisé
 * @version 2.0.0
 * @author yowedjamal
 * @license MIT
 */

class BjPassAuthWidget {
  constructor(config = {}) {
    this.config = this.mergeConfig(config);
    this.state = {
      isAuthenticated: false,
      tokens: null,
      authWindow: null,
      codeVerifier: null,
      codeChallenge: null
    };
    
    this.init();
  }

  /**
   * Fusionne la configuration par défaut avec celle fournie
   */
  mergeConfig(userConfig) {
    const defaultConfig = {
      clientId: '',
      environment: 'test',
      authServer: 'main-as',
      scope: 'openid profile',
      redirectUri: window.location.origin + '/auth/callback',
      pkce: true,
      verifyAccessToken: false,
      beUrl: '',
      beBearer: '',
      ui: {
        showEnvSelector: true,
        container: '#bj-pass-auth-container',
        language: 'fr',
        primaryColor: '#0066cc',
        theme: 'default'
      },
      onSuccess: null,
      onError: null,
      debug: false,
      analytics: false,
      maxRetries: 0,
      retryDelay: 1000
    };

    return this.deepMerge(defaultConfig, userConfig);
  }

  /**
   * Fusion profonde d'objets
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * Initialise le widget
   */
  init() {
    this.log('Initialisation du widget bj-pass...', this.config);
    
    // Vérifier la configuration
    if (!this.config.clientId) {
      this.handleError(new Error('clientId est requis'));
      return;
    }

    // Générer PKCE si activé
    if (this.config.pkce) {
      this.generatePKCE();
    }

    // Créer l'interface utilisateur
    this.createUI();
    
    this.log('Widget initialisé avec succès');
  }

  /**
   * Génère les paramètres PKCE
   */
  generatePKCE() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.state.codeVerifier = this.base64URLEncode(array);
    
    // Générer le code challenge
    const encoder = new TextEncoder();
    const data = encoder.encode(this.state.codeVerifier);
    
    crypto.subtle.digest('SHA-256', data).then(hash => {
      this.state.codeChallenge = this.base64URLEncode(new Uint8Array(hash));
    });
  }

  /**
   * Encode en base64 URL-safe
   */
  base64URLEncode(buffer) {
    return btoa(String.fromCharCode(...buffer))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Crée l'interface utilisateur
   */
  createUI() {
    const container = document.querySelector(this.config.ui.container);
    if (!container) {
      this.log('Container non trouvé, création automatique...');
      this.createContainer();
    }

    this.renderAuthButton();
  }

  /**
   * Crée le container s'il n'existe pas
   */
  createContainer() {
    const container = document.createElement('div');
    container.id = 'bj-pass-auth-container';
    container.style.cssText = `
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.body.appendChild(container);
  }

  /**
   * Affiche le bouton d'authentification
   */
  renderAuthButton() {
    const container = document.querySelector(this.config.ui.container);
    if (!container) return;

    const button = document.createElement('button');
    button.id = 'bj-pass-auth-button';
    button.textContent = this.config.ui.language === 'fr' ? 'Se connecter' : 'Sign in';
    button.style.cssText = `
      background-color: ${this.config.ui.primaryColor};
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

    button.addEventListener('click', () => this.startAuthFlow());
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = this.adjustColor(this.config.ui.primaryColor, -20);
    });
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = this.config.ui.primaryColor;
    });

    container.innerHTML = '';
    container.appendChild(button);
  }

  /**
   * Ajuste la couleur (plus claire ou plus foncée)
   */
  adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  /**
   * Démarre le flux d'authentification
   */
  startAuthFlow() {
    this.log('Démarrage du flux d\'authentification...');
    
    try {
      const authUrl = this.buildAuthUrl();
      this.openAuthWindow(authUrl);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Construit l'URL d'authentification
   */
  buildAuthUrl() {
    const baseUrl = this.getAuthServerUrl();
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      state: this.generateState()
    });

    if (this.config.pkce && this.state.codeChallenge) {
      params.append('code_challenge', this.state.codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return `${baseUrl}/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Obtient l'URL du serveur d'authentification
   */
  getAuthServerUrl() {
    const servers = {
      'main-as': 'https://auth.bj-pass.com',
      'test-as': 'https://test-auth.bj-pass.com'
    };
    
    return servers[this.config.authServer] || servers['main-as'];
  }

  /**
   * Génère un état aléatoire pour la sécurité
   */
  generateState() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }

  /**
   * Ouvre la fenêtre d'authentification
   */
  openAuthWindow(url) {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    this.state.authWindow = window.open(
      url,
      'bj-pass-auth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!this.state.authWindow) {
      this.handleError(new Error('Popup bloquée. Veuillez autoriser les popups pour ce site.'));
      return;
    }

    // Écouter la fermeture de la fenêtre
    const checkClosed = setInterval(() => {
      if (this.state.authWindow.closed) {
        clearInterval(checkClosed);
        this.log('Fenêtre d\'authentification fermée');
      }
    }, 1000);
  }

  /**
   * Traite le callback d'authentification
   */
  handleCallback(code, state) {
    this.log('Callback reçu, échange du code...');
    
    if (this.config.beUrl) {
      this.exchangeCodeWithBackend(code);
    } else {
      this.exchangeCodeDirectly(code);
    }
  }

  /**
   * Échange le code via le backend
   */
  async exchangeCodeWithBackend(code) {
    try {
      const response = await fetch(this.config.beUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.config.beBearer
        },
        body: JSON.stringify({
          code,
          code_verifier: this.state.codeVerifier,
          redirect_uri: this.config.redirectUri
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur backend: ${response.status}`);
      }

      const tokens = await response.json();
      this.handleSuccess(tokens);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Échange le code directement (pour les tests)
   */
  async exchangeCodeDirectly(code) {
    try {
      const tokenUrl = this.getAuthServerUrl() + '/oauth2/token';
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        code,
        redirect_uri: this.config.redirectUri
      });

      if (this.state.codeVerifier) {
        params.append('code_verifier', this.state.codeVerifier);
      }

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        throw new Error(`Erreur token: ${response.status}`);
      }

      const tokens = await response.json();
      this.handleSuccess(tokens);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Traite le succès de l'authentification
   */
  handleSuccess(tokens) {
    this.log('Authentification réussie !', tokens);
    
    this.state.isAuthenticated = true;
    this.state.tokens = tokens;

    // Fermer la fenêtre d'authentification
    if (this.state.authWindow) {
      this.state.authWindow.close();
    }

    // Appeler le callback de succès
    if (typeof this.config.onSuccess === 'function') {
      this.config.onSuccess(tokens);
    }

    // Mettre à jour l'interface
    this.updateUI();
  }

  /**
   * Traite les erreurs
   */
  handleError(error) {
    this.log('Erreur:', error);
    
    // Fermer la fenêtre d'authentification
    if (this.state.authWindow) {
      this.state.authWindow.close();
    }

    // Appeler le callback d'erreur
    if (typeof this.config.onError === 'function') {
      this.config.onError(error);
    }
  }

  /**
   * Met à jour l'interface utilisateur
   */
  updateUI() {
    const button = document.querySelector('#bj-pass-auth-button');
    if (button) {
      button.textContent = this.config.ui.language === 'fr' ? 'Connecté ✓' : 'Connected ✓';
      button.style.backgroundColor = '#28a745';
      button.disabled = true;
    }
  }

  /**
   * Log avec gestion du mode debug
   */
  log(...args) {
    if (this.config.debug) {
      console.log('[bj-pass]', ...args);
    }
  }

  /**
   * Détruit le widget
   */
  destroy() {
    this.log('Destruction du widget...');
    
    if (this.state.authWindow) {
      this.state.authWindow.close();
    }
    
    const container = document.querySelector(this.config.ui.container);
    if (container) {
      container.innerHTML = '';
    }
    
    this.state = {
      isAuthenticated: false,
      tokens: null,
      authWindow: null,
      codeVerifier: null,
      codeChallenge: null
    };
  }

  /**
   * Obtient la configuration actuelle
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Met à jour la configuration
   */
  updateConfig(newConfig) {
    this.config = this.mergeConfig(newConfig);
    this.log('Configuration mise à jour:', this.config);
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return this.state.isAuthenticated;
  }

  /**
   * Obtient les tokens
   */
  getTokens() {
    return this.state.tokens;
  }
}

// Auto-initialisation si l'attribut data-bj-pass-widget est présent
document.addEventListener('DOMContentLoaded', () => {
  const autoInitElements = document.querySelectorAll('[data-bj-pass-widget]');
  
  autoInitElements.forEach(element => {
    const config = JSON.parse(element.getAttribute('data-bj-pass-config') || '{}');
    config.ui = config.ui || {};
    config.ui.container = '#' + element.id;
    
    new BjPassAuthWidget(config);
  });
});

// Export pour différents environnements
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BjPassAuthWidget;
} else if (typeof define === 'function' && define.amd) {
  define(() => BjPassAuthWidget);
} else {
  window.BjPassAuthWidget = BjPassAuthWidget;
} 