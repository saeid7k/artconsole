function getQueryParam(param: string): string | null {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  return params.get(param);
}

function deleteQueryParam(param: string): void {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  params.delete(param);
  const newUrl = `${url.pathname}${params.toString().length > 0 ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

function getDomain() {
  const url = new URL(window.location.href);
  return url.hostname;
}

export { deleteQueryParam, getDomain, getQueryParam };

