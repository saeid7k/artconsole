const ARTWORK_STATUSES = [
  { label: 'Available', value: 'available', color: 'green', default: true },
  { label: 'On Hold', value: 'on_hold', color: 'orange' },
  { label: 'Sold', value: 'sold', color: 'red' },
  { label: 'In Transit', value: 'in_transit', color: 'purple' },
  { label: 'Consigned Out', value: 'consigned_out', color: 'cyan' },
];

const DEFAULT_ARTWORK_STATUS = ARTWORK_STATUSES.find(status => status.default) || ARTWORK_STATUSES[0];

export {ARTWORK_STATUSES as default, DEFAULT_ARTWORK_STATUS};
