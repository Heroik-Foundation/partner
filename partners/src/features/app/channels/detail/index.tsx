import { useParams } from "@tanstack/react-router";
import { useChannelDetailsQuery } from "../hooks/query";
import { SuspenseLoader } from "@/modules/units/page/suspense";
import { Highlight } from "./modules/highlight";
import { Header } from "../../global/header";
import { Actions } from "./modules/actions";
import { ChannelDetailTabs } from "./modules/tabs";
import { ChannelOptions } from "./modules/options";
import { truncateText } from "@/helpers/text";

const ChannelDetails = () => {
  const { id } = useParams({ strict: false }) as { id: string };

  const { data: channel } = useChannelDetailsQuery({ id });

  return (
    <div className="space-y-5 min-h-screen">
      <Header
        header={{
          title: truncateText(String(channel?.name || ""), 20) || "Channel",
          position: "inline",
        }}
        previousButtonVariant="primary"
        addOns={{
          content: (
            <>
              <ChannelOptions
                id={id}
                description={channel?.description || ""}
                title={channel?.name || ""}
                privacy={channel?.privacy || "public"}
              />
            </>
          ),
        }}
      />

      {channel && (
        <Highlight
          title={channel.name}
          members={channel.members.length}
          avatars={channel.members.map((member) => member.photo)}
          thumbnail={channel.photo}
          id={id}
        />
      )}

      {!channel && <SuspenseLoader />}

      <ChannelDetailTabs isPublic={channel?.privacy === "public"} id={id} />

      <Actions id={id} />
    </div>
  );
};

export default ChannelDetails;
