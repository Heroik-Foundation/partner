import { Header } from "../global/header";
import { NotificationsList } from "./modules/notifications";

const Notifications = () => {
  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Notifications",
          position: "stacked",
          subtitle: "View your notifications.",
        }}
      />
      <NotificationsList />
    </div>
  );
};

export default Notifications;
