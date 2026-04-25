import CONFIGS from "@/constants/configs.json";
import { DimensionsProps } from "@/types/dimensions";
import dayjs from "dayjs";
import { formatAddress } from "./addressHelper";
import { keyToTitle, stringifyArray, stringifyObject } from "./stringHelper";

function formatByKey(key: string, value: any, galleryMeta?: any): any {
  switch (key) {
    case 'phone':
    case 'mobile':
      return formatPhoneNumber(value);
    case 'website':
    case 'url':
    case 'email':
      return trimWebsite(value);
    case 'price':
    case 'cost':
    case 'acquisition_price':
    case 'amount':
      return formatCurrency(value, galleryMeta?.currency || null);
    case 'dimensions':
      return formatDimensions({ dimensions: value, showDepth: true });
    case 'address':
      return formatAddress(value);
    case 'date':
    case 'birthday':
    case 'acquisition_date':
      return value ? dayjs(value).format('MMM D, YYYY') : '';
    default:
      return typeof value === 'object' ?
        stringifyObject(value)
        :
        (Array.isArray(value) ?
          stringifyArray(value)
          :
          (
            typeof value === 'string' ?
              keyToTitle(value)
              :
              (
                typeof value === 'boolean' ?
                  value ? 'Yes' : 'No'
                  :
                  value
              )
          ))
  }
}

function formatPhoneNumber(phoneNumber: string, countryCode: string = '+1'): string {
  if (!phoneNumber) return '';

  const cleaned = phoneNumber.replace(/\D/g, '');
  const normalized = cleaned.length === 11 && cleaned.startsWith('1') ? cleaned.slice(1) : cleaned;

  if (normalized.length === 10 && countryCode === '+1') {
    const part_1 = normalized.slice(0, 3);
    const part_2 = normalized.slice(3, 6);
    const part_3 = normalized.slice(6);
    return `${countryCode} (${part_1}) ${part_2}-${part_3}`;
  }

  return `${countryCode} ${phoneNumber}`;
}

function trimWebsite(website: string): string {
  if (!website) return '';

  return website.replace(/^(https?:\/\/)?(www\.)?/, '');
}

function formatNumber(
  value: number | string,
  locale: string = import.meta.env.VITE_APP_LOCALE.replace('_', '-') || 'en-US',
  removeTrailingZeros: boolean = true,
): string {
  if (value === null || value === undefined || value === '') return '';

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '';

  let formatted = new Intl.NumberFormat(locale).format(num);

  if (removeTrailingZeros) {
    formatted = formatted.replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/\.0+$/, '');
  }

  return formatted;
}

function formatCurrency(
  amount: number | string,
  currency: string | null = null,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2,
  locale: string = import.meta.env.VITE_APP_LOCALE.replace('_', '-') || 'en-US',
  useParensForNegatives: boolean = true
): string {
  if (amount === null || amount === undefined || amount === '') return '';

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num)) return '';

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || CONFIGS.defaults.currency || 'CAD',
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  });

  if (useParensForNegatives && num < 0) {
    return `(${formatter.format(Math.abs(num))})`;
  }

  return formatter.format(num);
}

function formatDimensions({dimensions, showDepth = false}: {dimensions?: DimensionsProps | null; showDepth?: boolean;}): string {
  if (!dimensions) {
    return '-';
  }

  const { width, height, depth, unit } = dimensions;
  const unitSymbol = unit === 'inches' ? '"' : unit === 'cm' ? ' cm' : '';
  let dimensionString = `${width}${unitSymbol} x ${height}${unitSymbol}`;
  if (showDepth && depth) {
    dimensionString += ` x ${depth}${unitSymbol}`;
  }

  return dimensionString;
}

function ucWords(str: string | null | undefined): string {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export { formatByKey, formatNumber, formatCurrency, formatDimensions, formatPhoneNumber, trimWebsite, ucWords };
