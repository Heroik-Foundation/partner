import { useState } from "react";
import { SearchInput } from "../../global/form";
import { Header } from "../../global/header";
import { ScannedTickets } from "./modules/tickets";

const TicketHistory = () => {
  const [query, setQuery] = useState<string>("");
  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Ticket Scan History",
          position: "inline",
        }}
      />
      <SearchInput
        value={query}
        onChange={({ target }) => {
          setQuery(target.value);
        }}
        placeholder="Search For Event Attendee Name"
      />
      <ScannedTickets searchQuery={query} />
    </div>
  );
};

export default TicketHistory;
