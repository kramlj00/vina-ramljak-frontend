'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for i18n to initialize on client
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on('initialized', () => {
        setIsReady(true);
      });
    }
  }, []);

  // Don't render children until i18n is ready on client
  if (!isReady) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
