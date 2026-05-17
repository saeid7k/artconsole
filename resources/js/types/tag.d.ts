export type TagType = 'medium' | 'style' | 'subject' | 'collection' | 'tag';

export interface TagProps {
  id: number;
  gallery_id?: number | null;
  type: TagType;
  value: string;
  created_at: string;
  updated_at: string;
}
