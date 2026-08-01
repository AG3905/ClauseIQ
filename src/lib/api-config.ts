/**
 * Helper to build full backend API URLs when running frontend and backend on separate ports or domains.
 */
export function getApiUrl(path: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    '';

  if (!baseUrl) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBaseUrl}${cleanPath}`;
}
