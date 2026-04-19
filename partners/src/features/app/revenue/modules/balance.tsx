import { Button } from "@/modules/ui/button";
import { useRouter } from "@tanstack/react-router";
import { Wallet2 } from "lucide-react";
import { formatCurrency } from "@/helpers/text";
import { useWalletDetailsQuery } from "../hooks/query";

export const Balance = () => {
  const { navigate } = useRouter();

  const { data: wallet } = useWalletDetailsQuery();

  const balance = wallet?.balance || 0;
  //@ts-ignore
  const bankName = wallet?.bankName || "-";
  //@ts-ignore
  const bankAccountNumber = wallet?.bankAccountNumber || "-";

  const details = [
    {
      title: "Bank Name",
      value: bankName,
    },
    {
      title: "Bank Account",
      value: bankAccountNumber,
    },
  ];

  return (
    <div className="bg-primary clear-start text-white rounded-2xl">
      <div className="space-y-3.5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold">Account balance</span>
            <h1 className="text-xl font-semibold">{formatCurrency(balance)}</h1>
          </div>

          <Wallet2 className="stroke-white fill-white/10" />
        </div>

        <div className="flex w-full justify-between">
          {details.map((detail, index) => {
            return (
              <div key={index}>
                <span className="text-[10px] text-white/75">
                  {detail.title}
                </span>
                <h5 className="text-xs font-semibold">{detail.value}</h5>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full bg-gradient-to-b from-white/10 to-white/5 p-3.5 flex items-center justify-between space-x-3.5">
        <Button
          disabled={wallet === undefined}
          className="shadow-xl bg-white/30 disabled:opacity-30 text-sm font-semibold w-full"
          onClick={() => {
            navigate({
              to: "/app/revenue/setup-account",
            });
          }}
        >
          {bankName === "-" ? "Setup account" : "Manage Account"}
        </Button>
        <Button
          className="shadow-xl bg-white/30 disabled:opacity-30 text-sm font-semibold w-full"
          onClick={() => {
            navigate({
              to: "/app/revenue/withdraw",
            });
          }}
          disabled={bankAccountNumber === "-"}
        >
          Withdraw Funds
        </Button>
      </div>
    </div>
  );
};
