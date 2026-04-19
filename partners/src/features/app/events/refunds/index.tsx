import { Header } from "../../global/header";
import { Tabs } from "./modules/tabs";

const TicketRefunds = () => {
  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Track Refunds",
          position: "inline",
        }}
      />
      <Tabs />
    </div>
  );
};

export default TicketRefunds;
