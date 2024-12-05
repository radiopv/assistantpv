export interface UnifiedMediaBrowser {
  id: string;
  url: string;
  type: string;
  source_table: string;
  category: string;
  metadata: {
    title?: string;
    description?: string;
    is_featured?: boolean;
    thumbnail_url?: string;
    is_public?: boolean;
  };
  created_at: string;
}