import { UserProps } from "./user";

export interface ActivityLogProps {
  id: number;
  log_name: string;
  event: string;
  causer?: UserProps;
  description: string;
  photo?: string;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}
