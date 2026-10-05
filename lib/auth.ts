// Простая защита CRM паролем. Работает и в middleware (edge), и в API.
export const AUTH_COOKIE = "mf_crm";

export async function expectedToken(): Promise<string> {
  const pass = process.env.CRM_PASSWORD || "maria2026";
  const secret = process.env.CRM_SECRET || "maria-flora-dev-secret";
  const data = new TextEncoder().encode(`${pass}::${secret}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}
