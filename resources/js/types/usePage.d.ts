import { AuthProps } from "./auth";
import { GalleryProps } from "./gallery";

export interface UsePageProps {
  [key: string]: any;
  current_gallery: GalleryProps;
  galleries: GalleryProps[];
  auth: AuthProps;
}
