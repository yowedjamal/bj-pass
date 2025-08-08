# Basic Usage

This guide covers the fundamental usage patterns for the BJ-Pass Authentication Widget.

## Simple Initialization

The most basic setup requires only a client ID:

```javascript
const widget = new BJPassAuthWidget({
    clientId: "your-client-id",
    environment: "test", // or "production"
    ui: {
        container: "#auth-container",
        primaryColor: "#0066cc",
        language: "fr" // or "en"
    },
    onSuccess: (tokens) => {
        console.log("Authentication successful!", tokens);
        // Handle successful authentication
        handleAuthSuccess(tokens);
    },
    onError: (error) => {
        console.error("Authentication failed:", error);
        // Handle authentication errors
        handleAuthError(error);
    }
});
```

## Enhanced Widget

For advanced features like plugins and hooks:

```javascript
const enhancedWidget = new EnhancedBJPassAuthWidget({
    clientId: "your-client-id",
    debug: true,        // Enable debug mode
    analytics: true,    // Enable analytics tracking
    maxRetries: 3,      // Retry failed requests
    
    // Standard configuration options
    onSuccess: (tokens) => {
        // Handle successful authentication
        storeTokens(tokens);
        redirectToApp();
    },
    
    onError: (error) => {
        // Handle errors with enhanced debugging
        if (error.code === 'popup_closed') {
            showUserMessage("Authentication was cancelled");
        }
    }
});
```

## Widget Factory

Create multiple widgets or themed widgets using the factory pattern:

```javascript
// Single themed widget
const darkWidget = BJPassWidgetFactory.createWithTheme("dark", {
    clientId: "your-client-id",
    ui: {
        container: "#dark-auth"
    }
});

// Multiple widgets at once
const widgets = BJPassWidgetFactory.createMultiple([
    {
        clientId: "client1",
        ui: { container: "#widget1", theme: "modern" }
    },
    {
        clientId: "client2", 
        ui: { container: "#widget2", theme: "minimal" }
    }
]);
```

## Backend Integration

### Option 1: Backend-Mediated Flow (Recommended)

Send the authorization code to your backend for token exchange:

```javascript
const widget = new BJPassAuthWidget({
    clientId: "your-client-id",
    beUrl: "https://your-api.com/auth/exchange",
    beBearer: "Bearer your-api-token",
    onSuccess: (backendResponse) => {
        // Handle response from your backend
        console.log("Backend response:", backendResponse);
        // Your backend can return custom data along with tokens
    }
});
```

### Option 2: Direct Token Exchange

Exchange tokens directly in the browser:

```javascript
const widget = new BJPassAuthWidget({
    clientId: "your-client-id",
    verifyAccessToken: true, // Enable token verification
    onSuccess: (tokens) => {
        // Handle tokens directly from BJ-Pass
        console.log("Direct tokens:", tokens);
        // tokens.access_token, tokens.id_token, etc.
    }
});
```

## Handling Authentication Flow

### Starting Authentication

The widget automatically creates UI elements, but you can also trigger authentication programmatically:

```javascript
// Manual trigger
widget.startAuthFlow();

// Or let users click the auto-generated button
// The widget creates a login button automatically in the specified container
```

### Handling Success

The success callback receives different data depending on your configuration:

```javascript
onSuccess: (tokens) => {
    // For direct exchange
    if (tokens.access_token) {
        console.log("Access token:", tokens.access_token);
        console.log("ID token:", tokens.id_token);
    }
    
    // For backend-mediated flow
    if (tokens.user) {
        console.log("User data:", tokens.user);
        console.log("Custom backend data:", tokens.customData);
    }
}
```

### Handling Errors

Implement comprehensive error handling:

```javascript
onError: (error) => {
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Handle specific error types
    switch (error.code) {
        case 'popup_closed':
            showUserMessage("Please allow popups and try again");
            break;
        case 'access_denied':
            showUserMessage("Authentication was cancelled");
            break;
        case 'invalid_client':
            showUserMessage("Configuration error. Please contact support.");
            break;
        default:
            showUserMessage("Authentication failed. Please try again.");
    }
}
```

## Widget Lifecycle Management

### Updating Configuration

```javascript
// Update widget configuration
widget.updateConfig({
    environment: "production",
    ui: {
        language: "en",
        primaryColor: "#ff6600"
    }
});
```

### Refreshing the Widget

```javascript
// Refresh UI while maintaining configuration
widget.refresh();
```

### Cleanup

```javascript
// Clean up when done (removes event listeners and DOM elements)
widget.destroy();
```

## Environment Switching

Allow users to switch between test and production environments:

```javascript
const widget = new BJPassAuthWidget({
    clientId: "your-client-id",
    environment: "test", // Default environment
    ui: {
        showEnvSelector: true // Show environment selector UI
    },
    onSuccess: (tokens) => {
        console.log(`Authenticated in ${widget.getConfig().environment} environment`);
    }
});
```

## Complete Working Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>BJ-Pass Auth Example</title>
</head>
<body>
    <div id="auth-container"></div>
    
    <script src="https://cdn.yourdomain.com/bj-pass-widget.js"></script>
    <script>
        const widget = new BJPassAuthWidget({
            clientId: "your-client-id",
            environment: "test",
            
            ui: {
                container: "#auth-container",
                theme: "modern",
                language: "en"
            },
            
            onSuccess: (tokens) => {
                console.log("Success!", tokens);
                document.body.innerHTML += `
                    <div style="background: #d4edda; padding: 20px; margin: 20px 0;">
                        <h3>Authentication Successful!</h3>
                        <p>Access token: ${tokens.access_token?.substring(0, 20)}...</p>
                    </div>
                `;
            },
            
            onError: (error) => {
                console.error("Error:", error);
                document.body.innerHTML += `
                    <div style="background: #f8d7da; padding: 20px; margin: 20px 0;">
                        <h3>Authentication Failed</h3>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            }
        });
    </script>
</body>
</html>
```

## Next Steps

- [Configuration Options](configuration.md) - Explore all available configuration options
- [API Reference](core-api.md) - Detailed API documentation
- [Error Handling](error-handling.md) - Advanced error handling strategies