import { UsePageProps } from "@/types/usePage";
import { formatCurrency } from "@/utils/formatHelper";
import { usePage } from "@inertiajs/react";

type Props = {
  value?: number | string | null;
  currency?: string;
  children?: number | string | null;
}

function StyledCurrency({ value = null, currency, children = null }: Props) {

  const displayValue = value ? Number(value) : Number(children);

  const galleryCurrency = usePage<UsePageProps>().props.current_gallery?.meta?.currency
  const isNegative = displayValue < 0;

  return (
    <span
      className={isNegative ? "text-red-500" : ""}
    >
      {formatCurrency(displayValue, 2, currency || galleryCurrency)}
    </span>
  );
}

export default StyledCurrency;
