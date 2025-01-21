import { Json } from "@/integrations/supabase/types/json";

export interface Module {
  id: string;
  name: string;
  module_type: string;
  content: {
    title?: string;
    subtitle?: string;
  };
  settings: ModuleSettings;
  is_active: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface ModuleSettings {
  title: string;
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
}

export type ModuleType = 'hero' | 'impact' | 'journey' | 'featured' | 'cta';