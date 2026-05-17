import { ArtworkProps } from "./artwork";
import { ContactProps } from "./contact";
import { GalleryProps } from "./gallery";
import { InvoiceItemProps } from "./invoiceItem";
import { PaymentProps } from "./payment";

export interface InvoiceProps {
  id: number;
  gallery_id: number;
  user_id?: number | null;
  contact_id?: number | null;
  number: string;
  date: string;
  due_date: string | null;
  shipping?: Record<string, any> | null;
  tax_id?: number | null;
  tax_name?: string | null;
  tax_rate?: number | null;
  subtotal: number;
  available_extra_costs?: { shipping?: boolean; discount?: boolean; [key: string]: any } | null;
  shipping_cost: number;
  shipping_taxable: boolean;
  discount_type?: 'percentage' | 'fixed' | null;
  discount_rate?: number | null;
  discount_amount: number;
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
  due_remaining_days?: number | null;
  email_subject: string;
  pdf_file_name: string;

  // Relationships
  gallery?: GalleryProps;
  contact?: ContactProps | null;
  items?: InvoiceItemProps[];
  artworks?: ArtworkProps[];
  payments?: PaymentProps[];
}
