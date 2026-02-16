const SIZE_OPTIONS = [
  { label: 'Small', value: 'small', description: '1" x 2-5/8" | 30 labels per sheet', default: true },
  { label: 'Medium', value: 'medium', description: '2" x 4" | 10 labels per sheet' },
  { label: 'Large', value: 'large', description: '3-1/3" x 4" | 6 labels per sheet' }
]

const DEFAULT_SIZE = SIZE_OPTIONS.find(option => option.default) || SIZE_OPTIONS[0];

export { SIZE_OPTIONS, DEFAULT_SIZE };
