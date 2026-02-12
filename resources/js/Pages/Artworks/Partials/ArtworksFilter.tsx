import ARTWORK_STATUSES from "@/constants/artworkStatuses";
import useFilters from "@/hooks/useFilters";
import useLocations from "@/hooks/useLocations";
import { useWindow } from "@/hooks/useWindow";
import { FilterIcon, FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Drawer, Select, Tooltip } from "antd";
import axios from "axios";
import { useState } from "react";

function ArtworksFilter() {

  const { windowWidth } = useWindow();

  const { filters, setFilter, clearFilters, filteredFieldsCount } = useFilters('artworks.index');
  const isFiltered = Object.values(filters).some((vals) => Array.isArray(vals) && vals.length > 0);

  // Fetch Artists Options

  const artistsOptionsQuery = useQuery({
    queryKey: ['artistsOptions'],
    queryFn: () => axios.get(route('galleries.artists-options')).then(res => res.data),
    enabled: true,
    retry: false,
  })

  // Locations Options from useLocations Hook

  const { locationsOptions } = useLocations({ enableQuery: true });

  // Filters Drawer

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Renders

  const renderArtistsFilter = ({className = ''}) => {
    return (
      <Select
        mode="multiple"
        options={artistsOptionsQuery.data?.map((artist: any) => ({ ...artist, value: artist.value.toString() }))}
        className={`min-w-[100px] ${className}`}
        popupMatchSelectWidth={false}
        placeholder="Artists"
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

  const renderStatusFilter = ({className = ''}) => {
    return (
      <Select
        mode="multiple"
        options={ARTWORK_STATUSES}
        className={`min-w-[100px] ${className}`}
        popupMatchSelectWidth={false}
        placeholder="Status"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('status', value ?? [])}
        value={filters.status.map(String) || []}
        loading={artistsOptionsQuery.isLoading}
      />
    )
  }

  const renderLocationsFilter = ({className = ''}) => {
    return (
      <Select
        mode="multiple"
        options={locationsOptions.map((loc) => ({ ...loc, value: loc.value.toString() }))}
        className={`min-w-[110px] ${className}`}
        popupMatchSelectWidth={false}
        placeholder="Locations"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('location', value ?? [])}
        value={filters.location.map(String) || []}
        // loading={artistsOptionsQuery.isLoading}
      />
    )
  }

  return (
    <>
      {windowWidth > 1280 && (
        <>
          {renderArtistsFilter({})}
          {renderStatusFilter({})}
          {renderLocationsFilter({})}
        </>
      )}
      <Tooltip
        title={filteredFieldsCount > 0 ? `${filteredFieldsCount} Fields are filtered` : "Filters"}
      >
        <Badge
          count={filteredFieldsCount}
          size="small"
          color='blue'
          offset={[-4,6]}
        >
          <Button
            type="text"
            shape="circle"
            icon={<HugeiconsIcon icon={FilterIcon} size={20} />}
            onClick={() => setDrawerOpen(true)}
          />
        </Badge>
      </Tooltip>

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
        <div
          className="flex flex-col gap-3"
        >
          <div>
            <div className="label">Artists</div>
            {renderArtistsFilter({className: 'w-full'})}
          </div>
          <div>
            <div className="label">Status</div>
            {renderStatusFilter({className: 'w-full'})}
          </div>
          <div>
            <div className="label">Locations</div>
            {renderLocationsFilter({className: 'w-full'})}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default ArtworksFilter;
