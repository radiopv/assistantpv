export interface ChildrenTable {
  Row: {
    id: string;
    name: string;
    age: number;
    gender: string;
    birth_date: string;
    city: string | null;
    description: string | null;
    comments: string | null;
    story: string | null;
    photo_url: string | null;
    needs: Record<string, any> | null;
    is_sponsored: boolean | null;
    sponsor_id: string | null;
    sponsor_name: string | null;
    sponsor_email: string | null;
    status: string;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: Omit<ChildrenTable["Row"], "id" | "created_at" | "updated_at"> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<ChildrenTable["Row"]>;
  Relationships: [];
}

export type Child = ChildrenTable["Row"];