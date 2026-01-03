import { Button } from "@/modules/ui/button";
import { Header } from "../global/header";
import { Setting, SettingProps } from "./modules/setting";
import {
  clearAllSessions,
  getAllSessions,
  removeSession,
  getActiveSession,
} from "@/lib/session";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

export const Settings = () => {
  const { navigate } = useRouter();

  const sessions = getAllSessions();
  const activeSession = getActiveSession();

  const handleLogoutAll = () => {
    clearAllSessions();
    toast.success("Logged out of all accounts");
    navigate({ to: "/auth/login" });
  };

  const handleRemoveSession = (email: string) => {
    if (sessions.length === 1) {
      clearAllSessions();
      toast.success("Logged out successfully");
      navigate({ to: "/auth/login" });
      return;
    }

    removeSession(email);

    if (activeSession?.email === email) {
      toast.success("Switched to another account");
    } else {
      toast.success("Account removed");
    }
  };

  const settings: SettingProps[] = [
    {
      title: "Contact Support",
      description: "Please give us your feedback",
      icon: "support",
      link: "/app/settings/contact",
    },
  ];

  return (
    <div>
      <Header
        header={{
          title: "App Settings",
          position: "inline",
        }}
        addOns={{
          notification: true,
        }}
      />

      <div className="space-y-2.5">
        {settings.map((setting, index) => (
          <Setting {...setting} key={index} />
        ))}
      </div>

      {sessions.length > 1 && (
        <div className="mt-8 space-y-3">
          <p className="text-sm font-medium text-foreground">
            Logged in accounts
          </p>
          {sessions.map((session) => (
            <div
              key={session.email}
              className="flex items-center justify-between rounded-lg bg-muted p-4"
            >
              <div>
                <p className="font-medium">{session.name}</p>
                <p className="text-sm text-muted-foreground">{session.email}</p>
                {activeSession?.email === session.email && (
                  <span className="text-xs text-primary">Active</span>
                )}
              </div>
              {sessions.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveSession(session.email)}
                >
                  {activeSession?.email === session.email
                    ? "Log out"
                    : "Remove"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="my-10" />

      <Button
        className="w-full"
        variant="destructive"
        onClick={handleLogoutAll}
      >
        Log out of all accounts
      </Button>
    </div>
  );
};

export default Settings;
