import PageTitle from "@/Components/PageTitle"
import { useSearch } from "@/hooks/useSearch"
import AppLayout from "@/Layouts/AppLayout"
import { PageProps } from "@/types"
import { LocationProps } from "@/types/location"
import { GridViewIcon, TableIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Segmented, Tooltip } from "antd"
import Search from "antd/es/input/Search"
import { useState } from "react"
import ArtworksGrids from "./Partials/ArtworksGrids"
import ArtworksTable from "./Partials/ArtworksTable"
import { router } from "@inertiajs/react"

function Index({ artworks, locations }: { artworks: PageProps, locations: Array<LocationProps> }) {

  const { handleSearch } = useSearch('artworks.index');

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  function switchViewMode(mode: 'table' | 'grid') {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', '1');
    urlParams.set('per_page', mode == 'grid' ? '50' : '10');
    if (mode == 'grid') {
      urlParams.delete('sort_by');
      urlParams.delete('sort_order');
    }
    router.get(route('artworks.index'), Object.fromEntries(urlParams.entries()), { preserveState: true });
    setViewMode(mode);
  }

  return (
    <div>
      <PageTitle
        title="Artworks Inventory"
        counter={artworks.total}
        // onCreateButtonClick={() => {}}
        toolbar={
          <div className="flex gap-2">
            <Segmented
              options={[
                {
                  label: (
                    <Tooltip title="Table View" mouseEnterDelay={1}>
                      <div className="flex h-[28px] items-center"><HugeiconsIcon icon={TableIcon} size={20} /></div>
                    </Tooltip>
                  ),
                  value: 'table'
                },
                {
                  label: (
                    <Tooltip title="Grid View" mouseEnterDelay={1}>
                      <div className="flex h-[28px] items-center"><HugeiconsIcon icon={GridViewIcon} size={20} /></div>
                    </Tooltip>
                  ),
                  value: 'grid'
                },
              ]}
              onChange={(value) => switchViewMode(value as 'table' | 'grid')}
            />
            <Search
              placeholder="search artworks..."
              style={{ width: 200 }}
              size="middle"
              allowClear
              onSearch={handleSearch}
            />
          </div>
        }
      />
      {viewMode === 'table' ? (
        <ArtworksTable artworks={artworks} locations={locations} />
      ) : (
        <ArtworksGrids artworks={artworks} />
      )}
    </div>
  )
}

Index.layout = (page: any) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Index
