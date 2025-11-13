export interface Address {
  unit: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface Business {
  name: string;
  title: string;
  address: Address;
  phone: string;
  email: string;
  website: string;
}
