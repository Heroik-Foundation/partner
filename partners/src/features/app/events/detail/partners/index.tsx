import { useParams } from "@tanstack/react-router";
import { useEventDetailsQuery } from "../../hooks/query";
import { Fragment } from "react/jsx-runtime";
import { Header } from "@/features/app/global/header";
import { Building2 } from "lucide-react";

const EventCharityPartners = () => {
  const { id } = useParams({
    strict: false,
  });

  const { data: event } = useEventDetailsQuery({
    id,
  });

  const organizations = event?.fundRaiser.recipientCharities || [];

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
              <div className="flex items-start space-x-2.5">
                {/* {org.logo && org.logo !== "" ? (
                  <img
                    src={org.logo}
                    alt=""
                    className="min-w-16 min-h-16 rounded-xl object-cover object-center"
                  />
                ) : (
                  <div className="w-16 h-16 min-w-16 min-h-16 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                    <Building2 />
                  </div>
                )} */}
                <div>
                  <h5 className="text-sm font-extrabold">{org}</h5>
                  {/* <p className="text-xs font-bold text-black/70">
                    {org}
                  </p> */}
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
