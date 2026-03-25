import { createContext, use, useContext } from "react";

const GallerySettingsContext = createContext<any>({})

function GallerySettingsProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <GallerySettingsContext value={value}>
      {children}
    </GallerySettingsContext>
  )
}

function useGallerySettings() {
  return use(GallerySettingsContext);
}

export { GallerySettingsProvider, useGallerySettings };
