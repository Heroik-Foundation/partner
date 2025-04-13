import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { BankOption } from "./bank-option";
import { useState } from "react";
import { Button } from "@/modules/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useWithdrawalInitMutation } from "../hooks/mutate";
import { ActionDrawer } from "@/modules/units/page/action";
import { formatCurrency } from "@/helpers/text";
import { useWalletDetailsQuery } from "../../hooks/query";

export const WithdrawalOptions = () => {
  const { data: wallet } = useWalletDetailsQuery();
  const [amount, setAmount] = useState("");
  const { navigate } = useRouter();

  const { mutate, isPending, isError, isSuccess } = useWithdrawalInitMutation({
    amount: Number(amount),
  });

  const bankAccountName = wallet?.owner?.bankAccountName || "";
  const bankAccountNumber = wallet?.owner?.bankAccountNumber || "";

  return (
    <div className="space-y-5">
      <div>
        <Label>Amount</Label>
        <Input
          disabled={bankAccountNumber === ""}
          value={amount}
          onChange={({ target }) => {
            setAmount(target.value);
          }}
          placeholder="£0"
        />
      </div>

      <div>
        <Label>Bank Details</Label>
        <BankOption
          name={bankAccountName}
          account_number={bankAccountNumber}
          selected={true}
        />
      </div>

      <div className="w-full">
        <Button
          className="w-full"
          size="lg"
          variant="outline"
          onClick={() => {
            navigate({
              to: "/app/revenue/setup-account",
            });
          }}
        >
          <Plus />{" "}
          <span>
            {bankAccountNumber === ""
              ? "Setup Bank Account"
              : "Choose Another Bank Account"}
          </span>
        </Button>
      </div>

      <ActionDrawer
        trigger={
          <Button
            className="w-full"
            size="lg"
            disabled={amount.length < 1 || bankAccountNumber === ""}
          >
            Withdraw
          </Button>
        }
        callback={{
          fn: mutate,
          title: "Confirm",
        }}
        description="Amount would be deducted from your balance and funded in the account previously setup"
        title={{
          initial: `Are you sure you want to withdraw ${formatCurrency(Number(amount))}`,
          pending: "Processing Payment",
          error: "Payment Failed",
          success: "Withdrawal Successful",
        }}
        isError={isError}
        isPending={isPending}
        isSuccess={isSuccess}
      />
    </div>
  );
};
