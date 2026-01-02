import { CurrencySelect } from "@/modules/units/form/currency";
import { Header } from "../global/header";
import { Balance } from "./modules/balance";
import { TicketRevenueChart } from "./modules/revenue-chart";

const Revenue = () => {
  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Event Revenue",
          subtitle: "Manage your funds.",
          position: "stacked",
        }}
        addOns={{
          content: <CurrencySelect />,
        }}
      />

      <Balance />

      <TicketRevenueChart />
    </div>
  );
};

export default Revenue;
