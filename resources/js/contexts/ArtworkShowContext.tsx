import { createContext, use } from "react";

const ArtworkShowContext = createContext<any>({})

function ArtworkShowProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <ArtworkShowContext value={value}>
      {children}
    </ArtworkShowContext>
  )
}

function useArtworkShow() {
  return use(ArtworkShowContext);
}

export { ArtworkShowProvider, useArtworkShow };
