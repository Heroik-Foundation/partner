import { useState } from "react";
import { SearchInput } from "../../global/form";
import { Header } from "../../global/header";
import { Previews } from "./modules/preview";

const Messages = () => {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Messages",
          position: "stacked",
        }}
      />
      <SearchInput
        value={query}
        onChange={({ target }) => {
          setQuery(target.value);
        }}
        placeholder="Search Messages"
      />
      <Previews searchQuery={query} />
    </div>
  );
};

export default Messages;
