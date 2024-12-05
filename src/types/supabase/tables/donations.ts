import { Json } from "../../json";
import { Database } from "../base";

export type DonationRow = Database["public"]["Tables"]["donations"]["Row"];
export type DonationInsert = Database["public"]["Tables"]["donations"]["Insert"];
export type DonationUpdate = Database["public"]["Tables"]["donations"]["Update"];

export interface DonationStatistics {
  completed_donations: number | null;
  pending_donations: number | null;
  success_rate: number | null;
  total_donations: number | null;
  total_people_helped: number | null;
}