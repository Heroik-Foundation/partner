import { buttonVariants } from "@/modules/ui/button";
import { Header } from "../global/header";
import { Setting, SettingProps } from "./modules/setting";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Settings = () => {
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

      <div className="my-10" />

      <Link
        className={cn(
          buttonVariants({
            variant: "secondary",
          }),
          "w-full"
        )}
        to="/app/profile/manage"
      >
        <span>Manage Accounts</span>
      </Link>
    </div>
  );
};

export default Settings;
