import axios from "axios";
import {
  getActiveSession,
  clearAllSessions,
  getAllSessions,
  removeSession,
  setActiveSession,
} from "./session";
import { toast } from "sonner";

// const isDev = import.meta.env.DEV === true;

const baseInstance = axios.create({
  baseURL: "https://staging.hiroek.io/api",
});

const authenticatedInstance = axios.create({
  baseURL: "https://staging.hiroek.io/api",
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
  async (error) => {
    const { response, config } = error;

    if (
      response?.status === 401 ||
      response?.status === 403 ||
      !response?.status
    ) {
      const currentSession = getActiveSession();
      const allSessions = getAllSessions();

      if (allSessions.length <= 1 || !currentSession) {
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

        return Promise.reject(error);
      }

      const expiredSessionName = currentSession.name;
      const expiredSessionEmail = currentSession.email;
      removeSession(expiredSessionEmail);

      const remainingSessions = getAllSessions();

      for (const session of remainingSessions) {
        const switched = setActiveSession(session.email);

        if (switched) {
          try {
            const retryConfig = {
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${session.sessionToken}`,
              },
            };

            const retryResponse =
              await authenticatedInstance.request(retryConfig);

            toast.info(
              `Session for ${expiredSessionName} expired. Switched to ${session.name}`,
              {
                id: "session-auto-switch",
                duration: 5000,
              },
            );

            return retryResponse;
          } catch (retryError: any) {
            const retryResponse = retryError.response;

            if (
              retryResponse?.status === 401 ||
              retryResponse?.status === 403 ||
              !retryResponse?.status
            ) {
              removeSession(session.email);
              continue;
            }

            return Promise.reject(retryError);
          }
        }
      }

      clearAllSessions();

      if (
        location.pathname.includes("/app") &&
        location.pathname !== "/login"
      ) {
        location.replace("/auth/login");
        toast.error("All sessions expired. Please login again", {
          id: "all-sessions-expired",
        });
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export { baseInstance, authenticatedInstance };
