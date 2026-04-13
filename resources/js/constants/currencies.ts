const CURRENCIES = [
    { code: 'USD', symbol: '$', title: 'United States Dollar', country_code: 'US' },
    { code: 'CAD', symbol: 'C$', title: 'Canadian Dollar', country_code: 'CA' },
    { code: 'EUR', symbol: '€', title: 'Euro', country_code: 'EU' },
    { code: 'GBP', symbol: '£', title: 'British Pound', country_code: 'GB' },
    { code: 'AUD', symbol: 'A$', title: 'Australian Dollar', country_code: 'AU' },
    { code: 'NZD', symbol: 'NZ$', title: 'New Zealand Dollar', country_code: 'NZ' },
    { code: 'JPY', symbol: '¥', title: 'Japanese Yen', country_code: 'JP' },
    { code: 'CNY', symbol: '¥', title: 'Chinese Yuan', country_code: 'CN' },
    { code: 'CHF', symbol: 'CHF', title: 'Swiss Franc', country_code: 'CH' },
];

const CURRENCIES_OPTIONS = CURRENCIES.map(currency => ({
    label: `${currency.code} (${currency.symbol}) - ${currency.title}`,
    value: currency.code
}));

function getCountryCodeByCurrency(currencyCode: string): string | null {
    const currency = CURRENCIES.find(c => c.code === currencyCode.toUpperCase());
    return currency ? currency.country_code : null;
}

export { CURRENCIES, CURRENCIES_OPTIONS, getCountryCodeByCurrency };
