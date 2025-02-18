import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getSessionToken } from "@/helpers/session";

const createApiInstance = (): AxiosInstance => {
  const instance = axios.create();

  instance.interceptors.request.use(
    (config) => {
      if (config.headers?.authenticated) {
        const sessionToken = getSessionToken();
        if (sessionToken) {
          config.headers["Authorization"] = `Bearer ${sessionToken}`;
        }
        delete config.headers.authenticated; // remove custom header to avoid sending it
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const apiInstance = createApiInstance();

const api = (
  url: string,
  options: {
    authenticated?: boolean;
    admin?: boolean;
  } & AxiosRequestConfig
) => {
  const baseURL = options.admin
    ? "https://staging.hiroek.io/api/administrator"
    : "https://staging.hiroek.io/api";

  return apiInstance({
    ...options,
    url: `${baseURL}${url}`,
    method: options.method,
    headers: {
      ...options.headers,
      authenticated: options.authenticated,
    },
  });
};

export { api };
