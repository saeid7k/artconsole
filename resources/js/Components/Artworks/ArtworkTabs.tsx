import { ArtworkProps } from "@/types/artwork";
import { Empty, Tabs } from "antd";
import ArtworkImages from "./ArtworkImages";
import ArtworkImageUpload from "./ArtworkImageUpload";
import ActivityLogs from "../ActivityLogs";

function ArtworkTabs({ artwork }: { artwork: ArtworkProps }) {

  const items = [
    {
      key: 'images',
      label: 'Images',
      children: (
        <div className="flex flex-col lg:flex-row gap-5 items-start flex-wrap">
          {artwork.images?.length > 0 && (
            <div className="grow">
              <ArtworkImages artwork={artwork} />
            </div>
          )}
          <ArtworkImageUpload artwork={artwork} />
        </div>
      ),
    },
    {
      key: 'documents',
      label: 'Documents',
      children: <Empty description="No documents available." />,
    },
    {
      key: 'financial',
      label: 'Financial',
      children: null,
    },
    {
      key: 'history',
      label: 'History',
      children: <ActivityLogs modelType="artwork" modelId={artwork.id} key={artwork.updated_at} />,
    },
  ];

  return (
    <Tabs
      items={items}
    />
  );
}

export default ArtworkTabs;
