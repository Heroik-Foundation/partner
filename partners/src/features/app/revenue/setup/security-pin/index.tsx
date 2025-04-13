import { Header } from "@/features/app/global/header";
import { SecurityPinInput } from "./modules/pin-input";
import { useWalletDetailsQuery } from "../../hooks/query";

const SetupSecurityPin = () => {
  const { data: wallet } = useWalletDetailsQuery();

  const pageTitle = wallet?.owner?.pinSet
    ? "Update Security Pin"
    : "Setup Security Pin";

  return (
    <div className="space-y-10">
      <Header
        header={{
          title: pageTitle,
          subtitle: "DO NOT SHARE YOUR PIN WITH ANYONE",
          position: "stacked",
        }}
      />
      <SecurityPinInput
        pinSet={wallet?.owner?.pinSet === true ? true : false}
      />
    </div>
  );
};

export default SetupSecurityPin;
