import { UsePageProps } from "@/types/usePage";
import { formatCurrency } from "@/utils/formatHelper";
import { usePage } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";

type Props = {
  value?: number | string | null;
  currency?: string;
  greenOnPositive?: boolean;
  className?: string;
  children?: number | string | null;
}

function StyledCurrency({
  value = null,
  currency,
  greenOnPositive = false,
  className,
  children = null,
}: Props) {

  const displayValue = value ? Number(value) : Number(children);

  const galleryCurrency = usePage<UsePageProps>().props.current_gallery?.meta?.currency
  const isNegative = displayValue < 0;
  const isPositive = displayValue > 0;

  return (
    <span
      className={twMerge(
        className,
        isNegative ? "text-red-500" : "",
        greenOnPositive && isPositive ? "text-green-600 dark:text-green-500" : "",
      )}
    >
      {formatCurrency(displayValue, currency || galleryCurrency, 0, 2)}
    </span>
  );
}

export default StyledCurrency;
