import { ArtworkProps } from "@/types/artwork";
import { Empty, Tabs } from "antd";
import ActivityLogs from "../ActivityLogs";
import ArtworkDocuments from "./ArtworkDocuments";
import ArtworkImages from "./ArtworkImages";
import ArtworkImageUpload from "./ArtworkImageUpload";
import ArtworkNotes from "./ArtworkNotes";
import ArtworkFinancial from "./ArtworkFinancial";

function ArtworkTabs({ artwork }: { artwork: ArtworkProps }) {

  const items = [
    {
      key: 'images',
      label: 'Images',
      children: (
        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-0 items-start flex-wrap">
          {artwork.images?.length > 0 && (
            <div className="grow w-full overflow-x-auto">
              <ArtworkImages artwork={artwork} />
            </div>
          )}
          <ArtworkImageUpload artwork={artwork} />
        </div>
      ),
    },
    {
      key: 'notes',
      label: 'Notes',
      children: <ArtworkNotes artwork={artwork} />,
    },
    {
      key: 'documents',
      label: 'Documents',
      children: <ArtworkDocuments artwork={artwork} />,
    },
    {
      key: 'financial',
      label: 'Financial',
      children: <ArtworkFinancial artwork={artwork} />,
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
      className="min-h-[300px]"
    />
  );
}

export default ArtworkTabs;
