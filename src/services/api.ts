
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(options.headers);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include',
  });
}
