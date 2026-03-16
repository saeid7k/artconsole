import { TaxProps } from "@/types/tax";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function useTaxes({ enableQuery = true }) {

  const taxesQuery = useQuery<TaxProps[]>({
    queryKey: ['taxes-query'],
    queryFn: () =>
      axios.get(route('taxes.index'))
        .then(response => response.data),
    enabled: enableQuery,
  });

  const taxesOptions = (taxesQuery.data)?.map((tax) => ({
    label: tax.name + ` (${tax.rate}%)`,
    value: tax.id,
  })) || [];

  const defaultTaxValue = taxesQuery.data?.find(t => t.default)?.id;

  return {
    taxesQuery,
    taxesOptions,
    defaultTaxValue,
  };
}

export default useTaxes;
