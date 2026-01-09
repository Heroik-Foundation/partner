import axios from "axios";
import { getActiveSession, clearAllSessions } from "./session";
import { toast } from "sonner";

// const isDev = import.meta.env.DEV === true;

const baseInstance = axios.create({
  baseURL: "https://dev.hiroek.io/api",

  // ? isDev
  //   ?
  //   : "https://staging.hiroek.io/api",
});

const authenticatedInstance = axios.create({
  baseURL: "https://dev.hiroek.io/api",
});

authenticatedInstance.interceptors.request.use((config) => {
  const activeSession = getActiveSession();

  if (activeSession?.sessionToken) {
    config.headers.Authorization = `Bearer ${activeSession.sessionToken}`;
  }

  return config;
});

authenticatedInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (
      response?.status === 401 ||
      response?.status === 403 ||
      !response?.status
    ) {
      clearAllSessions();

      if (
        location.pathname.includes("/app") &&
        location.pathname !== "/login"
      ) {
        location.replace("/auth/login");
        toast.error("Authentication error: Kindly login and try again", {
          id: "authentication-error",
        });
      }
    }

    return Promise.reject(error);
  }
);

export { baseInstance, authenticatedInstance };
