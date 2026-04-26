import { accessLevelsType } from "@/constants/accessLevels";
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
  is_demo?: boolean;
  email_verified_at?: string;
  is_admin: boolean;
  formatted_address?: string;
  full_name: string;
  photo?: string;

  // Appends
  abilities: {
    [key: string]: boolean;
  };
  access: accessLevelsType;
  full_name: string;
}
