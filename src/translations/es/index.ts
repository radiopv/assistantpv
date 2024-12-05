import { childrenTranslations } from './children';
import { donationsTranslations } from './donations';
import { translationManagerTranslations } from './translation-manager';
import { commonTranslations } from './common';
import { authTranslations } from './auth';
import { navigationTranslations } from './navigation';
import { adminTranslations } from './admin';
import { sponsorshipTranslations } from './sponsorship';

export const spanishTranslations = {
  ...commonTranslations,
  ...authTranslations,
  ...navigationTranslations,
  ...adminTranslations,
  ...sponsorshipTranslations,
  ...childrenTranslations,
  ...donationsTranslations,
  ...translationManagerTranslations
};