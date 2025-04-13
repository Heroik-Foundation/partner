import { cn } from "@/lib/utils";
import { Input } from "@/modules/ui/input";

import { Search, Settings2 } from "lucide-react";
import { ComponentProps, ReactNode } from "react";

type SearchInputProps = {
  searchIconClassName?: string;
} & ComponentProps<"input">;

export const SearchInput = (props: SearchInputProps) => {
  const { className, searchIconClassName, ...rest } = props;

  return (
    <div className="w-full relative h-12">
      <Search
        className={cn(
          "absolute stroke-primary/50 top-[30%] left-3",
          searchIconClassName
        )}
        size={17}
      />
      <Input
        {...rest}
        className={cn("px-8 border-primary/50 h-full", className)}
      />
      <Settings2
        className={cn(
          "absolute stroke-primary/50 top-[30%] right-3",
          searchIconClassName
        )}
        size={17}
      />
    </div>
  );
};

export const InputWithPrefix = (
  props: { prefixItem?: ReactNode } & ComponentProps<"input">
) => {
  const { className, prefixItem, ...rest } = props;

  return (
    <div className="w-full relative h-12">
      <div className="absolute top-[25%] left-3">{prefixItem}</div>
      <Input
        {...rest}
        className={cn("pl-10 border-primary/50 h-full", className)}
      />
    </div>
  );
};
