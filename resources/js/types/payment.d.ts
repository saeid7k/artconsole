import { ContactProps } from "./contact";
import { InvoiceProps } from "./invoice";
import { UserProps } from "./user";

export interface PaymentProps {
  // Base
  id: number;
  invoice_id: number;
  user_id?: number | null;
  amount: number;
  payment_date: string | null;
  payment_method: string | null;
  reference: string | null;
  notes: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Relationships
  invoice?: InvoiceProps;
  user?: UserProps;
}
