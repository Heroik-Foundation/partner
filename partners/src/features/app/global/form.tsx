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
          searchIconClassName,
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
          searchIconClassName,
        )}
        size={17}
      />
    </div>
  );
};

export const InputWithPrefixSuffix = (
  props: {
    prefixItem?: ReactNode;
    prefixItemClassName?: string;
    suffixItem?: ReactNode;
    suffixItemClassName?: string;
  } & ComponentProps<"input">,
) => {
  const {
    className,
    prefixItem,
    prefixItemClassName,
    suffixItem,
    suffixItemClassName,
    ...rest
  } = props;

  const prefixRef = useRef<HTMLDivElement>(null);
  const suffixRef = useRef<HTMLDivElement>(null);

  const [prefixWidth, setPrefixWidth] = useState(0);
  const [suffixWidth, setSuffixWidth] = useState(0);

  useLayoutEffect(() => {
    if (prefixRef.current) {
      setPrefixWidth(prefixRef.current.offsetWidth);
    } else {
      setPrefixWidth(0);
    }
  }, [prefixItem, prefixItemClassName]);

  useLayoutEffect(() => {
    if (suffixRef.current) {
      setSuffixWidth(suffixRef.current.offsetWidth);
    } else {
      setSuffixWidth(0);
    }
  }, [suffixItem, suffixItemClassName]);

  const inputPaddingLeft = prefixWidth ? `${prefixWidth + 12}px` : "0.75rem";
  const inputPaddingRight = suffixWidth ? `${suffixWidth + 12}px` : "0.75rem";

  return (
    <div className="relative w-full h-14">
      {prefixItem && (
        <div
          ref={prefixRef}
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2",
            prefixItemClassName,
          )}
        >
          {prefixItem}
        </div>
      )}

      {suffixItem && (
        <div
          ref={suffixRef}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            suffixItemClassName,
          )}
        >
          {suffixItem}
        </div>
      )}

      <Input
        {...rest}
        className={cn("border-primary/20 h-full", className)}
        style={{
          paddingLeft: inputPaddingLeft,
          paddingRight: inputPaddingRight,
        }}
      />
    </div>
  );
};

// For backward compatibility, you can also export the old name
export const InputWithPrefix = InputWithPrefixSuffix;
