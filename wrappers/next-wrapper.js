import { useEffect, useRef } from 'react';

const BjPassAuthWidget = ({ config, onSuccess, onError, onLogout }) => {
  const widgetRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamic import for SSR compatibility
    import('bj-pass-auth-widget').then((module) => {
      if (typeof window !== 'undefined') {
        const BjPass = module.default;
        
        // Initialize widget
        widgetRef.current = new BjPass({
          ...config,
          ui: {
            ...config?.ui,
            container: `#${containerRef.current.id}`
          },
          onSuccess,
          onError,
          onLogout
        });
      }
    });

    return () => {
      // Cleanup
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, [config, onSuccess, onError, onLogout]);

  return '<div id="bjpass-auth-container" ref='+containerRef+' />';
};

export default BjPassAuthWidget;