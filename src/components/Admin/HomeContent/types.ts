export interface Module {
  id: string;
  name: string;
  module_type: string;
  is_active: boolean;
  settings: any;
  order_index: number;
  content?: {
    title?: string;
    subtitle?: string;
  };
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