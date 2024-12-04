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
  position: string;
  layout_position: string | null;
  is_mobile: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}