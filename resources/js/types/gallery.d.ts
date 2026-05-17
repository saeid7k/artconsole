import { accessLevelsType } from "@/constants/accessLevels";
import { Address } from "./commonObjects";
import { UserProps } from "./user";

export interface GalleryProps {
  // Main attributes
  id: number;
  user_id: number;
  name: string;
  about?: string | null;
  address?: Address | null;
  country_code?: string | null;
  phone?: string | null;
  website?: string | null;
  email?: string | null;

  // Relationships
  pivot?: {
    access: accessLevelsType
  };
  members: UserProps[];
  subscriptions: any[];

  // Appends
  abilities?: {
    update: boolean;
    delete: boolean;
    manage_members: boolean;
  };
  members_count?: number;
  logo_url?: string | null;
  formatted_address?: string | null;
  formatted_phone_number: string;
  meta?: { [key: string]: any };
  currency: string;
  invoice_prefix?: string | null;
  is_subscribed?: boolean;
  subscribed_price_id?: string | null;
  on_grace_period?: boolean;
}
