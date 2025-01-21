import { Json } from "@/integrations/supabase/types";

export type ModuleType = 'hero' | 'featured' | 'impact' | 'cta' | 'journey' | 'testimonials';

export interface ModuleContent {
  title?: string;
  subtitle?: string;
  [key: string]: any;
}

export interface ModuleSettings {
  title?: string;
  showTotalSponsors?: boolean;
  showTotalChildren?: boolean;
  showTotalDonations?: boolean;
  animateNumbers?: boolean;
  backgroundStyle?: string;
  steps?: { title: string; description: string; }[];
  showProgressBar?: boolean;
  [key: string]: any;
}

export interface Module {
  id: string;
  name: string;
  module_type: ModuleType;
  is_active: boolean;
  content: ModuleContent;
  settings: ModuleSettings;
  order_index: number;
  created_at: string;
  updated_at: string;
}