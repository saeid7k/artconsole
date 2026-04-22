import { useApp } from "@/contexts/AppContext";
import { Segmented } from "antd";

function DarkModeSwitch() {
  const { setDarkMode } = useApp();

  const handleDarkMode = (value:any) => {
    let systemIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (value == 'system') {
      setDarkMode(systemIsDark)
    } else {
      setDarkMode(value == 'dark')
    }
    localStorage.setItem('darkMode', value)
  };

  return (
    <Segmented
      options={[
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'System', value: 'system' },
      ]}
      defaultValue={localStorage.getItem('darkMode') || 'light'}
      // value={localStorage.getItem('darkMode')}
      onChange={(value) => handleDarkMode(value)}
      className="w-max"
    />
  );
}

export default DarkModeSwitch;
