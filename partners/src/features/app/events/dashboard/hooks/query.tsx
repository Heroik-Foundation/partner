import { authenticatedInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type EventStatsQueryProps = {
  id?: string;
};

type EventStatsQueryResponse = {
  stats: {
    fundRaised: number;
    fundRaisingGoal: number;
    members: number;
    pledges: number;
    ticketValues: number | null;
    tickets: number | null;
    todayDonations: number;
  };
};

export function useEventStatsQuery({ id }: EventStatsQueryProps) {
  return useQuery({
    queryKey: ["event-stats", id],
    queryFn: async () => {
      const { data } = await authenticatedInstance.get<EventStatsQueryResponse>(
        `/events/stats/${id}`
      );

      return data.stats;
    },
  });
}
