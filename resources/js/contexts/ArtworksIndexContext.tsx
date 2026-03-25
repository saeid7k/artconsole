import { createContext, use, useContext } from "react";

const ArtworkIndexContext = createContext<any>({})

function ArtworkIndexProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <ArtworkIndexContext value={value}>
      {children}
    </ArtworkIndexContext>
  )
}

function useArtworksIndex() {
  return use(ArtworkIndexContext);
}

export { ArtworkIndexProvider, useArtworksIndex };
