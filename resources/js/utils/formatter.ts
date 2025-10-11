function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-numeric characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumber; // Return the original input if it doesn't match the expected format
}

export { formatPhoneNumber }
