export interface HomepageConfig {
  id: string;
  section_name: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  is_visible: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface HomeImage {
  id: string;
  url: string;
  position: "hero" | "secondary" | "featured";
  layout_position: "left" | "right" | "mobile";
  is_mobile: boolean;
  created_at?: string;
  updated_at?: string;
}