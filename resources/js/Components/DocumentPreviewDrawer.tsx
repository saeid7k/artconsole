import { useArtworkShow } from "@/contexts/ArtworkShowContext";
import { DocumentProps } from "@/types/document";
import { downloadFile } from "@/utils/downloadHelper";
import { PdfIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Divider, Drawer, Tooltip } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import FlexBox from "./Containers/FlexBox";
import LoadingSpinner from "./LoadingSpinner";
import { ArtworkProps } from "@/types/artwork";

type Props = {
  artwork: ArtworkProps;
  document?: DocumentProps | undefined;
  show: boolean;
  onClose: () => void;
}

function DocumentPreviewDrawer({ artwork, document, show, onClose }: Props) {

  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  const renderDocumentMutation = useMutation({
    mutationFn: () => axios.post(route('artworks.render-document', { artwork: artwork?.id }), {
      type: document?.value,
    }),
    onSuccess: (res: any) => {
      setHtmlContent(res.data);
    },
    onError: (err: any) => {
    }
  });

  function handleDownload() {
    if (!document) return;
    downloadFile({
      url: route('artworks.download-document', { artwork: artwork?.id, type: document.value }),
      fileName: `${document.label} - ${artwork?.title}.pdf`
    })
  }

  useEffect(() => {
    if (show && artwork) {
      renderDocumentMutation.mutate();
    } else {
      setHtmlContent(null);
    }
  }, [show, artwork]);

  // Renders

  const renderTitle = () => {
    return (
      <FlexBox wrapping="wrap" >
        {document?.label}
        <Divider orientation="vertical" />
        <div className="text-primary">{artwork?.title}</div>
      </FlexBox>
    )
  }

  const renderToolbar = () => {
    return (
      <Button
        type="primary"
        icon={<HugeiconsIcon icon={PdfIcon} size={20} />}
        onClick={handleDownload}
      >
        Download
      </Button>
    )
  }

  return (
    <Drawer
      open={show}
      onClose={onClose}
      title={renderTitle()}
      extra={renderToolbar()}
      resizable
      defaultSize={1280}
    >
      {renderDocumentMutation.isPending && (
        <LoadingSpinner size="large" className="py-20" />
      )}
      {(document && htmlContent) && (
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
          className="scale-75 xl:scale-90 origin-top-left"
        ></div>
      )}
    </Drawer>
  );
}

export default DocumentPreviewDrawer;
