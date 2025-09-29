import { EventDetails } from "./modules/event-details";
import { Header } from "./modules/header";
import { Join } from "./modules/join";

const ShareEvent = () => {
  return (
    <div className="fixed inset-0 w-full min-h-screen bg-primary z-50 mx-auto overflow-y-auto">
      <div className="max-w-xl mx-auto space-y-8 h-full px-4 pt-8">
        <Header />
        <EventDetails />
        <Join />
      </div>
    </div>
  );
};

export default ShareEvent;
