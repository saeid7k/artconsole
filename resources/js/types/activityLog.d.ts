import { UserProps } from "./user";

export interface ActivityLogProps {
  id: number;
  causer?: UserProps;
  description: string;
  photo?: string;
  created_at: string;
  updated_at: string;
}
