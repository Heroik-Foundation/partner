import axios from "axios";
import { deleteTokens, getTokens } from "./session";
import { toast } from "sonner";

const env = import.meta.env.DEV === true ? "dev" : "prod";

/**
 * @component @name baseInstance
 * @description Axios instance configured with the base URL for the Hiroek staging API.
 * Use this for non-authenticated requests to the API.
 *
 * @baseURL https://staging.hiroek.io/api
 *
 * @example
 * ```javascript
 * baseInstance.get('/endpoint')
 *     .then(response => console.log(response.data))
 *     .catch(error => console.error(error));
 * ```
 *
 * @param {Object} [config] - Optional Axios request configuration.
 * @returns {AxiosInstance} Configured Axios instance.
 */
const baseInstance = axios.create({
  baseURL:
    env === "dev"
      ? "https://dev.hiroek.io/api"
      : "https://staging.hiroek.io/api",
});

/**
 * @component @name authenticatedInstance
 * @description Axios instance configured for authenticated requests to the Hiroek staging API.
 * Ensure to attach valid authorization headers to access secured endpoints.
 *
 * @baseURL https://staging.hiroek.io/api
 *
 * @example
 * ```javascript
 * authenticatedInstance.get('/secure-endpoint', {
 *     headers: { Authorization: 'Bearer <token>' }
 * })
 *     .then(response => console.log(response.data))
 *     .catch(error => console.error(error));
 * ```
 *
 * @param {Object} [config] - Optional Axios request configuration.
 * @returns {AxiosInstance} Configured Axios instance.
 */
const authenticatedInstance = axios.create({
  baseURL:
    env === "dev"
      ? "https://dev.hiroek.io/api"
      : "https://staging.hiroek.io/api",
});

authenticatedInstance.interceptors.request.use(
  (config) => {
    const { sessionToken } = getTokens();

    if (sessionToken) {
      config.headers["Authorization"] = `Bearer ${sessionToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authenticatedInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;

    if (
      response?.status === 401 ||
      response?.status === 403 ||
      !response.status
    ) {
      deleteTokens();

      if (
        location.pathname.includes("/app") &&
        location.pathname !== "/login"
      ) {
        location.replace("/auth/login");
        toast.error("Authentication error: Kindly login and try again", {
          id: "authentication-error",
        });
      }

      return Promise.reject(originalRequest);
    }

    return Promise.reject(error);
  }
);

export { baseInstance, authenticatedInstance };
