export interface ReportProps {
  id: number;
  gallery_id: number;
  user_id?: number | null;
  type: string;
  name: string;
  description?: string | null;
  options?: Record<string, any> | null;
  artworks?: number[] | null;
  created_at: string;
  updated_at: string;
}
