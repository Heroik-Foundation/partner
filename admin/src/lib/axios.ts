import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Method,
  AxiosHeaders,
} from "axios";
import { getSessionToken } from "@/helpers/session";

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  authenticated?: boolean;
  admin?: boolean;
}

const createApiInstance = (): AxiosInstance => {
  const instance = axios.create();

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const extendedConfig = config as InternalAxiosRequestConfig & {
        authenticated?: boolean;
        admin?: boolean;
      };

      const isAuthenticated = extendedConfig.authenticated !== false;
      if (isAuthenticated) {
        const sessionToken = getSessionToken();
        if (sessionToken) {
          (extendedConfig.headers as AxiosHeaders).set(
            "Authorization",
            `Bearer ${sessionToken}`
          );
        }
      }

      // Clean up
      delete extendedConfig.authenticated;
      delete extendedConfig.admin;

      return extendedConfig;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const axiosInstance = createApiInstance();

const request = <T = any>(
  method: Method,
  url: string,
  config: ExtendedAxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const { authenticated = true, admin = true, ...axiosConfig } = config;

  const baseURL = admin
    ? "https://staging.hiroek.io/api/administrator"
    : "https://staging.hiroek.io/api";

  return axiosInstance.request<T>({
    ...axiosConfig,
    method,
    url: `${baseURL}${url}`,
    // DO NOT pass authenticated/admin here — they’re handled internally
  });
};

const api = {
  get: <T = any>(url: string, config?: ExtendedAxiosRequestConfig) =>
    request<T>("GET", url, config),
  post: <T = any>(
    url: string,
    data?: any,
    config?: ExtendedAxiosRequestConfig
  ) => request<T>("POST", url, { ...config, data }),
  put: <T = any>(
    url: string,
    data?: any,
    config?: ExtendedAxiosRequestConfig
  ) => request<T>("PUT", url, { ...config, data }),
  delete: <T = any>(url: string, config?: ExtendedAxiosRequestConfig) =>
    request<T>("DELETE", url, config),
  patch: <T = any>(
    url: string,
    data?: any,
    config?: ExtendedAxiosRequestConfig
  ) => request<T>("PATCH", url, { ...config, data }),
};

export { api };
