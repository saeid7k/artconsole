import { useRef, useEffect } from 'react';
import { router } from "@inertiajs/react";

export const useSearch = (routeName: string) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch(value: string) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    router.get(
      route(routeName),
      Object.fromEntries(params.entries()),
      { preserveScroll: true, preserveState: true }
    );
  }

  function debouncedSearch(value: string, delay: number = 300) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, delay);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { handleSearch, debouncedSearch };
}
