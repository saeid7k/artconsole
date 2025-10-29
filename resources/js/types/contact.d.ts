import { Address, Business } from "./commonObjects";

export interface ContactProps {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: Address;
  website: string;
  relationship: Array<string>;
  business: Business;
  birthday: string | Date;
  full_name: string;
  abilities: { [key: string]: boolean };
  formatted_address: string;
  business_formatted_address: string;
}
