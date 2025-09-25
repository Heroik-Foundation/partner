import { Header } from "../../global/header";
import { SearchInput } from "../../global/form";
import { useCharityOrganizationsQuery } from "../../global/hooks/query";
import { useIntersectionObserver } from "@/hooks/observer";
import {
  CharityOrganization,
  CharityOrganizationSkeletonLoader,
} from "./modules/organization";
import { useState, useMemo } from "react";
import { useEventFormStore } from "../../global/hooks/logic";
import { motion, AnimatePresence } from "motion/react";

const SelectEventPartner = () => {
  const [query, setQuery] = useState("");
  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useCharityOrganizationsQuery({ searchQuery: query });

  const lastOrgRef = useIntersectionObserver<HTMLDivElement>(fetchNextPage, [
    hasNextPage,
  ]);

  const { formState, updateForm } = useEventFormStore();
  const selectedPartners = formState.fundRaiser?.organizations || [];

  const selectedIds = useMemo(() => {
    return selectedPartners.map((partner) => partner.id);
  }, [selectedPartners]);

  const sortedOrganizations = useMemo(() => {
    const allOrganizations = data?.pages || [];

    return allOrganizations.sort((a, b) => {
      const aIsSelected = selectedIds.includes(a._id);
      const bIsSelected = selectedIds.includes(b._id);

      if (aIsSelected && !bIsSelected) return -1;
      if (!aIsSelected && bIsSelected) return 1;
      return 0;
    });
  }, [data?.pages, selectedIds]);

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

      <motion.div className="space-y-5" layout>
        <AnimatePresence>
          {sortedOrganizations.map((organization, index, organizations) => {
            return (
              <motion.div
                key={organization._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                  duration: 0.3,
                }}
                className="mb-4"
              >
                <CharityOrganization
                  address={organization.address}
                  title={organization.name}
                  id={organization._id}
                  thumbnail={organization.logo}
                  formState={formState}
                  updateForm={updateForm}
                  nodeRef={
                    organizations.length - 1 === index && !isFetchingNextPage
                      ? lastOrgRef
                      : null
                  }
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      {isPending || isFetchingNextPage ? (
        <div className="space-y-5">
          <CharityOrganizationSkeletonLoader />
          <CharityOrganizationSkeletonLoader />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SelectEventPartner;
