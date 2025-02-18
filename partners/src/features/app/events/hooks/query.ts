import { authenticatedInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Event } from "../../global/types";

type EventDetailsQueryProps = {
  id?: string;
};

type EventDetailsQueryResponse = {
  event: Event;
};

export function useEventDetailsQuery({ id }: EventDetailsQueryProps) {
  return useQuery({
    queryKey: ["event-detail", id],
    queryFn: async () => {
      const { data } =
        await authenticatedInstance.get<EventDetailsQueryResponse>(
          `/events/${id}`
        );

      return data.event;
    },
    enabled: id !== undefined,
    staleTime: 3 * 60 * 1000,
  });
}
