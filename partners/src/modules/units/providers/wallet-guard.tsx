import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/modules/ui/button";
import { useRouter } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface WalletGuardProps {
  children: ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
  const { canAccessWallet, isLoading } = usePermissions();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!isLoading && !canAccessWallet) {
      toast.error("Wallet access is restricted to account owners.", {
        id: "wallet-access-restricted",
      });
    }
  }, [isLoading, canAccessWallet]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!canAccessWallet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
          <ShieldAlert size={36} />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-xl font-black text-primary font-axiforma">
            Access Restricted
          </h2>
          <p className="text-sm font-medium text-primary/60">
            You do not have permission to view or manage the wallet.
            Wallet and revenue operations are restricted to the account owner.
          </p>
        </div>
        <Button
          onClick={() => {
            navigate({ to: "/app" });
          }}
          className="rounded-full px-6"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
