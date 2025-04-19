import { useState } from "react";
import { SearchInput } from "../../global/form";
import { Header } from "../../global/header";
import { Messages } from "./modules/messages";

const EventMessages = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-5">
      <Header
        header={{
          position: "inline",
          title: "Event Messages",
        }}
      />
      <SearchInput
        placeholder="Search For An Event "
        value={query}
        onChange={({ target }) => {
          setQuery(target.value);
        }}
      />
      <Messages searchQuery={query} />
    </div>
  );
};

export default EventMessages;
