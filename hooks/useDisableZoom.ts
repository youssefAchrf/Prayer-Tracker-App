// In hooks/useDisableZoom.ts

import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useDisableZoom() {
  useEffect(() => {
    // We only want this logic to run on the web
    if (Platform.OS !== 'web') {
      return;
    }

    const setViewport = () => {
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        // This is the rule that prevents zooming on input focus
        meta.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }
    };

    // Run it once on mount
    setViewport();

    // Optional: Add an event listener in case the viewport gets reset
    window.addEventListener('resize', setViewport);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', setViewport);
    };
  }, []);
}