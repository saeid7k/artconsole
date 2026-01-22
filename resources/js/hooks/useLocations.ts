import { LocationProps } from "@/types/location";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function useLocations({ enableQuery = true }) {

  const locationsQuery = useQuery<LocationProps[]>({
    queryKey: ['locations-query'],
    queryFn: () =>
      axios.get(route('locations.options'))
        .then(response => response.data),
    enabled: enableQuery,
  });

  const locationsOptions = (locationsQuery.data)?.map((loc) => ({
    label: loc.name + (loc.is_primary ? ' (Primary)' : ''),
    value: loc.id,
  })) || [];

  const defaultLocationValue = locationsQuery.data?.find(l => l.is_primary)?.id;

  return {
    locationsQuery,
    locationsOptions,
    defaultLocationValue,
  };
}

export default useLocations;
