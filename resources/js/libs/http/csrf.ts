import { http } from "./fetcher";

export async function ensureCsrfCookie() {
  await http.get("/sanctum/csrf-cookie");
}
