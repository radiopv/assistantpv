export interface Testimonial {
  id: string;
  content: string;
  author: string;
  rating?: number;
  is_approved: boolean;
  is_featured: boolean;
  sponsor_id?: string;
  child_id?: string;
  created_at?: string;
  updated_at?: string;
}