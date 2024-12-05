import { childrenTranslations } from './children';
import { donationsTranslations } from './donations';
import { translationManagerTranslations } from './translation-manager';

// Import existing translations from the old file
import { commonTranslations } from './common';
import { authTranslations } from './auth';
import { navigationTranslations } from './navigation';
import { adminTranslations } from './admin';
import { sponsorshipTranslations } from './sponsorship';

export const frenchTranslations = {
  ...commonTranslations,
  ...authTranslations,
  ...navigationTranslations,
  ...adminTranslations,
  ...sponsorshipTranslations,
  ...childrenTranslations,
  ...donationsTranslations,
  ...translationManagerTranslations
};