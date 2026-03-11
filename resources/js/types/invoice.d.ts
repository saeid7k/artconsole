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
}
