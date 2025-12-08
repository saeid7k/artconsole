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
    maximumFractionDigits: maximumFractionDigits,
  }).format(num);
}

export { formatPhoneNumber, trimWebsite, formatCurrency };
