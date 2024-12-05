import { Database } from "../base";
import { Json } from "../json";

export interface UnifiedMediaBrowser {
  id: string;
  url: string;
  type: string;
  source_table: string;
  category: string;
  metadata: Json;
  created_at: string;
}

export type MediaItem = {
  id: string;
  url: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  created_at?: string;
};