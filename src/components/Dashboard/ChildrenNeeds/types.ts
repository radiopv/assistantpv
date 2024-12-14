import { Need } from "@/types/needs";

export interface ChildNeed {
  childId: string;
  childName: string;
  description: string;
  story: string;
  comments: string;
  needs: Need[];
}