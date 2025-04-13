import { ComponentProps, useState } from "react";
import { cn } from "@/lib/utils";
import { PreviousButton } from "@/modules/units/page/button";
import { Input } from "@/modules/ui/input";
import { Eye, EyeOff, Minus, Plus } from "lucide-react";
import { Button } from "@/modules/ui/button";

type FormProps = Partial<{
  title: string;
  description: string;
  previousRoute: boolean;
}> &
  ComponentProps<"form">;

type FormFooterProps = Partial<{ absolute: boolean }> & ComponentProps<"div">;

type FormCounterProps = Partial<{
  increment: () => void;
  decrement: () => void;
}> &
  ComponentProps<"input">;

export const Form = (props: FormProps) => {
  const { title, description, previousRoute, children, className, ...rest } =
    props;

  return (
    <form
      {...rest}
      className={cn(
        "space-y-5 flex flex-col items-start relative min-h-screen",
        className
      )}
    >
      {previousRoute && <PreviousButton />}
      <div className="space-y-0.5">
        {title && (
          <h1 className="font-black text-primary text-2xl font-axiforma">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-sm font-semibold text-primary/50">{description}</p>
        )}
      </div>
      {children}
    </form>
  );
};

export const FormContent = (props: ComponentProps<"div">) => {
  const { children, className, ...rest } = props;
  return (
    <div {...rest} className={cn("w-full space-y-5", className)}>
      {children}
    </div>
  );
};

export const FormFooter = (props: FormFooterProps) => {
  const { children, className, absolute = false, ...rest } = props;

  const absoluteClass = "absolute bottom-10 w-full left-0 right-0";
  return (
    <div
      {...rest}
      className={cn("w-full", absolute && absoluteClass, className)}
    >
      {children}
    </div>
  );
};

export const FormField = (props: ComponentProps<"div">) => {
  const { children, className, ...rest } = props;

  return (
    <div
      {...rest}
      className={cn("flex flex-col space-y-2 w-full text-start", className)}
    >
      {children}
    </div>
  );
};

export const FormPassword = (props: ComponentProps<"input">) => {
  const [visible, setVisibility] = useState(false);
  const { className, ...rest } = props;

  return (
    <div className="relative w-full">
      <Input
        required
        {...rest}
        className={cn("pr-10", className)}
        type={visible ? "text" : "password"}
      />
      <Button
        type="button"
        className="absolute top-2 right-2"
        size="icon"
        onClick={() => setVisibility(!visible)}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
};

export const FormCounter = (props: FormCounterProps) => {
  const { className, increment, decrement, ...rest } = props;
  return (
    <div className="w-full relative">
      <Button
        type="button"
        className="absolute top-2 left-2"
        onClick={decrement}
        size="sm"
      >
        <Minus />
      </Button>
      <Input
        {...rest}
        type="number"
        placeholder="0"
        className={cn("px-10 text-center", className)}
      />
      <Button
        type="button"
        className="absolute top-2 right-2"
        onClick={increment}
        size="sm"
      >
        <Plus />
      </Button>
    </div>
  );
};
