import { UserProps } from "./user";

export interface NoteProps {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string|null;
  // Relations
  creator?: UserProps
}
