export interface HeroContent {
  ctaText: string;
  leftImage: string;
  rightImage: string;
  mobileImage: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: HeroContent;
  created_at: string;
  updated_at: string;
}

export interface HomeModule {
  id: string;
  name: string;
  isActive: boolean;
  orderIndex: number;
  content: {
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
  };
  moduleType: 'hero' | 'mission' | 'children' | 'process' | 'testimonials';
  settings?: {
    displayMode?: 'full' | 'compact';
    autoRotate?: boolean;
    itemsToShow?: number;
  };
}

export interface Database {
  public: {
    Tables: {
      homepage_modules: {
        Row: HomeModule;
        Insert: Omit<HomeModule, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HomeModule, 'id'>>;
      };
    };
  };
}