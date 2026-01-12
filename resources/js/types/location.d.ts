import { Address } from "./commonObjects";

export interface LocationProps {
  id: number;
  type: string;
  contact_id?: number|null;
  name: string;
  description?: string|null;
  address?: Address|null;
  address_same_as_gallery: boolean;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  formatted_address: string;
  artworks_count: number;
  artworks_images_urls?: string[];
}
