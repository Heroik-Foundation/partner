import { useParams } from "@tanstack/react-router";
import { useEventDetailsQuery } from "../../hooks/query";
import { Fragment } from "react/jsx-runtime";
import { Header } from "@/features/app/global/header";

const EventCharityPartners = () => {
  const { id } = useParams({
    strict: false,
  });

  const { data: event } = useEventDetailsQuery({
    id,
  });

  const organizations = event?.eventPledge.organizations || [];

  return (
    <Fragment>
      <Header
        header={{
          title: "Charity Partners",
          position: "inline",
        }}
      />
      <ul>
        {organizations.map((org, index) => {
          return (
            <li
              key={index}
              className="px-3 py-4 shadow rounded-2xl flex items-center justify-between space-x-2.5"
            >
              <div className="flex items-center space-x-2.5">
                <img
                  src={org.logo}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover object-center"
                />
                <div>
                  <h5 className="text-sm font-extrabold">{org.name}</h5>
                  <p className="text-xs font-bold text-black/70">
                    {org.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
};

export default EventCharityPartners;
