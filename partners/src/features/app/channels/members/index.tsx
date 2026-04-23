import { Header } from "../../global/header";
import { ChannelMembers } from "./modules/members";
import { ChannelModerators } from "./modules/moderators";

const ManageMembers = () => {
  return (
    <div className="space-y-5">
      <Header
        header={{
          position: "stacked",
          title: "Channel Members",
          subtitle: "",
        }}
      />
      <ChannelModerators />
      <ChannelMembers />
    </div>
  );
};

export default ManageMembers;
