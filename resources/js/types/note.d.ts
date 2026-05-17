import { UserProps } from "./user";

export interface NoteProps {
  id: number | null;
  user_id?: number | null;
  noteable_type?: string;
  noteable_id?: number;
  content: string | null;
  collaborators_ids?: number[] | null;
  created_at?: string;
  updated_at?: string;
  // Relations
  creator?: UserProps;
}
