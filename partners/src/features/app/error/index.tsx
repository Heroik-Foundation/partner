import { Button } from "@/modules/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/modules/ui/empty";
import { useNavigate } from "@tanstack/react-router";
import { AudioLines } from "lucide-react";

export const ErrorComponent = ({}: { error: any }) => {
  const navigate = useNavigate();

  const handleReload = () => {
    try {
      if (typeof window !== "undefined") {
        window.location.href = window.location.href;

        setTimeout(() => {
          window.location.replace(window.location.href);
        }, 100);

        setTimeout(() => {
          navigate({ to: window.location.pathname as any });
        }, 200);
      }
    } catch (error) {
      navigate({ to: "/auth/login" });
    }
  };

  return (
    <div className="max-w-md h-screen mx-auto flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AudioLines />
          </EmptyMedia>
          <EmptyTitle>Connection Timeout</EmptyTitle>
          <EmptyDescription>
            Your connection seems to have timed out, kindly reload the page or
            return back to the login page
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button onClick={handleReload}>Reload</Button>
            <Button
              variant="outline"
              onClick={() => {
                navigate({
                  to: "/auth/login",
                });
              }}
            >
              Log In
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
};
