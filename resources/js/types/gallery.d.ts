import { accessLevelsType } from "@/constants/accessLevels";
import { Address } from "./commonObjects";

export interface GalleryProps {
  id: number;
  user_id: number;
  name: string;
  about?: string | null;
  address?: Address | null;
  logo?: string | null;
  pivot?: {
    access: accessLevelsType
  };
  members_count?: number;
  abilities?: {
    update: boolean;
    delete: boolean;
  };
}
