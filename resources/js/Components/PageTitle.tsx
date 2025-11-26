import { AddSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Breadcrumb, Button, Tooltip } from "antd";

type Props = {
  title?: string;
  counter?: number | null;
  toolbar?: React.ReactNode | null;
  breadcrumbItems?: {
    title: string | React.ReactNode;
  }[];
  onCreateButtonClick?: () => void;
}

function PageTitle({ title, counter = null, toolbar = null, breadcrumbItems = [], onCreateButtonClick = undefined }: Props) {
  return (
      <div
        className="flex items-center justify-between flex-wrap gap-2 px-6 pb-3 w-full grow-0"
      >
        <div>
          {breadcrumbItems.length > 0 && (
            <Breadcrumb
              items={breadcrumbItems}
              className="mb-1"
            />
          )}
          <div className="flex items-center gap-2">
            {title && <h3 className="m-0">{title}</h3>}
            {counter && <small className="text-muted font-light">({counter.toLocaleString()})</small>}
            {onCreateButtonClick && (
              <Tooltip title="Create New" mouseEnterDelay={1} >
                <Button
                  type="text"
                  shape="circle"
                  onClick={onCreateButtonClick}
                >
                  <HugeiconsIcon icon={AddSquareIcon} size={20} />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
        {toolbar && <div>{toolbar}</div>}
      </div>
  )
}

export default PageTitle
