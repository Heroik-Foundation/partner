import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { currencies, CurrencyCode, useCurrencyStore } from "@/stores/currency";
import { useEffect } from "react";

type Props = {
  classNames?: {
    trigger?: string;
    content?: string;
    item?: string;
  };
  initialCurrency?: CurrencyCode;
};

export function CurrencySelect(props: Props) {
  const { classNames } = props;
  const { selectedCurrency, setSelectedCurrency, getCurrencyByCode } =
    useCurrencyStore();

  useEffect(() => {
    if (props.initialCurrency) {
      const data = getCurrencyByCode(props.initialCurrency);

      if (data) {
        setSelectedCurrency(data);
      }
    }
  }, []);

  return (
    <Select
      value={selectedCurrency.value}
      onValueChange={(val) => {
        const currencyObj = currencies.find((c) => c.value === val);
        if (currencyObj)
          setSelectedCurrency({
            value: currencyObj.value,
            symbol: currencyObj.symbol,
          });
      }}
    >
      <SelectTrigger
        className={cn(
          "w-[100px] border-primary/20 border-2 rounded-xl",
          classNames?.trigger,
        )}
      >
        <SelectValue placeholder="Select wallet" />
      </SelectTrigger>

      <SelectContent className={classNames?.content}>
        {currencies.map((currency) => (
          <SelectItem
            className={classNames?.item}
            key={currency.value}
            value={currency.value}
          >
            <div className="flex items-center gap-3">
              <img
                src={currency.flag}
                alt={currency.code}
                width={20}
                height={15}
                className="rounded-sm object-cover"
              />
              <span className="text-xs font-semibold uppercase">
                {currency.code}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
