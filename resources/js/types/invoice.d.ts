import { ArtworkProps } from "./artwork";
import { ContactProps } from "./contact";
import { GalleryProps } from "./gallery";
import { PaymentProps } from "./payment";

export interface InvoiceProps {
  id: number;
  gallery_id: number;
  user_id?: number | null;
  contact_id?: number | null;
  number: string;
  date: string;
  due_date: string | null;
  tax_id?: number | null;
  tax_name?: string | null;
  tax_rate?: number | null;
  subtotal: number;
  tax_amount: number;
  total: number;
  status: string;
  notes: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  // Appended Attributes
  invoice_number: string;
  amount_paid: number;
  amount_due: number;
  email_subject: string;

  // Relationships
  gallery?: GalleryProps;
  contact?: ContactProps | null;
  items?: any[];
  artworks?: ArtworkProps[];
  payments?: PaymentProps[];
}
