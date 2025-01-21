import { Database } from "@/integrations/supabase/types";

export type Tables = Database['public']['Tables'];

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;

export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Table specific types
export type Child = Row<'children'>;
export type Sponsor = Row<'sponsors'>;
export type AlbumMedia = Row<'album_media'>;
export type Sponsorship = Row<'sponsorships'>;
export type Donation = Row<'donations'>;
export type Notification = Row<'notifications'>;
export type Message = Row<'messages'>;
export type Testimonial = Row<'temoignage'>;

// Helper type for Supabase responses
export type SupabaseResponse<T> = T extends Array<infer U> ? U[] : T;