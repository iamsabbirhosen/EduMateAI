'use client';

import { useAuth } from './use-auth';
import { translations, type TranslationKey } from '@/lib/locales';

export function useTranslation() {
  const { user } = useAuth();
  const language = user?.language || 'en';

  const t = (key: TranslationKey): string => {
    if (language === 'Bangla') {
      return translations.bn[key] || translations.en[key];
    }
    return translations.en[key];
  };

  return { t, language };
}
