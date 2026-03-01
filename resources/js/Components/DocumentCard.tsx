import colors from "@/Themes/theme";
import { Download01Icon, FileViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card, Tooltip } from "antd";

type Props = {
  document: {
    label: string;
    value: string;
    thumbnailUrl?: string;
  };
}

function DocumentCard({ document }: Props) {
  return (
    <Card
      size="small"
      title={document.label}
      actions={[
        <Tooltip title="Preview" placement="bottom" mouseEnterDelay={1} >
          <Button
            variant="text"
            color="blue"
            shape="circle"
            // onClick={() => }
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
  )
}

export default DocumentCard;
