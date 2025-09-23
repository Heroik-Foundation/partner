import { cn } from "@/lib/utils";
import { Input } from "@/modules/ui/input";

import { Search, Settings2 } from "lucide-react";
import {
  ComponentProps,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

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
  props: {
    prefixItem?: ReactNode;
    prefixItemClassName?: string;
  } & ComponentProps<"input">
) => {
  const { className, prefixItem, prefixItemClassName, ...rest } = props;
  const prefixRef = useRef<HTMLDivElement>(null);
  const [prefixWidth, setPrefixWidth] = useState(0);

  useLayoutEffect(() => {
    if (prefixRef.current) {
      const width = prefixRef.current.offsetWidth;
      setPrefixWidth(width);
    } else {
      setPrefixWidth(0);
    }
  }, [prefixItem, prefixItemClassName]);

  const inputPaddingLeft = prefixWidth ? `${prefixWidth + 12}px` : "0.75rem";

  return (
    <div className="w-full relative h-12">
      {prefixItem && (
        <div
          ref={prefixRef}
          className={cn("absolute top-[25%] left-3", prefixItemClassName)}
        >
          {prefixItem}
        </div>
      )}
      <Input
        {...rest}
        className={cn("border-primary/50 h-full", className)}
        style={{ paddingLeft: inputPaddingLeft }}
      />
    </div>
  );
};
