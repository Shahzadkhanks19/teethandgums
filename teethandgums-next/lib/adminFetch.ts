let cachedCsrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

type CsrfTokenResponse = {
  success?: boolean;
  csrfToken?: string;
  message?: string;
};

async function requestCsrfToken(): Promise<string> {
  const response = await fetch("/api/admin/csrf-token", {
    credentials: "include",
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as
    | CsrfTokenResponse
    | null;

  if (!response.ok || !data?.success || !data.csrfToken) {
    throw new Error(data?.message || "Failed to get CSRF token");
  }

  cachedCsrfToken = data.csrfToken;
  return data.csrfToken;
}

async function getCsrfToken(): Promise<string> {
  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }

  if (!csrfTokenPromise) {
    csrfTokenPromise = requestCsrfToken().finally(() => {
      csrfTokenPromise = null;
    });
  }

  return csrfTokenPromise;
}

export async function adminFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const method = options.method?.toUpperCase() || "GET";
  const isWriteRequest = ["POST", "PATCH", "PUT", "DELETE"].includes(
    method,
  );

  const executeRequest = async (retryAfterCsrfFailure: boolean) => {
    const headers = new Headers(options.headers);

    if (isWriteRequest) {
      headers.set("x-csrf-token", await getCsrfToken());
    }

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      cache: options.cache ?? "no-store",
      headers,
    });

    if (
      isWriteRequest &&
      retryAfterCsrfFailure &&
      response.status === 403
    ) {
      clearCachedCsrfToken();
      return executeRequest(false);
    }

    return response;
  };

  return executeRequest(true);
}

export function clearCachedCsrfToken() {
  cachedCsrfToken = null;
  csrfTokenPromise = null;
}
