import { createContext, useContext } from "react";

const GallerySettingsContext = createContext<any>({})

function GallerySettingsProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <GallerySettingsContext.Provider value={value}>
      {children}
    </GallerySettingsContext.Provider>
  )
}

function useGallerySettings() {
  return useContext(GallerySettingsContext);
}

export { GallerySettingsProvider, useGallerySettings };
