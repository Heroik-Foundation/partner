import { Header } from "./modules/header";
import { QRCodeScanner } from "./modules/qr-scanner";

const TicketScanner = () => {
  return (
    <div className="bg-primary max-w-lg h-screen inset-0 fixed px-4 py-8 mx-auto space-y-16">
      <Header />
      <QRCodeScanner />
    </div>
  );
};

export default TicketScanner;
