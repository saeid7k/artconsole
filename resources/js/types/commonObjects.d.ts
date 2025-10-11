export interface Address {
  unit: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}

export interface Business {
  name: string;
  position: string;
  address: Address;
  phone: string;
  email: string;
  website: string;
}
