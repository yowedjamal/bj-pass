class TrustedXAuthWidget {
  /**
   * Constructeur du widget
   * @param {Object} config - Configuration du widget
   */
  constructor(config = {}) {
    this.environments = {
      test: {
        baseUrl: "https://test-tx-pki.gouv.bj",
        defaultAuthServer: "main-as",
      },
      production: {
        baseUrl: "https://tx-pki.gouv.bj",
        defaultAuthServer: "main-as",
      },
    };
    // Configuration par défaut
    this.config = {
      environment: "test",
      clientId: "",
      authServer: "",
      scope: "openid profile",
      redirectUri: window.location.origin + "/examples/redirect.html",
      pkce: true,
      verifyAccessToken: false,
      tokenVerificationScopes: ["urn:safelayer:eidas:oauth:token:introspect"],
      baseUrl: "https://trustedx.example.com",
      beUrl: "http://localhost:8000/api/v1/code-exchange",
      beBearer:
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxNVRPaGhicmZ4V3p0aTJDVUhwVjVPUEFaZUNtYnFfTHlNa19QZnlLR2VjIn0.eyJleHAiOjE3NTQ1ODg3MjQsImlhdCI6MTc1NDU4NjkyNCwianRpIjoiMDZhYWUwNzQtM2Y1OS00NTI0LWI3YWYtMTA4YzRiZWIyYWYwIiwiaXNzIjoiaHR0cHM6Ly9sb2NhbC1rYy5xY2RpZ2l0YWxodWIuY29tL3JlYWxtcy9Db2xsYWJvbmUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYzJmMTIyMmItNGYxNi00NjkzLWFiODItM2U5NDY4ZGExZmViIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibGUtY2xpZW50LTY4OTMxNDU2NzBmMTkiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbInRlc3Q0LmxvY2FsIiwiaHR0cDovL2xvY2FsaG9zdDoqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtY29sbGFib25lIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9mZmxpbmVfYWNjZXNzIGVtYWlsIHByb2ZpbGUgb3JnYW5pemF0aW9uIiwiY2xpZW50SG9zdCI6IjgxLjkxLjIzMC44NiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtbGUtY2xpZW50LTY4OTMxNDU2NzBmMTkiLCJjbGllbnRBZGRyZXNzIjoiODEuOTEuMjMwLjg2IiwiZW1haWwiOiJzZXJ2aWNlLWFjY291bnQtbGUtY2xpZW50LTY4OTMxNDU2NzBmMTlAbG9jYWwtY29uZS5xY2RpZ2l0YWxodWIuY29tIiwiY2xpZW50X2lkIjoibGUtY2xpZW50LTY4OTMxNDU2NzBmMTkifQ.YC3zAk4JhXr1Tgo7P6eKElZ2fxSaMutXRegeiT3eSSOI1SlLLGIqc_vB0VQ0ro3eY-RujIYfT-f8O9THpiTA6JgXuvyfq729XU91ItX3Oz-UUbQpG39kPvw9vfgYMUImqoKhXyilsb5UUgHNrRiVL8eGcponXsZkJYsEjuWlouZtpNlVF4pKobyYlyGL5GnQbKG8fMwHg2JnhWNrBuRd5U5iJCloa61MYAlrYVPWRtm_luWwL_9RWFZ482QZ3-Tde693a2-QNpIAY09lujG_i9nW5AkXqLzfw8NyDZb7MeVCEZJWaSckO41Acl_BQYgGNHp-m0fOpEu0vj_Nz-A3sQ",
      ui: {
        showEnvSelector: true,
        container: "#trustedx-auth-container",
        language: "fr",
        primaryColor: "#0066cc",
      },
      ...config,
    };

    // Éléments DOM
    this.elements = {};
    this.state = {
      isLoading: false,
      error: null,
    };

    this.applyEnvironmentConfig();

    // Initialisation
    this.init();

    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type === "trustedx-auth-response") {
          this.handlePopupResponse(event.data.query);
        }
      },
      false
    );
  }

  /**
   * Initialisation du widget
   */
  init() {
    this.createContainer();
    this.render();
    this.setupEventListeners();
  }

  applyEnvironmentConfig() {
    const env = this.config.environment || "test";
    const envConfig = this.environments[env] || this.environments.test;

    // Fusionne la configuration
    this.resolvedConfig = {
      ...this.config,
      baseUrl: envConfig.baseUrl,
      authServer: this.config.authServer || envConfig.defaultAuthServer,
    };
  }

  createContainer() {
    const container = document.querySelector(this.resolvedConfig.ui.container);
    if (!container) {
      throw new Error(
        `Container ${this.resolvedConfig.ui.container} not found`
      );
    }

    let envSelector = "";

    container.innerHTML = `
            <div class="trustedx-widget">
                ${envSelector}
                <div class="widget-content"></div>
                <div class="widget-loading" style="display: none;">
          <div class="spinner"></div>
        </div>
        <div class="widget-error" style="display: none;"></div>
            </div>
        `;

    // Gestion du changement d'environnement
    if (this.resolvedConfig.ui.showEnvSelector) {
      container.querySelectorAll('input[name="env"]').forEach((radio) => {
        radio.addEventListener("change", (e) => {
          this.config.environment = e.target.value;
          this.applyEnvironmentConfig();
          this.refreshWidget();
        });
      });
    }
    this.elements = {
      container,
      content: container.querySelector(".widget-content"),
      loading: container.querySelector(".widget-loading"),
      error: container.querySelector(".widget-error"),
    };
  }

  refreshWidget() {
    // Réinitialise le widget avec la nouvelle configuration
    this.elements.content.innerHTML = "";
    this.render();
    this.setupEventListeners();
  }

  /**
   * Affiche l'interface principale
   */
  render() {
    this.elements.content.innerHTML = `
    <h3 style="color: ${this.resolvedConfig.ui.primaryColor}; text-align: center;">
      Authentification TrustedX
    </h3>
    <button id="trustedx-login-btn" type="button">
      Se connecter
    </button>
    <p style="text-align: center; margin-top: 15px; font-size: 0.9em;">
      Vous serez redirigé vers le service d'authentification sécurisée
    </p>
  `;
  }

  /**
   * Configure les écouteurs d'événements
   */
  setupEventListeners() {
    const loginBtn = this.elements.content.querySelector("#trustedx-login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => this.startAuthFlow());
    }
  }

  /**
   * Démarre le flux d'authentification avec PKCE
   */
  async startAuthFlow() {
    this.setState({ isLoading: true, error: null });

    // Génère des valeurs aléatoires pour la sécurité
    const state = this.generateRandomString(32);
    const nonce = this.generateRandomString(32);
    const codeVerifier = this.generateRandomString(64);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Stocke en session
    sessionStorage.setItem("tx_auth_state", state);
    sessionStorage.setItem("tx_auth_code_verifier", codeVerifier);

    if (this.resolvedConfig.scope.includes("openid")) {
      sessionStorage.setItem("tx_auth_nonce", nonce);
    }

    // Construit l'URL d'authentification
    const authUrl = new URL(
      `${this.resolvedConfig.baseUrl}/trustedx-authserver/oauth`
    );

    if (this.resolvedConfig.authServer) {
      authUrl.pathname += `/${encodeURIComponent(
        this.resolvedConfig.authServer
      )}`;
    }

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.resolvedConfig.clientId,
      redirect_uri: this.resolvedConfig.redirectUri,
      scope: this.resolvedConfig.scope.split("+").join(" "),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      nonce: this.resolvedConfig.scope.includes("openid") ? nonce : undefined,
      prompt: "login",
    });

    authUrl.search = params.toString();

    // Configuration de la popup
    const width = 500;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    console.log(authUrl.toString());

    const popup = window.open(
      authUrl.toString(),
      "TrustedXAuth",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    // Vérification périodique si la popup est fermée
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        this.setState({ isLoading: false });
        if (!sessionStorage.getItem("tx_auth_success")) {
          this.handleAuthError(
            "popup_closed",
            "La fenêtre d'authentification a été fermée"
          );
        }
      }
    }, 500);

    // Stocke la référence à la popup
    this.authPopup = popup;
  }

  /**
   * Génère un code challenge pour PKCE
   */
  async generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  /**
   * Nouvelle méthode pour envoyer le code au backend
   */
  async sendCodeToBackend(authorizationCode, state) {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await fetch(this.resolvedConfig.beUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.resolvedConfig.beBearer,
          "x-tenant-id": "589l15lWQE",
        },
        body: JSON.stringify({
          code: authorizationCode,
          state: state,
          redirect_uri: this.resolvedConfig.redirectUri,
          // Inclure le code_verifier si vous utilisez PKCE
          code_verifier: sessionStorage.getItem("tx_auth_code_verifier"),
          // Autres paramètres nécessaires
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de l'authentification");
      }

      const tokenData = await response.json();

      // Nettoyage
      sessionStorage.removeItem("tx_auth_state");
      sessionStorage.removeItem("tx_auth_code_verifier");
      sessionStorage.removeItem("tx_auth_nonce");

      // Émettre l'événement de succès
      if (this.resolvedConfig.onSuccess) {
        this.resolvedConfig.onSuccess(tokenData);
      }

      return tokenData;
    } catch (error) {
      this.handleAuthError("backend_error", error.message);
      throw error;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  /**
   * Gère la réponse de la popup
   */
  handlePopupResponse(queryParams) {
    const params = new URLSearchParams(queryParams);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    if (error) {
      this.handleAuthError(error, params.get("error_description"));
      return;
    }

    if (code && state) {
      sessionStorage.setItem("tx_auth_success", "true");
      if (this.authPopup) this.authPopup.close();

      // Envoyer le code au backend au lieu de l'échanger directement
      this.sendCodeToBackend(code, state);
    }
  }

  /**
   * Échange le code contre un token avec PKCE
   */
  async exchangeCodeForToken(code, state) {
    try {
      this.setState({ isLoading: true });

      // Vérifie le state pour prévenir les attaques CSRF
      const savedState = sessionStorage.getItem("tx_auth_state");
      if (state !== savedState) {
        throw new Error("Invalid state parameter");
      }

      const codeVerifier = sessionStorage.getItem("tx_auth_code_verifier");
      if (!codeVerifier) {
        throw new Error("Missing code verifier");
      }

      console.log(this.resolvedConfig);

      const response = await fetch(
        `${
          this.resolvedConfig.baseUrl
        }/trustedx-authserver/oauth/${encodeURIComponent(
          this.resolvedConfig.authServer
        )}/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: this.resolvedConfig.redirectUri,
            client_id: this.resolvedConfig.clientId,
            code_verifier: codeVerifier,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || "Failed to obtain token");
      }

      // Vérifie le token si OpenID Connect
      if (data.id_token && this.resolvedConfig.scope.includes("openid")) {
        await this.validateIdToken(data.id_token);

        // Optionnel: vérifier le token d'accès via l'endpoint d'introspection
        if (this.resolvedConfig.verifyAccessToken) {
          await this.verifyAccessToken(data.access_token);
        }
      }

      // Nettoie le sessionStorage
      sessionStorage.removeItem("tx_auth_state");
      sessionStorage.removeItem("tx_auth_nonce");
      sessionStorage.removeItem("tx_auth_code_verifier");

      // Émet l'événement de succès
      if (this.resolvedConfig.onSuccess) {
        this.resolvedConfig.onSuccess(data);
      }
    } catch (error) {
      this.handleAuthError("token_error", error.message);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  /**
   * Vérifie un token d'accès via l'endpoint d'introspection
   */
  async verifyAccessToken(accessToken) {
    try {
      const response = await fetch(
        `${this.resolvedConfig.baseUrl}/trustedx-authserver/oauth/token/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${accessToken}`,
          },
          body: new URLSearchParams({
            token: accessToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.active) {
        throw new Error("Token verification failed");
      }

      return data;
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  }

  /**
   * Valide le token JWT avec vérification de signature
   */
  async validateIdToken(idToken) {
    try {
      // Décoder le token sans vérifier la signature
      const [header, payload] = idToken.split(".");
      const decodedHeader = JSON.parse(atob(header));
      const decodedPayload = JSON.parse(atob(payload));

      // Vérifications basiques
      const now = Math.floor(Date.now() / 1000);
      const savedNonce = sessionStorage.getItem("tx_auth_nonce");

      if (decodedPayload.exp < now) {
        throw new Error("Token expired");
      }

      if (decodedPayload.nonce !== savedNonce) {
        throw new Error("Invalid nonce");
      }

      if (decodedPayload.aud !== this.resolvedConfig.clientId) {
        throw new Error("Invalid audience");
      }

      // Obtenir les clés publiques pour vérifier la signature
      const jwks = await this.fetchJWKS();
      const publicKey = jwks.keys.find((key) => key.kid === decodedHeader.kid);

      if (!publicKey) {
        throw new Error("No matching public key found");
      }

      // Vérifier la signature (implémentation simplifiée)
      const isValid = await this.verifySignature(idToken, publicKey);
      if (!isValid) {
        throw new Error("Invalid signature");
      }

      return decodedPayload;
    } catch (error) {
      console.error("ID Token validation failed:", error);
      throw new Error("Invalid ID Token");
    }
  }

  /**
   * Récupère les clés JWKS du serveur
   */
  async fetchJWKS() {
    const response = await fetch(
      `${this.resolvedConfig.baseUrl}/trustedx-authserver/oauth/keys`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch JWKS");
    }

    return await response.json();
  }

  /**
   * Vérifie la signature du JWT (implémentation simplifiée)
   */
  async verifySignature(token, jwk) {
    // Note: Ceci est une implémentation simplifiée. En production, utilisez une bibliothèque comme jose ou jwt-decode
    try {
      // Convertir la JWK en CryptoKey
      const key = await window.crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
        false,
        ["verify"]
      );

      const [header, payload, signature] = token.split(".");
      const signatureData = this.base64UrlToArrayBuffer(signature);
      const data = new TextEncoder().encode(`${header}.${payload}`);

      return await window.crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        key,
        signatureData,
        data
      );
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }

  base64UrlToArrayBuffer(base64Url) {
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/") + padding;
    const rawData = atob(base64);
    const output = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      output[i] = rawData.charCodeAt(i);
    }
    return output;
  }

  generateRandomString(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.updateUI();
  }

  updateUI() {
    if (this.state.isLoading) {
      this.elements.loading.style.display = "block";
      this.elements.content.style.display = "none";
      this.elements.error.style.display = "none";
    } else if (this.state.error) {
      this.elements.error.textContent = this.state.error;
      this.elements.error.style.display = "block";
      this.elements.content.style.display = "block";
      this.elements.loading.style.display = "none";
    } else {
      this.elements.content.style.display = "block";
      this.elements.loading.style.display = "none";
      this.elements.error.style.display = "none";
    }
  }

  /**
   * Gère les erreurs d'authentification
   */
  handleAuthError(error, description) {
    console.error("Auth error:", error, description);

    let errorMessage = "Erreur d'authentification";

    switch (error) {
      case "invalid_token":
        errorMessage = "Token invalide ou expiré";
        break;
      case "insufficient_scope":
        errorMessage = "Permissions insuffisantes";
        break;
      case "invalid_grant":
        errorMessage = "Code d'autorisation invalide ou expiré";
        break;
      case "access_denied":
        errorMessage = "Authentification annulée";
        break;
      case "invalid_request":
        errorMessage = "Requête invalide";
        break;
      case "invalid_scope":
        errorMessage = "Permissions invalides";
        break;
      case "server_error":
        errorMessage = "Erreur du serveur";
        break;
    }

    if (description) {
      errorMessage += `: ${description}`;
    }

    this.setState({
      isLoading: false,
      error: errorMessage,
    });

    if (this.config.onError) {
      this.config.onError({ error, error_description: description });
    }
  }

  /**
   * Vérifie si le navigateur supporte les APIs nécessaires pour PKCE
   */
  checkBrowserCompatibility() {
    if (!window.crypto || !window.crypto.subtle) {
      this.handleAuthError(
        "browser_error",
        "Votre navigateur ne supporte pas les fonctionnalités de sécurité requises. " +
          "Merci d'utiliser une version récente de Chrome, Firefox, Edge ou Safari."
      );
      return false;
    }
    return true;
  }

  /**
   * Nettoie les données de session
   */
  clearAuthSession() {
    sessionStorage.removeItem("tx_auth_state");
    sessionStorage.removeItem("tx_auth_nonce");
    sessionStorage.removeItem("tx_auth_code_verifier");
    sessionStorage.removeItem("tx_auth_success");
  }
}

// Export pour différents environnements
if (typeof window !== "undefined") {
  window.TrustedXAuthWidget = TrustedXAuthWidget;
}

// Auto-initialisation si data-trustedx-widget est présent
document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll("[data-trustedx-widget]");

  containers.forEach((container) => {
    try {
      const config = container.dataset.trustedxWidget
        ? JSON.parse(container.dataset.trustedxWidget)
        : {};

      config.ui.container = `#${container.id}`;
      new TrustedXAuthWidget(config);
    } catch (error) {
      console.error("Failed to initialize TrustedX widget:", error);
    }
  });
});
