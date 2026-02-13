export function getApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === "undefined") return "";
  const port = process.env.NEXT_PUBLIC_API_PORT || "4000";
  return `${window.location.protocol}//${window.location.hostname}:${port}`;
}

export async function postJSON(path: string, body: any) {
  const base = getApiBase();
  const res = await fetch(
    `${base}${path.startsWith("/") ? path : `/${path}`}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    },
  );

  let json: any = null;
  try {
    json = await res.json();
  } catch (e) {
    // ignore json parse errors
  }

  return { res, json };
}
