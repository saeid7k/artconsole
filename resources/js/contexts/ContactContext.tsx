import { createContext, use, useContext } from "react";

const ContactContext = createContext<any>({})

function ContactProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <ContactContext value={value}>
      {children}
    </ContactContext>
  )
}

function useContact() {
  return use(ContactContext);
}

export { ContactProvider, useContact };
