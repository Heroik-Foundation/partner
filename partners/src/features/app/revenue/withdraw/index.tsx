import { Header } from "../../global/header";
import { WithdrawalOptions } from "./modules/options";

const WithdrawRevenue = () => {
  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Withdraw Funds",
          position: "stacked",
        }}
      />
      <WithdrawalOptions />
    </div>
  );
};

export default WithdrawRevenue;
