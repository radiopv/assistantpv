export interface TestimonialsTable {
  Row: {
    id: string;
    content: string;
    author: string;
    rating: number | null;
    is_approved: boolean;
    is_featured: boolean;
    sponsor_id: string | null;
    child_id: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: Omit<TestimonialsTable["Row"], "id" | "created_at" | "updated_at"> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<TestimonialsTable["Row"]>;
  Relationships: [
    {
      foreignKeyName: "testimonials_child_id_fkey";
      columns: ["child_id"];
      isOneToOne: false;
      referencedRelation: "children";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "testimonials_sponsor_id_fkey";
      columns: ["sponsor_id"];
      isOneToOne: false;
      referencedRelation: "sponsors";
      referencedColumns: ["id"];
    }
  ];
}

export type Testimonial = TestimonialsTable["Row"];