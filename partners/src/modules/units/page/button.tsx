import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

export type Variants = "default" | "backlight" | "backlight-faded" | "primary";

type Props = {
  variant?: Variants;
  route?: string;
  callback?: () => void;
};

export const PreviousButton = ({ variant, route, callback }: Props) => {
  const { history, navigate } = useRouter();

  return (
    <Button
      type="button"
      className={cn(
        "bg-primary/15 h-11 w-11 min-w-11 p-3 z-10 primary-box-shadow-hidden hover:bg-primary/15",
        variant === "backlight" && "bg-white hover:bg-white",
        variant === "backlight-faded" && "bg-white/40 hover:bg-white/40",
        variant === "primary" && "bg-primary text-white hover:bg-primary/80"
      )}
      onClick={() => {
        if (callback) {
          callback();
          return;
        } else {
          if (route) {
            navigate({
              to: route,
            });
          } else {
            history.back();
          }
        }
      }}
    >
      <ChevronLeft
        className={cn(
          "stroke-primary",
          variant === "backlight-faded" && "stroke-white",
          variant === "primary" && "stroke-white"
        )}
      />
    </Button>
  );
};
