import { cn } from "@/lib/utils";
import { Input } from "@/modules/ui/input";
import { Search } from "lucide-react";
import { ComponentProps } from "react";

type SearchInputProps = {
  searchIconClassName?: string;
} & ComponentProps<"input">;

export const SearchInput = (props: SearchInputProps) => {
  const { className, searchIconClassName, ...rest } = props;

  return (
    <div className="w-full relative">
      <Search
        className={cn(
          "absolute stroke-primary/50 top-4 left-2.5",
          searchIconClassName
        )}
      />
      <Input {...rest} className={cn("pl-10", className)} />
    </div>
  );
};
