export interface TaxProps {
  id: number;
  gallery_id: number;
  name: string;
  abbreviation: string;
  rate: number;
  description?: string | null;
  tax_number?: string | null;
  default: boolean;
}
