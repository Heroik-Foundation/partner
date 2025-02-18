import { api } from "@/lib/axios";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { AppVersion } from "@/components/table/columns/updates";

export function useContacts() {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["contacts"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(`/contacts?page=${pageParam}`, {
        method: "GET",
        admin: true,
        authenticated: true,
      });

      return data;
    },
    getNextPageParam: (lastPage) => {
      const nextPage =
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.currentPage + 1
          : null;

      return nextPage;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => page.data),
    }),
    initialData: () => {
      const queryCacheData = queryClient.getQueryState(["contacts"])?.data;
      if (queryCacheData) {
        return {
          pageParams: [undefined, 1],
          pages: [queryCacheData],
        };
      }
    },
    initialPageParam: 1,
  });
}

export function useAppVersion({ platform }: { platform: "ios" | "android" }) {
  return useQuery({
    queryKey: ["app-version", platform],
    queryFn: async () => {
      const { data } = await api(`/users/app-versions?platform=${platform}`, {
        authenticated: true,
        admin: false,
      });

      return data.versions.data as AppVersion[];
    },
  });
}

export function useAppVersionDetails({ id }: { id: string }) {
  return useQuery({
    queryKey: ["get-app-version-details", id],
    queryFn: async () => {
      const { data } = await api(`/users/get-app-version-by-id/${id}`, {
        authenticated: true,
        admin: false,
      });

      return data.appVersion as AppVersion;
    },
  });
}
