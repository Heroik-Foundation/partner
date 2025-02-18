import { SearchInput } from "../../global/form";
import { Header } from "../../global/header";
import { Previews } from "./modules/preview";

const Messages = () => {
  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Messages",
          position: "stacked",
        }}
      />
      <SearchInput placeholder="Search Messages" />
      <Previews />
    </div>
  );
};

export default Messages;
