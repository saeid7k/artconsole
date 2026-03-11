export interface TaxProps {
  id: number;
  gallery_id: number;
  name: string;
  rate: number;
  description?: string | null;
  default: boolean;
}
