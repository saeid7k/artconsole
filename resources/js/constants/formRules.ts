export const FORM_RULES = {
  phone: [
    { pattern: /^\d+$/, message: 'Phone number must be digits only' },
    { max: 20, message: 'Phone number cannot exceed 20 characters' }
  ]
}
