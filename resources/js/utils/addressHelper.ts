function formatAddress(address: any): string {
  if (!address || Object.keys(address).length === 0) {
    return '';
  }

  const parts = [];

  if (address.street) {
    parts.push(address.unit ? `${address.street} - ${address.unit}` : address.street);
  }

  if (address.city) {
    parts.push(address.city);
  }

  const province = address.province || '';
  const postal = address.postal_code || '';

  const provPostal = `${province} ${postal}`.trim();
  if (provPostal) {
    parts.push(provPostal);
  }

  if (address.country) {
    parts.push(address.country);
  }

  return parts.join(', ');
}

export { formatAddress };
