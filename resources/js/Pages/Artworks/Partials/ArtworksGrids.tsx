import { PageProps } from "@/types";
import { ArtworkProps } from "@/types/artwork";
import { router } from "@inertiajs/react";
import { Masonry, Pagination } from "antd";

function ArtworksGrids({ artworks }: { artworks?: PageProps }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-[70vh] sm:h-[75vh] overflow-y-auto">
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
          gutter={16}
          items={artworks?.data.map((a: ArtworkProps) => ({
            key: a.id,
            data: a
          }))}
          itemRender={(data) => (
            <img
              src={data.data.main_image_url}
              alt={data.data.title}
              style={{ width: "100%", display: "block", borderRadius: "8px" }}
            />
          )}
        />
      </div>
      <div className="flex justify-end">
        <Pagination
          total={artworks?.total}
          defaultCurrent={1}
          defaultPageSize={10}
          current={artworks?.current_page}
          pageSize={artworks?.per_page}
          showSizeChanger
          size="small"
          onChange={(page, per_page) => {
            router.get(route('artworks.index'), { page, per_page }, { preserveState: true });
          }}
        />
      </div>
    </div>
  )
}
export default ArtworksGrids;
