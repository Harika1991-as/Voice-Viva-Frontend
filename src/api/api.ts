const BASE_URL = "http://localhost:5000/api";

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: any
): Promise<any> {
  const options: RequestInit = {
    method,
    credentials: "include",
  };

  if (body !== undefined) {
    if (body instanceof FormData) {
      options.body = body; // ✅ DO NOT SET HEADERS
    } else {
      options.headers = {
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw data || { error: "Request failed" };
  }

  return data;
}
