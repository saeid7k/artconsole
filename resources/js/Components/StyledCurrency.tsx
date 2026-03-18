import { UsePageProps } from "@/types/usePage";
import { formatCurrency } from "@/utils/formatHelper";
import { usePage } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";

type Props = {
  value?: number | string | null;
  currency?: string;
  className?: string;
  children?: number | string | null;
}

function StyledCurrency({ value = null, currency, className, children = null }: Props) {

  const displayValue = value ? Number(value) : Number(children);

  const galleryCurrency = usePage<UsePageProps>().props.current_gallery?.meta?.currency
  const isNegative = displayValue < 0;

  return (
    <span
      className={twMerge(
        className,
        isNegative ? "text-red-500" : ""
      )}
    >
      {formatCurrency(displayValue, currency || galleryCurrency, 2)}
    </span>
  );
}

export default StyledCurrency;
