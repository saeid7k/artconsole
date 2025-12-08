import { router } from "@inertiajs/react";

export const useSearch = (routeName: string) => {

  function handleSearch(value: string) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set('search', value);

    router.get(
      route(routeName),
      Object.fromEntries(params.entries()),
      { preserveScroll: true, preserveState: true }
    );

  }

  return { handleSearch }
}
