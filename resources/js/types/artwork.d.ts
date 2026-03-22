import { ContactProps } from "./contact";
import { DimensionsProps } from "./dimensions";
import { LocationProps } from "./location";
import { UserProps } from "./user";

export interface ArtworkProps {
  id: number;
  creator_id: number;
  gallery_id: number;
  location_id?: number | null;
  artist_id: number;
  artist_data: UserProps;

  sku: string;
  title: string;
  year?: string | null;
  price: number;
  edition: {
    type: string;
    number: number | null;
    size: number | null;
  } | null;
  signed: boolean;
  signature_note?: string | null;
  description?: string | null;

  category: string;
  subjects?: string[] | null;
  mediums?: string[] | null;
  styles?: string[] | null;
  dimensions?: DimensionsProps | null;

  ownership?: string | null;
  owner_contact_id?: number | null;
  consignment_terms?: string | null;
  provenance?: string | null;

  details?: object | null;
  status: string;

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  // Attributes not in database
  abilities: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  main_image_url?: string | null;
  main_image_thumb_url?: string | null;
  images: Array<any>;
  invoice_description: string;

  // Relationships
  artist: ContactProps;
  location: LocationProps;
  owner?: ContactProps | null;
  notes: Array<NoteProps>;
}
