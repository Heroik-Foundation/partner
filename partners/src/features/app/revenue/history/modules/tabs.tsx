import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Sales } from "./sales";
import { Withdrawals } from "./withdrawals";

type Tab = "sales" | "withdrawals";

const tabs = [
  {
    value: "sales",
    title: "Ticket Sales",
    component: <Sales />,
  },
  {
    value: "withdrawals",
    title: "Withdrawals",
    component: <Withdrawals />,
  },
];

export const Tabs = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>("sales");
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
                  isSelected && "text-white"
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
