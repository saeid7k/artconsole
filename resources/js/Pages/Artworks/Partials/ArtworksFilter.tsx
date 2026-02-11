import { useArtworksIndex } from "@/contexts/ArtworksIndexContext";
import { useWindow } from "@/hooks/useWindow";
import { FilterIcon, FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Drawer, Select, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";

function ArtworksFilter() {

  const { windowWidth } = useWindow();

  const { filters, filtersAvailable } = useArtworksIndex()
  const isFiltered = Object.values(filters).some((vals) => Array.isArray(vals) && vals.length > 0);

  // clear filters

  function clearFilters() {
    const urlParams = new URLSearchParams(window.location.search);

    let paramsObject = Object.fromEntries(urlParams.entries());
    Object.entries(paramsObject).forEach(([key, value]) => {
      if (filtersAvailable.includes(key)) {
        delete paramsObject[key];
      }
    });
    router.get(route('artworks.index'), paramsObject, { preserveState: false });
  }

  // Set filter

  function setFilter(key: string, value: string[]) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', '1');

    if (value.length > 0) {
      urlParams.set(key, value.join(',').toString());
    } else {
      urlParams.delete(key);
    }

    router.get(route('artworks.index'), Object.fromEntries(urlParams.entries()), { preserveState: true });
  }

  // Fetch Artists Options

  const artistsOptionsQuery = useQuery({
    queryKey: ['artistsOptions'],
    queryFn: () => axios.get(route('galleries.artists-options')).then(res => res.data),
    enabled: true,
    retry: false,
  })

  // Filters Drawer

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Renders

  const renderArtistsFilter = () => {
    return (
      <Select
        mode="multiple"
        options={artistsOptionsQuery.data?.map((artist: any) => ({ ...artist, value: artist.value.toString() }))}
        className="min-w-[150px]"
        placeholder="Select Artists"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('artist', value ?? [])}
        value={filters.artist.map(String) || []}
        loading={artistsOptionsQuery.isLoading}
      />
    )
  }

  return (
    <>
      {windowWidth > 1280 && (
        <>
          {renderArtistsFilter()}
        </>
      )}
      {windowWidth <= 1280 && (
        <Tooltip title="Filters">
          <Button
            type="text"
            shape="circle"
            icon={<HugeiconsIcon icon={FilterIcon} size={20} />}
            onClick={() => setDrawerOpen(true)}
          />
        </Tooltip>
      )}

      {isFiltered && (
        <Tooltip title="Clear Filters">
          <Button
            variant="text"
            shape="circle"
            color="red"
            icon={<HugeiconsIcon icon={FilterRemoveIcon} size={20} />}
            onClick={clearFilters}
          />
        </Tooltip>
      )}

      <Drawer
        title="Filters"
        placement="right"
        onClose={() => { setDrawerOpen(false) }}
        open={drawerOpen}
      >
        <div className="label">Artists</div>
        {renderArtistsFilter()}
      </Drawer>
    </>
  )
}

export default ArtworksFilter;
