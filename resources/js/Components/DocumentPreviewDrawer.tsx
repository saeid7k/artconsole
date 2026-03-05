import { useArtworkShow } from "@/contexts/ArtworkShowContext";
import { DocumentProps } from "@/types/document";
import { useMutation } from "@tanstack/react-query";
import { Divider, Drawer } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import FlexBox from "./Containers/FlexBox";

type Props = {
  document: DocumentProps;
  show: boolean;
  onClose: () => void;
}

function DocumentPreviewDrawer({ document, show, onClose }: Props) {

  const { artwork } = useArtworkShow()
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  const renderDocumentMutation = useMutation({
    mutationFn: () => axios.post(route('artworks.render-document', { artwork: artwork?.id }), {
      type: document.value,
    }),
    onSuccess: (res: any) => {
      setHtmlContent(res.data);
    },
    onError: (err: any) => {
    }
  });

  useEffect(() => {
    if (show && artwork) {
      renderDocumentMutation.mutate();
    } else {
      setHtmlContent(null);
    }
  }, [show, artwork]);

  return (
    <Drawer
      open={show}
      onClose={onClose}
      title={<FlexBox>{document?.label}<Divider orientation="vertical" /><div className="text-primary">{artwork?.title}</div></FlexBox>}
      resizable
      defaultSize={1280}
    >
      <div
        // className="h-[70vh] overflow-auto"
      >
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
          className="scale-75 xl:scale-90 origin-top-left"
        ></div>
      </div>
    </Drawer>
  );
}

export default DocumentPreviewDrawer;
