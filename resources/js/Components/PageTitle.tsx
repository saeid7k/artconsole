import { Breadcrumb } from "antd";

type Props = {
  title?: string | null;
  counter?: number | null;
  toolbar?: React.ReactNode | null;
  breadcrumbItems?: {
    title: string | React.ReactNode;
  }[];
}

function PageTitle({ title = null, counter = null, toolbar = null, breadcrumbItems = [] }: Props) {
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
          </div>
        </div>
        {toolbar && <div>{toolbar}</div>}
      </div>
  )
}

export default PageTitle
