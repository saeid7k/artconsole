import { createContext, use, useContext } from "react";

const ProfileContext = createContext<any>({})

function ProfileProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return (
    <ProfileContext value={value}>
      {children}
    </ProfileContext>
  )
}

function useProfile() {
  return use(ProfileContext);
}

export { ProfileProvider, useProfile };
