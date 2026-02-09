import PageTitle from "@/Components/PageTitle"
import { ArtworkIndexProvider } from "@/contexts/ArtworksIndexContext"
import { useSearch } from "@/hooks/useSearch"
import AppLayout from "@/Layouts/AppLayout"
import { PageProps } from "@/types"
import { LocationProps } from "@/types/location"
import { deleteQueryParam, getQueryParam } from "@/utils/urlHelper"
import { FilterRemoveIcon, GridViewIcon, KeyframesMultipleIcon, TableIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router } from "@inertiajs/react"
import { Button, Segmented, Tooltip } from "antd"
import Search from "antd/es/input/Search"
import { useEffect, useState } from "react"
import ArtworkFormDrawer from "./Partials/ArtworkFormDrawer"
import ArtworksGrids from "./Partials/ArtworksGrids"
import ArtworksTable from "./Partials/ArtworksTable"

function Index({ artworks, locations }: { artworks: PageProps, locations: Array<LocationProps> }) {

  const { handleSearch, debouncedSearch } = useSearch('artworks.index');

  // Switch Mode

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

  // Filters

  const filtersAvailable = ['category', 'location', 'status'];

  const urlFilters = (() => {
    let allParams = new URLSearchParams(window.location.search);
    let filters: { [key: string]: string[] } = {};
    filtersAvailable.forEach((filter) => {
      filters[filter] = allParams.getAll(filter);
    });
    return filters;
  })();

  const isFiltered = Object.values(urlFilters).some((vals) => vals.length > 0);

  function clearFilters() {
    const urlParams = new URLSearchParams(window.location.search);

    let paramsObject = Object.fromEntries(urlParams.entries());
    Object.entries(paramsObject).forEach(([key, value]) => {
      if (filtersAvailable.includes(key)) {
        delete paramsObject[key];
      }
    });
    router.get(route('artworks.index'), paramsObject, { preserveState: true });
  }

  // Create Drawer

  const [showCreateDrawer, setShowCreateDrawer] = useState(false)

  useEffect(() => {
    let action = getQueryParam('action');
    if (action === 'create') {
      setShowCreateDrawer(true);
      deleteQueryParam('action');
    }
  }, [])

  // Mass Actions

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

  // Render

  const renderToolbar = () => (
    <div className="flex gap-2">
      {selectedRowKeys.length > 0 && (
        <Button
          type="default"
        >
          <HugeiconsIcon icon={KeyframesMultipleIcon} size={20} />
          Mass Actions
        </Button>
      )}
      {isFiltered && (
        <Tooltip title="Clear Filters">
          <Button
            type="text"
            shape="circle"
            icon={<HugeiconsIcon icon={FilterRemoveIcon} size={20} />}
            onClick={clearFilters}
          />
        </Tooltip>
      )}
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
        onChange={(e) => debouncedSearch(e.target.value, 1000)}
      />
    </div>
  )

  return (
    <ArtworkIndexProvider value={{ filters: urlFilters, selectedRowKeys, setSelectedRowKeys }}>
      <PageTitle title="Artworks Inventory"
        counter={artworks.total}
        onCreateButtonClick={() => setShowCreateDrawer(true)}
        toolbar={renderToolbar()}
      />
      {viewMode === 'table' ? (
        <ArtworksTable artworks={artworks} locations={locations} />
      ) : (
        <ArtworksGrids artworks={artworks} />
      )}
      <ArtworkFormDrawer
        mode="create"
        show={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
      />
    </ArtworkIndexProvider>
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
