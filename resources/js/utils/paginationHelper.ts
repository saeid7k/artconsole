import { router } from "@inertiajs/react";

type PaginateProps = {
  routeName: string;
  pagination: {
    current?: number | undefined;
    pageSize?: number | undefined;
    total?: number | undefined;
  };
  filters?: Record<string, any>;
  sorter?: {
    field: string | number | undefined;
    order: 'ascend' | 'descend' | undefined;
  };
}

function paginate({routeName, pagination, filters, sorter}: PaginateProps) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('page', String(pagination.current));
  urlParams.set('per_page', String(pagination.pageSize));

  if (sorter) {
    urlParams.set('sort_by', typeof sorter?.field === 'string' ? sorter.field : String(sorter?.field ?? ''));
    urlParams.set('sort_order', sorter?.order === 'ascend' ? 'asc' : 'desc');
  }

  if (filters) {
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value && value.length > 0) {
        urlParams.set(key, String(value));
      } else {
        urlParams.delete(key);
      }
    });
  }

  router.get(
    route(routeName),
    Object.fromEntries(urlParams.entries()),
    { preserveScroll: true, preserveState: true }
  );
}

export { paginate }
