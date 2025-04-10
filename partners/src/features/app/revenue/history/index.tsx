import { Header } from "../../global/header";
import { Tabs } from "./modules/tabs";

const RevenueHistory = () => {
  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Transaction History",
          position: "inline",
        }}
      />
      <Tabs />
    </div>
  );
};

export default RevenueHistory;
