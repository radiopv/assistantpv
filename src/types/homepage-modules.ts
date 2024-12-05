export type ModuleType = 'hero' | 'mission' | 'children' | 'process' | 'testimonials';

export interface ModuleContent {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface ModuleSettings {
  displayMode?: 'full' | 'compact';
  autoRotate?: boolean;
  itemsToShow?: number;
}

export interface HomeModule {
  id: string;
  name: string;
  isActive: boolean;
  orderIndex: number;
  content: ModuleContent;
  moduleType: ModuleType;
  settings: ModuleSettings;
  created_at?: string;
  updated_at?: string;
}