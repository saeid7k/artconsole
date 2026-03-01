import { ARTWORK_DOCUMENTS } from "@/constants/artworkDocuments";
import { ArtworkProps } from "@/types/artwork";
import DocumentCard from "../DocumentCard";

function ArtworkDocuments({ artwork }: { artwork: ArtworkProps }) {

  return (
    <div className="flex gap-3">
      {ARTWORK_DOCUMENTS.map(doc => (
        <DocumentCard
          key={doc.value}
          document={doc}
        />
      ))}
    </div>
  )
}

export default ArtworkDocuments;
