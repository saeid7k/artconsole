import { createContext, useContext } from "react";

const ArtworkIndexContext = createContext<any>({})

function ArtworkIndexProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <ArtworkIndexContext.Provider value={value}>
      {children}
    </ArtworkIndexContext.Provider>
  )
}

function useArtworksIndex() {
  return useContext(ArtworkIndexContext);
}

export { ArtworkIndexProvider, useArtworksIndex };
