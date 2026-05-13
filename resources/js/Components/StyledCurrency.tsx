import { UsePageProps } from "@/types/usePage";
import { formatCurrency } from "@/utils/formatHelper";
import { usePage } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";

type Props = {
  value?: number | string | null;
  currency?: string;
  greenOnPositive?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  className?: string;
  children?: number | string | null;
}

function StyledCurrency({
  value = null,
  currency,
  greenOnPositive = false,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
  className,
  children = null,
}: Props) {

  const displayValue = value ? Number(value) : Number(children);

  const galleryCurrency = usePage<UsePageProps>().props.current_gallery?.currency
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
      {formatCurrency(displayValue, currency || galleryCurrency, minimumFractionDigits, maximumFractionDigits)}
    </span>
  );
}

export default StyledCurrency;
