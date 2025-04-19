import { Header } from "../global/header";
import { Setting, SettingProps } from "./modules/setting";

export const Settings = () => {
  const settings: SettingProps[] = [
    {
      title: "Notifications",
      icon: "notification",
      toggles: [
        {
          label: "Enable push notifications",
          value: false,
          setValue: (_: boolean) => {},
        },
        {
          label: "Enable email notifications",
          value: false,
          setValue: (_: boolean) => {},
        },
      ],
    },
    // {
    //   title: "Language",
    //   icon: "language",
    //   link: "/app/settings/contact",
    // },
    {
      title: "Rate our platform",
      description: "Please give us your feedback",
      icon: "thumbs",
    },
    {
      title: "Contact Support",
      description: "Please give us your feedback",
      icon: "support",
      link: "/app/settings/contact",
    },
    {
      title: "Delete Account",
      description: "Delete your account from hiroek.",
      icon: "delete",
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
    </div>
  );
};

export default Settings;
