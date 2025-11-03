import { createContext, useContext } from "react";

const ContactContext = createContext<any>({})

function ContactProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  )
}

function useContact() {
  return useContext(ContactContext);
}

export { ContactProvider, useContact };
