import { Address, Business } from "./commonObjects";

export interface Contact {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: Address;
  website: string;
  business: Business;
  birthday: string | Date;
  full_name: string;
}
