export const strapiRequest = (STRAPI_URL:string) => {
  async function request(
    endpoint: string,
    method = "GET",
    body?: unknown,
  ) {
    const response = await fetch(`${STRAPI_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result?.error?.message ||
          result?.message ||
          `Strapi request failed: ${response.status}`,
      );
    }

    return result;
  }
  return {
    request,
  };
};
