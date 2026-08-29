import { request } from "./fetcher";

export const api = {
  get:  <T>(url: string, params?: any) =>
    request<T>({ url, method: "GET", params }),

  post: <T>(url: string, data?: any) =>
    request<T>({ url, method: "POST", data }),

  put:  <T>(url: string, data?: any) =>
    request<T>({ url, method: "PUT", data }),

  patch:<T>(url: string, data?: any) =>
    request<T>({ url, method: "PATCH", data }),

  del:  <T>(url: string, params?: any) =>
    request<T>({ url, method: "DELETE", params }),
};
