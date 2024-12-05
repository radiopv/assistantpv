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