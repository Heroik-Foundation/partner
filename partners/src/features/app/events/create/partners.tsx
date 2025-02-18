import { Header } from "../../global/header";
import { SearchInput } from "../../global/form";

import { useCharityOrganizationsQuery } from "../../global/hooks/query";
import { useIntersectionObserver } from "@/hooks/observer";
import {
  CharityOrganization,
  CharityOrganizationSkeletonLoader,
} from "./modules/organization";
import { useState } from "react";
import { useEventFormStore } from "../../global/hooks/logic";

const SelectEventPartner = () => {
  const [query, setQuery] = useState("");
  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useCharityOrganizationsQuery({ searchQuery: query });
  const lastOrgRef = useIntersectionObserver<HTMLDivElement>(fetchNextPage, [
    hasNextPage,
  ]);
  const { formState, updateForm } = useEventFormStore();

  return (
    <div className="space-y-5">
      <Header
        header={{
          position: "stacked",
          title: "Charity Partner",
          subtitle: "Select to add all your charity partner(s)",
        }}
      />
      <SearchInput
        value={query}
        onChange={({ target }) => {
          setQuery(target.value);
        }}
        placeholder="Search For Charity Partner"
      />

      <div className="space-y-2.5">
        {data &&
          data.pages.map((organization, index, organizations) => (
            <CharityOrganization
              address={organization.address}
              title={organization.name}
              id={organization._id}
              thumbnail={organization.logo}
              key={index}
              formState={formState}
              updateForm={updateForm}
              nodeRef={
                organizations.length - 1 === index && !isFetchingNextPage
                  ? lastOrgRef
                  : null
              }
            />
          ))}
        {isPending || isFetchingNextPage ? (
          <>
            <CharityOrganizationSkeletonLoader />
            <CharityOrganizationSkeletonLoader />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default SelectEventPartner;
