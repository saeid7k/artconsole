import { createContext, useContext } from "react";

const ProfileContext = createContext<any>({})

function ProfileProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

function useProfile() {
  return useContext(ProfileContext);
}

export { ProfileProvider, useProfile };
