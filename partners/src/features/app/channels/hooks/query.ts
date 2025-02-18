import { authenticatedInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Channel } from "../../global/types";

type ChannelDetailsQueryProps = {
  id?: string;
};

type ChannelDetailsQueryResponse = {
  community: Channel;
};

export function useChannelDetailsQuery({ id }: ChannelDetailsQueryProps) {
  return useQuery({
    queryKey: ["channel-detail", id],
    queryFn: async () => {
      const { data } =
        await authenticatedInstance.get<ChannelDetailsQueryResponse>(
          `/communities/${id}`
        );

      return data.community;
    },
  });
}
