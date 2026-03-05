import colors from "@/Themes/theme";
import { DocumentProps } from "@/types/document";
import { Download01Icon, FileViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card, Tooltip } from "antd";
import { useState } from "react";
import DocumentPreviewDrawer from "./DocumentPreviewDrawer";

function DocumentCard({ document }: { document: DocumentProps }) {

  const [showPreview, setShowPreview] = useState(false);

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
              // onClick={() => }
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
          className="w-[150px] h-[150px] object-cover rounded shadow"
        />
      </Card>

      <DocumentPreviewDrawer
        document={document}
        show={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  )
}

export default DocumentCard;
