import { Address, Business } from "./commonObjects";

export interface Contact {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: Address;
  website: string;
  relationship: 'artist' | 'vendor' | 'collector' | 'other';
  business: Business;
  birthday: string | Date;
  full_name: string;
  abilities: { [key: string]: boolean };
}
