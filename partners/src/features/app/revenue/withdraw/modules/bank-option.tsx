import { Dispatch, SetStateAction } from "react";
import { formatNumberSequence } from "../helpers/number";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  account_number: string;
  selected: boolean;
  setSelected: Dispatch<SetStateAction<boolean>>;
};

export const BankOption = (props: Props) => {
  const { name, account_number, selected, setSelected } = props;

  return (
    <button
      onClick={() => {
        setSelected(!selected);
      }}
      className="w-full bg-primary rounded-xl p-5 text-white flex items-center justify-between"
    >
      <div className="flex items-center text-sm font-bold space-x-1">
        <span>{name}</span>
        <span>
          {`(`}
          {formatNumberSequence(account_number)}
        </span>
      </div>

      <div
        className={cn(
          "transition-all rounded-full w-6 h-6 border-4 border-white",
          selected && "bg-white border-primary/50"
        )}
      />
    </button>
  );
};
