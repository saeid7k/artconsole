import { UserProps } from "./user";

export interface NoteProps {
  id: number;
  gallery_id: number;
  user_id?: number | null;
  noteable_type?: string;
  noteable_id?: number;
  content: string | null;
  collaborators_ids?: number[] | null;
  created_at: string;
  updated_at: string;
  // Relations
  creator?: UserProps;
}

/** Represents an unsaved note placeholder before it is persisted to the database. */
export interface NewNoteProps {
  id: null;
  content: string | null;
}

export type NoteOrNew = NoteProps | NewNoteProps;
