import { ListFilter, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

interface Filter {
  options: { title: string; value: string }[];
  state: string | any;
  setState: Dispatch<SetStateAction<string | any>>;
}

export function Filter({ options, state, setState }: Filter) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="shadow px-4 py-2 rounded-lg border flex items-center text-sm font-medium space-x-2">
          <ListFilter size={16} />
          <span>Filter</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[170px]">
        {options.map((option, index) => (
          <DropdownMenuItem
            className={cn(
              "text-sm font-medium flex items-center justify-between hover:cursor-pointer"
            )}
            key={index}
            onClick={() => {
              if (state === option.value) {
                setState("");
              } else {
                setState(option.value);
              }
            }}
          >
            <span> {option.title}</span>

            {option.value === state && <Check size={10} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
