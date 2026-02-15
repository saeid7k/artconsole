const CURRENCIES = [
    { code: 'USD', symbol: '$', title: 'United States Dollar' },
    { code: 'CAD', symbol: 'C$', title: 'Canadian Dollar' },
    { code: 'EUR', symbol: '€', title: 'Euro' },
    { code: 'GBP', symbol: '£', title: 'British Pound' },
    { code: 'AUD', symbol: 'A$', title: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', title: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', title: 'Chinese Yuan' },
    { code: 'CHF', symbol: 'CHF', title: 'Swiss Franc' },
];

const CURRENCIES_OPTIONS = CURRENCIES.map(currency => ({
    label: `${currency.code} (${currency.symbol}) - ${currency.title}`,
    value: currency.code
}));

export { CURRENCIES, CURRENCIES_OPTIONS };
