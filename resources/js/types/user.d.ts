import { Address } from "./commonObjects";

export interface UserProps {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  website?: string;
  address?: Address;
  bio?: string;
  email_verified_at?: string;
  is_admin: boolean;
  formatted_address?: string;
}
