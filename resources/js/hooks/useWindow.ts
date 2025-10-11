import { useEffect, useState } from 'react';

// Tailwind default breakpoints
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useWindow = () => {

  // Breakpoint

  const [breakpoint, setBreakpoint] = useState<string>('sm');

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      const keys = Object.keys(breakpoints) as (keyof typeof breakpoints)[];
      const active =
        keys.findLast((key) => width >= breakpoints[key]) ?? 'sm';
      setBreakpoint(active);
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Window Position

  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollX, setScrollX] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setScrollX(window.scrollX);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {breakpoint, scrollY, scrollX}
};
