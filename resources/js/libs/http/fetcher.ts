import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const http = axios.create({
  baseURL: "/", // Laravel base
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

// Optional global response handler
http.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status;

    // contoh: token/csrf/session issue
    if (status === 401) console.error("Unauthorized (401)");
    if (status === 419) console.error("CSRF expired (419)");
    if (status === 500) console.error("Server error (500)");

    return Promise.reject(err);
  }
);

/**
 * General request helper (typed)
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await http.request<T>(config);
  return res.data;
}
