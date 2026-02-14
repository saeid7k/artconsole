import { DimensionsProps } from "@/types/dimensions";
import { keyToTitle, stringifyArray, stringifyObject } from "./stringHelper";
import { formatAddress } from "./addressHelper";
import dayjs from "dayjs";

function formatByKey(key: string, value: any): any {
  switch (key) {
    case 'phone':
    case 'mobile':
      return formatPhoneNumber(value);
    case 'website':
    case 'url':
      return trimWebsite(value);
    case 'price':
    case 'cost':
    case 'amount':
      return formatCurrency(value);
    case 'dimensions':
      return formatDimensions({ dimensions: value, showDepth: true });
    case 'address':
      return formatAddress(value);
    case 'date':
    case 'birthday':
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

function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';

  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // remove leading 1 if present
  const normalized = cleaned.length === 11 && cleaned.startsWith('1') ? cleaned.slice(1) : cleaned;

  // Check if the input is of correct length
  const match = normalized.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumber; // Return the original input if it doesn't match the expected format
}

function trimWebsite(website: string): string {
  if (!website) return '';

  return website.replace(/^(https?:\/\/)?(www\.)?/, '');
}

function formatCurrency(amount: number | string, maximumFractionDigits: number = 2, currency: string = 'CAD', locale: string = 'en-CA'): string {
  if (amount === null || amount === undefined || amount === '') return '';

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num)) return '';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: maximumFractionDigits,
  }).format(num);
}

function formatDimensions({dimensions, showDepth = false}: {dimensions: DimensionsProps | null; showDepth?: boolean;}): string {
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

export { formatByKey, formatPhoneNumber, trimWebsite, formatCurrency, formatDimensions };
