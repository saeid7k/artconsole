
const INVOICE_STATUSES = [
  { label: 'Draft', value: 'draft', color: 'gray', default: true },
  { label: 'Sent', value: 'sent', color: 'blue' },
  { label: 'Partially Paid', value: 'partially_paid', color: 'yellow' },
  { label: 'Paid', value: 'paid', color: 'green' },
  { label: 'Overdue', value: 'overdue', color: 'red' },
  { label: 'Void', value: 'void', color: 'black' },
];

const DEFAULT_INVOICE_STATUS = INVOICE_STATUSES.find(status => status.default) || INVOICE_STATUSES[0];

const PENDING_INVOICE_STATUSES = [
  'sent',
  'partially_paid',
  'overdue',
]

export { INVOICE_STATUSES as default, DEFAULT_INVOICE_STATUS, PENDING_INVOICE_STATUSES };
