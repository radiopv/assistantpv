export interface SponsorsTable {
  Row: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    city: string | null;
    address: string | null;
    facebook_url: string | null;
    photo_url: string | null;
    role: string | null;
    is_active: boolean | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: Omit<SponsorsTable["Row"], "id" | "created_at" | "updated_at"> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<SponsorsTable["Row"]>;
  Relationships: [];
}

export type Sponsor = SponsorsTable["Row"];