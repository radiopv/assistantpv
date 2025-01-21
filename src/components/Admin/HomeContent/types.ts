export interface ModuleContent {
  title?: string;
  subtitle?: string;
}

export interface ModuleSettings {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
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
  showProgressBar?: boolean;
  showProgressBars?: boolean;
  showTargetAmount?: boolean;
  categories?: string[];
  showMemberCount?: boolean;
  displayTestimonials?: boolean;
  enableJoinButton?: boolean;
}

export interface Module {
  id: string;
  name: string;
  module_type: ModuleType;
  is_active: boolean;
  settings: ModuleSettings;
  content: ModuleContent;
  order_index: number;
}

export type ModuleType = 
  | "hero"
  | "featured-children"
  | "how-it-works"
  | "testimonials"
  | "featured-album"
  | "impact-stats"
  | "journey"
  | "events"
  | "needs"
  | "newsletter"
  | "donation-goals"
  | "community";