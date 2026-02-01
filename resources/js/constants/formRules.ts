export const FORM_RULES = {
  phone: [
    { pattern: /^\d+$/, message: 'Phone number must be digits only' },
    { max: 20, message: 'Phone number cannot exceed 20 characters' }
  ],
  title: [
    { required: true, message: 'Title is required' },
    { max: 255, message: 'Title cannot exceed 255 characters' }
  ],
  description: [
    { max: 20000, message: 'Description cannot exceed 20000 characters' }
  ],
}
