const RAW_BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

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

  const url =
    API_BASE_URL && endpoint.startsWith('/') && !endpoint.startsWith('//')
      ? `${API_BASE_URL}${endpoint}`
      : endpoint;

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

export async function parseJsonResponse<T>(
  response: Response,
  fallbackMessage = 'Request failed',
): Promise<T> {
  // If response is not ok (e.g. 400, 401, 403, 404, 405, 500)
  if (!response.ok) {
    let errorMsg = fallbackMessage;

    if (typeof response.text === 'function') {
      try {
        const text = await response.text();
        const trimmed = text ? text.trim() : '';

        if (trimmed) {
          try {
            const parsed = JSON.parse(trimmed) as unknown;
            if (
              typeof parsed === 'object' &&
              parsed !== null &&
              'message' in parsed &&
              typeof parsed.message === 'string'
            ) {
              errorMsg = parsed.message;
            } else if (
              typeof parsed === 'object' &&
              parsed !== null &&
              'error' in parsed &&
              typeof parsed.error === 'string'
            ) {
              errorMsg = parsed.error;
            }
          } catch {
            // Text was not valid JSON (e.g. HTML error page)
            if (response.status === 404) {
              errorMsg =
                'API service is currently unavailable (404). Please ensure the backend server is running.';
            } else if (response.status === 405) {
              errorMsg =
                'API method not allowed (405). Please verify server route configuration.';
            } else if (response.status >= 500) {
              errorMsg =
                'Server error. Please check your backend connection.';
            }
          }
        }
      } catch {
        // Keep fallback message
      }
    } else if (typeof response.json === 'function') {
      try {
        const data = (await response.json()) as unknown;
        if (
          typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          typeof data.message === 'string'
        ) {
          errorMsg = data.message;
        }
      } catch {
        // Keep fallback message
      }
    }

    throw new Error(errorMsg);
  }

  // Response is ok (response.ok === true)
  if (typeof response.text === 'function') {
    let rawText: string;
    try {
      rawText = await response.text();
    } catch (err) {
      throw new Error(fallbackMessage, { cause: err });
    }

    const trimmed = rawText.trim();
    if (!trimmed) {
      return {} as T;
    }

    try {
      return JSON.parse(trimmed) as T;
    } catch (err) {
      throw new Error('Server returned an unexpected non-JSON response.', {
        cause: err,
      });
    }
  }

  if (typeof response.json === 'function') {
    try {
      return (await response.json()) as T;
    } catch {
      return {} as T;
    }
  }

  return {} as T;
}
