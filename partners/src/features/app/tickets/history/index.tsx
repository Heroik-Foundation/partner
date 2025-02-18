import { SearchInput } from "../../global/form";
import { Header } from "../../global/header";

const TicketHistory = () => {
  return (
    <div>
      <Header
        header={{
          title: "Ticket Scan History",
          position: "inline",
        }}
      />
      <SearchInput placeholder="Search For Event Attendee Name" />
    </div>
  );
};

export default TicketHistory;
