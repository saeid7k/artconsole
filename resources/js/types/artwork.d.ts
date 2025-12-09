import { ContactProps } from "./contact";
import { UserProps } from "./user";

export interface ArtworkProps {
  id: number;
  gallery_id: number;
  location_id?: number | null;
  artist_id: number;
  artist: ContactProps;
  artist_data: UserProps;
  sku: string;
  category: string;
  edition: string;
  title: string;
  subject?: string | null;
  description?: string | null;
  year?: string | null;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  } | null;
  price: number;
  medium?: string | null;
  styles: string[];
  collections: string[];
  details?: object | null;
  notes?: string | null;
  status: string;
}
