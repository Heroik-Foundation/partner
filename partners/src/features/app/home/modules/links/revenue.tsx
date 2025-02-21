import { cn } from "@/lib/utils";
import { buttonVariants } from "@/modules/ui/button";
import { Link } from "@tanstack/react-router";
import { WalletCards } from "lucide-react";

export function Revenue() {
  return (
    <Link
      to="/app"
      className={cn(
        buttonVariants({
          variant: "default",
          className: "w-full h-14 bg-accent",
          size: "lg",
        })
      )}
    >
      <WalletCards />
      <p className="font-bold">Event Revenue</p>
    </Link>
  );
}
