import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { BankOption } from "./bank-option";
import { useState } from "react";
import { Button } from "@/modules/ui/button";
import { Plus } from "lucide-react";

export const WithdrawalOptions = () => {
  const [selected, setSelected] = useState<boolean>(false);
  return (
    <div className="space-y-5">
      <div>
        <Label>Amount</Label>
        <Input placeholder="£0" />
      </div>

      <div>
        <Label>Bank Details</Label>
        <BankOption
          name="Barclay's Bank"
          account_number="1234567895478"
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      <div className="w-full">
        <Button className="w-full" size="lg" variant="outline">
          <Plus /> <span>Choose Another Bank Account</span>
        </Button>
      </div>
    </div>
  );
};
