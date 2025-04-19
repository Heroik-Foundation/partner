import { EventDetails } from "./modules/event-details";
import { Header } from "./modules/header";
import { Join } from "./modules/join";

const ShareEvent = () => {
  return (
    <div className="bg-primary max-w-lg h-screen inset-0 fixed px-4 pt-8 mx-auto space-y-8 overflow-y-auto">
      <Header />
      <EventDetails />
      <Join />
    </div>
  );
};

export default ShareEvent;
