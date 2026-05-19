import { ArtworkProps } from "@/types/artwork";
import { getQueryParam } from "@/utils/urlHelper";
import { Tabs, Tag } from "antd";
import ActivityLogs from "../ActivityLogs";
import FlexBox from "../Containers/FlexBox";
import NotesContainer from "../Notes/NotesContainer";
import ArtworkDocuments from "./ArtworkDocuments";
import ArtworkImages from "./ArtworkImages";
import ArtworkImageUpload from "./ArtworkImageUpload";
import ArtworkFinancial from "./Financial/Financial";

function ArtworkTabs({ artwork }: { artwork: ArtworkProps }) {

  const activeTab = getQueryParam('tab') || 'images';

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
      label:
        <FlexBox>
          <div>Notes</div>
          {(artwork.notes?.length && artwork.notes?.length > 0) ? <Tag>{artwork.notes.length}</Tag> : null}
        </FlexBox>,
      children: <NotesContainer
        modelType="artwork"
        modelId={artwork.id}
        notes={artwork.notes || []}
      />,
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
      defaultActiveKey={activeTab}
    />
  );
}

export default ArtworkTabs;
