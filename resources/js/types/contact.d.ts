import { Address, Business } from "./commonObjects";

export interface ContactProps {
  id: number;
  user_id: number | null;
  gallery_id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: Address;
  website: string;
  relationship: Array<string>;
  business: Business;
  birthday: string | Date;
  photo?: string;
  created_at: string;
  updated_at: string;

  // Appended properties
  abilities: { [key: string]: boolean };
  full_name: string;
  formatted_address: string;
  business_formatted_address: string;
  sold_arts_count?: number;
}
