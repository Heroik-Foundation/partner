import { Header } from "../../global/header";
import { SupportFAQs } from "../modules/support/faq";
import { SupportLines } from "../modules/support/lines";

const Contact = () => {
  return (
    <div>
      <Header
        header={{
          title: "Contact Support",
          position: "inline",
        }}
        addOns={{
          notification: true,
        }}
      />
      <SupportLines />
      <SupportFAQs />
    </div>
  );
};

export default Contact;
