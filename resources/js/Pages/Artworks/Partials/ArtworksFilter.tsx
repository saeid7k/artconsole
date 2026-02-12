import { ARTWORK_CATEGORIES } from "@/constants/artworkCategories";
import ARTWORK_STATUSES from "@/constants/artworkStatuses";
import useFilters from "@/hooks/useFilters";
import useLocations from "@/hooks/useLocations";
import useTags from "@/hooks/useTags";
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

  // Filters Drawer

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch Artists Options

  const artistsOptionsQuery = useQuery({
    queryKey: ['artistsOptions'],
    queryFn: () => axios.get(route('galleries.artists-options')).then(res => res.data),
    enabled: true,
    retry: false,
  })

  // Locations Options from useLocations Hook

  const { locationsOptions } = useLocations({ enableQuery: true });

  // Tags Options from useTags Hook

  const { tags, tagsQuery } = useTags({ enabled: drawerOpen });
  const mediumsOptions = tags.filter((tag: any) => tag.type === 'medium').map((tag: any) => ({ label: tag.value, value: tag.id.toString() }));
  const stylesOptions = tags.filter((tag: any) => tag.type === 'style').map((tag: any) => ({ label: tag.value, value: tag.id.toString() }));

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

  const renderCategoryFilter = ({className = ''}) => {
    return (
      <Select
        mode="multiple"
        options={ARTWORK_CATEGORIES}
        className={`min-w-[100px] ${className}`}
        popupMatchSelectWidth={false}
        placeholder="Category"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('category', value ?? [])}
        value={filters.category.map(String) || []}
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

  const renderMediumFilter = ({className = ''}) => {
    return (
      <Select
        mode="multiple"
        options={mediumsOptions}
        className={`min-w-[110px] ${className}`}
        popupMatchSelectWidth={false}
        placeholder="Mediums"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('medium', value ?? [])}
        value={filters.medium.map(String) || []}
        loading={tagsQuery.isLoading}
      />
    )
  }

  const renderStyleFilter = ({className = ''}) => {
    return (
      <Select
        mode="multiple"
        options={stylesOptions}
        className={`min-w-[110px] ${className}`}
        popupMatchSelectWidth={false}
        placeholder="Styles"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('style', value ?? [])}
        value={filters.style.map(String) || []}
        loading={tagsQuery.isLoading}
      />
    )
  }

  return (
    <>
      {windowWidth > 1280 && (
        <>
          {renderArtistsFilter({})}
          {windowWidth > 1536 && (
            <>
              {renderLocationsFilter({})}
            </>
          )}
          {renderStatusFilter({})}
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
            <div className="label">Category</div>
            {renderCategoryFilter({className: 'w-full'})}
          </div>
          <div>
            <div className="label">Mediums</div>
            {renderMediumFilter({className: 'w-full'})}
          </div>
          <div>
            <div className="label">Styles</div>
            {renderStyleFilter({className: 'w-full'})}
          </div>
          <div>
            <div className="label">Locations</div>
            {renderLocationsFilter({className: 'w-full'})}
          </div>
          <div>
            <div className="label">Status</div>
            {renderStatusFilter({className: 'w-full'})}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default ArtworksFilter;
