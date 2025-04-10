import { Header } from "@/features/app/global/header";
import { SecurityPinInput } from "./modules/pin-input";

const SetupSecurityPin = () => {
  return (
    <div className="space-y-10">
      <Header
        header={{
          title: "Setup Security Pin",
          subtitle: "DO NOT SHARE YOUR PIN WITH ANYONE",
          position: "stacked",
        }}
      />
      <SecurityPinInput />
    </div>
  );
};

export default SetupSecurityPin;
