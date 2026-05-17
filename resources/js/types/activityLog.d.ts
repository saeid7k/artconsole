import { UserProps } from "./user";

export interface ActivityLogProps {
  id: number;
  log_name: string;
  description: string;
  subject_type?: string | null;
  subject_id?: number | null;
  event: string;
  causer_type?: string | null;
  causer_id?: number | null;
  causer?: UserProps;
  photo?: string;
  properties: Record<string, any>;
  batch_uuid?: string | null;
  created_at: string;
  updated_at: string;
}
