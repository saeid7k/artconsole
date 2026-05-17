import { ArtworkProps } from "./artwork";

export interface InvoiceItemProps {
  id: number;
  invoice_id: number;
  type: 'artwork' | 'custom';
  artwork_id?: number | null;
  name?: string | null;
  description?: string | null;
  quantity: number;
  price: number;
  taxable: boolean;
  created_at: string;
  updated_at: string;

  // Relationships
  artwork?: ArtworkProps | null;
}
