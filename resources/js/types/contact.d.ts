import { Address, Business } from "./commonObjects";
import { NoteProps } from "./note";

export interface ContactProps {
  id: number;
  user_id: number | null;
  gallery_id: number;
  firstname: string;
  lastname: string;
  email: string;
  country_code?: string | null;
  phone: string;
  website: string;
  address: Address;
  relationship: Array<string>;
  business: Business;
  birthday: string | Date;
  photo?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  // Appended properties
  abilities: { [key: string]: boolean };
  full_name: string;
  formatted_address: string;
  business_formatted_address: string;
  formatted_phone_number: string;
  arts_count?: number;
  sold_arts_count?: number;
  purchased_arts_count?: number;

  // Relationships
  notes?: Array<NoteProps>;
}
