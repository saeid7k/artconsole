const PAYMENT_METHODS = [
  { value: 'check', label: 'Check', default: true },
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other', label: 'Other' }
];

const DEFAULT_PAYMENT_METHOD = PAYMENT_METHODS.find(method => method.default) || PAYMENT_METHODS[0];

export { PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD };
