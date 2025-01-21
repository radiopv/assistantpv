import { Json } from "@/integrations/supabase/types/json";

export interface Module {
  id: string;
  name: string;
  module_type: string;
  content: ModuleContent;
  settings: ModuleSettings;
  is_active: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface ModuleContent {
  title?: string;
  subtitle?: string;
}

export interface ModuleSettings {
  title: string;
  subtitle?: string;
  showTotalSponsors?: boolean;
  showTotalChildren?: boolean;
  showTotalDonations?: boolean;
  animateNumbers?: boolean;
  backgroundStyle?: string;
  steps?: Array<{
    title: string;
    description: string;
  }>;
  showProgressBar?: boolean;
  displayCount?: number;
  autoplay?: boolean;
  showRatings?: boolean;
  layout?: string;
  photosCount?: number;
  showCaptions?: boolean;
  autoSlide?: boolean;
  showLocation?: boolean;
  showDateTime?: boolean;
  enableRegistration?: boolean;
  categoriesCount?: number;
  showUrgentFirst?: boolean;
  enableDonationButton?: boolean;
  showSocialLinks?: boolean;
  backgroundColor?: string;
  showTargetAmount?: boolean;
  categories?: string[];
  showMemberCount?: boolean;
  displayTestimonials?: boolean;
  enableJoinButton?: boolean;
  showProgressBars?: boolean;
}

export type ModuleType = 'hero' | 'impact' | 'journey' | 'featured' | 'cta' | 'testimonials' | 'featured-album' | 'events' | 'needs' | 'newsletter' | 'donation-goals' | 'community';