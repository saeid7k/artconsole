import { useArtworksIndex } from "@/contexts/ArtworksIndexContext";
import { getQueryParam } from "@/utils/urlHelper";
import { FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Select, Tooltip } from "antd";
import axios from "axios";

function ArtworksFilter() {

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

    const currentString = urlParams.get(key);
    const existingValues = currentString ? currentString.split(',') : [];

    const uniqueValues = Array.from(new Set([...existingValues, ...value.map(String)]));

    if (uniqueValues.length > 0) {
      urlParams.set(key, uniqueValues.join(','));
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

  return (
    <>
      <Select
        mode="multiple"
        options={artistsOptionsQuery.data}
        className="min-w-[150px]"
        placeholder="Select Artists"
        optionLabelProp="label"
        showSearch={{
          optionFilterProp: 'label',
        }}
        onChange={(value: string[]) => setFilter('artist', value)}
      />
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
    </>
  )
}

export default ArtworksFilter;
