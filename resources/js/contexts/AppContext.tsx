import axios from 'axios';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useRef, useState } from 'react';

export type AppContextType = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: () => void;
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  intervalData: {
    [key: string]: any;
  };
  fetchIntervalData: () => void;
};

const AppContext = createContext<AppContextType>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  toggleSidebar: () => {},
  darkMode: false,
  setDarkMode: () => {},
  intervalData: {},
  fetchIntervalData: () => {},
});

function AppProvider({ children }: PropsWithChildren) {

  const initialRender = useRef(true);

  // Sidebar collapsed state

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      let stored = localStorage.getItem('sidebarCollapsed');
      return stored === 'true';
    }
    return false;
  });

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Dark mode state

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored === 'system') {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      else {
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('darkMode');
    if (stored !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange as any);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else if (mq.removeListener) mq.removeListener(onChange as any);
    };
  }, []);

  // Interval Data

  const [intervalData, setIntervalData] = useState<object>({});

  function fetchIntervalData() {
    axios.get(route('interval-data'))
      .then(response => {
        setIntervalData(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch interval data:', error);
      });
  }

  useEffect(() => {
    if (!initialRender.current) {
      return
    }
    initialRender.current = false
    fetchIntervalData();
    const interval = setInterval(fetchIntervalData, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, toggleSidebar, darkMode, setDarkMode, intervalData, fetchIntervalData }}>
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  return useContext(AppContext);
}

export { AppProvider as default, useApp };
