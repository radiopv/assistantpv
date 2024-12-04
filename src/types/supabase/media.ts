export interface UnifiedMedia {
  id: string;
  url: string;
  source_table: string;
  type: string;
  category: string;
  created_at: string;
}

export interface MediaBrowserView {
  id: string;
  url: string;
  source_table: string;
  type: string;
  category: string;
  created_at: string;
  metadata: Record<string, any> | null;
}