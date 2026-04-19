import { Button } from "@/modules/ui/button";
import { Header } from "../global/header";
import { Setting, SettingProps } from "./modules/setting";
import { getActiveSession, removeSession } from "@/lib/session";

export const Settings = () => {
  const session = getActiveSession();

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
      />

      <div className="space-y-2.5">
        {settings.map((setting, index) => (
          <Setting {...setting} key={index} />
        ))}
      </div>

      <div className="my-10" />

      <Button
        onClick={() => {
          removeSession(session?.email || "");
        }}
        className="w-full"
        variant={"destructive"}
      >
        Log out of this account
      </Button>
    </div>
  );
};

export default Settings;
