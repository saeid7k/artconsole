import ArtworksMassActions from "@/Components/Artworks/ArtworksMassActions"
import PageSearchBox from "@/Components/PageSearchBox"
import PageTitle from "@/Components/PageTitle"
import { ArtworkIndexProvider } from "@/contexts/ArtworksIndexContext"
import { useWindow } from "@/hooks/useWindow"
import AppLayout from "@/Layouts/AppLayout"
import { PageProps } from "@/types"
import { LocationProps } from "@/types/location"
import { deleteQueryParam, getQueryParam } from "@/utils/urlHelper"
import { GridViewIcon, TableIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { router, usePage } from "@inertiajs/react"
import { Segmented, Tooltip } from "antd"
import { useEffect, useState } from "react"
import ArtworkFormDrawer from "./Partials/ArtworkFormDrawer"
import ArtworksFilter from "./Partials/ArtworksFilter"
import ArtworksGrids from "./Partials/ArtworksGrids"
import ArtworksTable from "./Partials/ArtworksTable"

function Index({ artworks, locations }: { artworks: PageProps, locations: Array<LocationProps> }) {

  const user = usePage().props.auth.user;
  const { isMobile } = useWindow();

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

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Render

  const renderToolbar = () => (
    <div className="flex items-start gap-2 flex-wrap">

      <ArtworksMassActions selectedIds={selectedIds} />

      <ArtworksFilter />

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

      <PageSearchBox routeName="artworks.index" placeHolder="Search artworks..."/>
    </div>
  )

  return (
    <ArtworkIndexProvider value={{ selectedIds, setSelectedIds }}>
      <PageTitle title={ isMobile ? "Artworks" : "Artworks Inventory"}
        counter={artworks.total}
        createButtonDisabled={!user?.has_edit_access}
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
