import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/modules/ui/button";
import { useRouter } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface PermissionGuardProps {
  children: ReactNode;
  check: (perms: ReturnType<typeof usePermissions>) => boolean;
  title?: string;
  message?: string;
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  check,
  title = "Access Restricted",
  message = "You do not have permission to view or manage this section.",
  redirectTo = "/app",
}: PermissionGuardProps) {
  const perms = usePermissions();
  const { isLoading } = perms;
  const isAllowed = check(perms);
  const { navigate } = useRouter();

  useEffect(() => {
    if (!isLoading && !isAllowed) {
      toast.error(message, {
        id: "perm-restricted-toast",
      });
    }
  }, [isLoading, isAllowed, message]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
          <ShieldAlert size={36} />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-xl font-black text-primary font-axiforma">
            {title}
          </h2>
          <p className="text-sm font-medium text-primary/60">{message}</p>
        </div>
        <Button
          onClick={() => {
            navigate({ to: redirectTo as any });
          }}
          className="rounded-full px-6"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
