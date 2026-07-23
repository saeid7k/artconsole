import { accessLevelsType } from "@/constants/accessLevels";
import { Address } from "./commonObjects";

export interface UserProps {
  id: number;
  firstname: string;
  lastname: string;
  username?: string | null;
  email: string;
  email_verified_at?: string | null;
  country_code?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: Address | null;
  bio?: string | null;
  token_balance: number;
  is_demo?: boolean;
  demo_claimed_at?: string | null;
  deleted_at?: string | null;

  // Appends
  abilities: {
    [key: string]: boolean;
  };
  is_admin: boolean;
  full_name: string;
  formatted_address: string;
  photo?: string | null;
  photo_thumb?: string | null;
  photo_small?: string | null;
  has_password: boolean;
  timezone?: string | null;
  access: accessLevelsType;
  has_edit_access: boolean;
  days_to_delete?: number;
}
