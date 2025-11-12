import { Address } from "./commonObjects";

export interface GalleryProps {
  id: number;
  user_id: number;
  name: string;
  about?: string | null;
  address?: Address | null;
  logo?: string | null;
  pivot?: {
    access: 'editor' | 'viewer';
  };
  members_count?: number;
}
