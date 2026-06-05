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
            `Bearer ${sessionToken}`,
          );
        }
      }

      delete extendedConfig.authenticated;
      delete extendedConfig.admin;
      return extendedConfig;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};

const axiosInstance = createApiInstance();

const isDevelopment = import.meta.env.VITE_ENVIRONMENT === "development";

const request = <T = any>(
  method: Method,
  url: string,
  config: ExtendedAxiosRequestConfig = {},
): Promise<AxiosResponse<T>> => {
  const { authenticated = true, admin = true, ...axiosConfig } = config;

  const coreURL = isDevelopment ? "dev.hiroek.io" : "staging.hiroek.io";
  const baseURL = admin
    ? `https://${coreURL}/api/administrator`
    : `https://${coreURL}/api`;

  const requestConfig: AxiosRequestConfig = {
    ...axiosConfig,
    method,
    url: `${baseURL}${url}`,
  };

  return axiosInstance.request<T>(requestConfig);
};

const api = {
  get: <T = any>(url: string, config?: ExtendedAxiosRequestConfig) =>
    request<T>("GET", url, config),

  post: <T = any>(
    url: string,
    data?: any,
    config?: ExtendedAxiosRequestConfig,
  ) => {
    const finalConfig = { ...config, data };
    return request<T>("POST", url, finalConfig);
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: ExtendedAxiosRequestConfig,
  ) => {
    const finalConfig = { ...config, data };
    return request<T>("PUT", url, finalConfig);
  },

  delete: <T = any>(url: string, config?: ExtendedAxiosRequestConfig) =>
    request<T>("DELETE", url, config),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: ExtendedAxiosRequestConfig,
  ) => {
    const finalConfig = { ...config, data };
    return request<T>("PATCH", url, finalConfig);
  },
};

export { api };
