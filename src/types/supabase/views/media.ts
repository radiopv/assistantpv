export interface MediaBrowserView {
  id: string;
  url: string;
  source_table: string;
  type: "image" | "video";
  category: string;
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  title?: string;
  description?: string;
  is_featured?: boolean;
}