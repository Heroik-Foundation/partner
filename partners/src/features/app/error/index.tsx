import { Button } from "@/modules/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/modules/ui/empty";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { ErrorComponentProps } from "@tanstack/react-router";

export const ErrorComponent = ({ error, reset }: ErrorComponentProps) => {
  const navigate = useNavigate();
  const router = useRouter();

  const handleReload = () => {
    reset();
    router.invalidate();
  };

  console.log(error.message);

  const handleLogin = async () => {
    try {
      await navigate({
        to: "/auth/login",
      });
    } catch (err) {
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className="max-w-md h-screen mx-auto flex items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle />
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
            <Button variant="outline" onClick={handleLogin}>
              Log In
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
};
