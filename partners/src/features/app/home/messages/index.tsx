import { useState } from "react";
import { SearchInput } from "../../global/form";
import { Header } from "../../global/header";

const EventMessages = () => {
  const [query, setQuery] = useState("");
  return (
    <div>
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
    </div>
  );
};

export default EventMessages;
