import colors from "@/Themes/theme";
import { DocumentProps } from "@/types/document";
import { Download01Icon, FileViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card, Tooltip } from "antd";
import { useState } from "react";
import DocumentPreviewDrawer from "./DocumentPreviewDrawer";
import { downloadFile } from "@/utils/downloadHelper";
import { useArtworkShow } from "@/contexts/ArtworkShowContext";

function DocumentCard({ document }: { document: DocumentProps }) {

  const { artwork } = useArtworkShow()
  const [showPreview, setShowPreview] = useState(false);

  function handleDownload() {
    downloadFile({
      url: route('artworks.download-document', { artwork: artwork.id, type: document.value }),
      fileName: `${document.label} - ${artwork.title}.pdf`
    })
  }

  return (
    <>
      <Card
        size="small"
        title={document.label}
        actions={[
          <Tooltip title="Preview" placement="bottom" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="blue"
              shape="circle"
              onClick={() => setShowPreview(true)}
            >
              <HugeiconsIcon icon={FileViewIcon} size={20} />
            </Button>
          </Tooltip>,
          <Tooltip title="Download" placement="bottom" mouseEnterDelay={1} >
            <Button
              variant="text"
              color="purple"
              shape="circle"
              onClick={() => handleDownload()}
            >
              <HugeiconsIcon icon={Download01Icon} size={20} />
            </Button>
          </Tooltip>,
        ]}
        styles={{
          body: {
            backgroundColor: colors.gray[50],
          }
        }}
      >
        <img
          src={document.thumbnailUrl}
          alt={document.label}
          className="w-[150px] h-[150px] object-contain rounded shadow"
        />
      </Card>

      <DocumentPreviewDrawer
        artwork={artwork}
        document={document}
        show={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  )
}

export default DocumentCard;
