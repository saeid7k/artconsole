import { createContext, useContext } from "react";

const ArtworkShowContext = createContext<any>({})

function ArtworkShowProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <ArtworkShowContext.Provider value={value}>
      {children}
    </ArtworkShowContext.Provider>
  )
}

function useArtworkShow() {
  return useContext(ArtworkShowContext);
}

export { ArtworkShowProvider, useArtworkShow };
