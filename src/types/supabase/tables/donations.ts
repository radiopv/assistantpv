import { Database } from "../base";

export type Donation = Database["public"]["Tables"]["donations"]["Row"];
export type DonationInsert = Database["public"]["Tables"]["donations"]["Insert"];
export type DonationUpdate = Database["public"]["Tables"]["donations"]["Update"];