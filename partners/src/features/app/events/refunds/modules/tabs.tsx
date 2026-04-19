import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PaymentRefunds } from "./payment";
import { Vouchers } from "./vouchers";

type Tab = "payments" | "vouchers";

const tabs = [
  {
    value: "payments",
    title: "Payment Refunds",
    component: <PaymentRefunds />,
  },
  {
    value: "vouchers",
    title: "Vouchers",
    component: <Vouchers />,
  },
];

export const Tabs = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>("payments");
  const currentTab = tabs.find((tab) => tab.value === selectedTab);

  return (
    <div className="space-y-5">
      <div className="w-full bg-primary/10 flex items-center justify-between rounded-xl">
        {tabs.map((tab, index) => {
          const isSelected = selectedTab === tab.value;

          return (
            <button
              key={index}
              className="w-full relative isolate p-2.5"
              onClick={() => {
                setSelectedTab(tab.value as Tab);
              }}
            >
              <span
                className={cn(
                  "relative z-10 transition-all font-bold text-sm",
                  isSelected && "text-white",
                )}
              >
                {tab.title}
              </span>
              {isSelected && (
                <motion.div
                  className="bg-primary inset-0 absolute rounded-xl"
                  layoutId="current-transaction-history-tab"
                />
              )}
            </button>
          );
        })}
      </div>

      <div>{currentTab?.component}</div>
    </div>
  );
};
