import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "../button";
import { cn } from "@/lib/utils";

export type Variants = "default" | "backlight";

type Props = {
  variant?: Variants;
};

export const PreviousButton = ({ variant }: Props) => {
  const { history } = useRouter();

  return (
    <Button
      type="button"
      className={cn(
        "bg-primary/15 h-11 w-11 min-w-11 p-3 z-10 primary-box-shadow-hidden hover:bg-primary/15",
        variant === "backlight" && "bg-white hover:bg-white"
      )}
      onClick={() => {
        history.back();
      }}
    >
      <ChevronLeft className="stroke-primary" />
    </Button>
  );
};
