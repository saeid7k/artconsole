import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react';

export type AppContextType = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

const AppContext = createContext<AppContextType>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  toggleSidebar: () => {},
});

function AppProvider({ children }: PropsWithChildren) {
  // Read initial state from localStorage, fallback to false
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebarCollapsed');
      return stored === 'true';
    }
    return false;
  });

  // Sync sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <AppContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  return useContext(AppContext);
}

export { AppProvider as default, useApp };
