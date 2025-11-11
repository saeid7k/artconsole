function formatPhoneNumber(phoneNumber: string): string {
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
  return website.replace(/^(https?:\/\/)?(www\.)?/, '');
}

export { formatPhoneNumber, trimWebsite }
