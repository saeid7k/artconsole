import { router } from "@inertiajs/react";

function useFilters(routeName: string) {

  const filtersAvailable = [
    'category',
    'location',
    'status',
    'artist',
    'medium',
    'style',
    'ownership',
    'customer',
  ];

  const filters = (() => {
    let allParams = new URLSearchParams(window.location.search);
    let filters: { [key: string]: string[] } = {};
    filtersAvailable.forEach((filter) => {
      let values = allParams.getAll(filter);
      filters[filter] = values.map((value) => value.split(',')).flat().filter((val) => val !== '');
    });
    return filters;
  })();


  // Set filter

  function setFilter(key: string, value: string[]) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', '1');

    if (value.length > 0) {
      urlParams.set(key, value.join(',').toString());
    } else {
      urlParams.delete(key);
    }

    router.get(route(routeName), Object.fromEntries(urlParams.entries()), { preserveState: true });
  }

  function setFilters(filtersObject: { [key: string]: string[] }) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', '1');

    Object.entries(filtersObject).forEach(([key, value]) => {
      if (value.length > 0) {
        urlParams.set(key, value.join(',').toString());
      } else {
        urlParams.delete(key);
      }
    });

    router.get(route(routeName), Object.fromEntries(urlParams.entries()), { preserveState: true });
  }

  // Clear filters

  function clearFilters() {
    const urlParams = new URLSearchParams(window.location.search);

    let paramsObject = Object.fromEntries(urlParams.entries());
    Object.entries(paramsObject).forEach(([key, value]) => {
      if (filtersAvailable.includes(key)) {
        delete paramsObject[key];
      }
    });
    router.get(route(routeName), paramsObject, { preserveState: false });
  }

  // Counters

  const filteredFieldsCount = Object.values(filters).filter((vals) => Array.isArray(vals) && vals.length > 0).length;

  return { filters, setFilter, setFilters, clearFilters, filteredFieldsCount };

}

export default useFilters;
