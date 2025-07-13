import { useParams } from "@tanstack/react-router";
import { useChannelDetailsQuery } from "../hooks/query";
import { Join } from "../../events/share/modules/join";
import { truncateText } from "@/helpers/text";
import { SuspenseLoader } from "@/modules/units/page/suspense";

export const ShareChannel = () => {
  const { id } = useParams({ strict: false });

  const { data } = useChannelDetailsQuery({ id });

  if (!data) {
    return <SuspenseLoader />;
  }

  return (
    <div className="w-full max-w-sm min-h-[80vh]">
      <div className="w-full h-64 relative">
        <img src={data.photo} className="rounded-2xl w-full h-full" alt="" />

        <div className="w-[90%] rounded-xl bg-primary/85 absolute bottom-5 mx-auto left-0 right-0 text-white p-5 text-center flex flex-col items-center space-y-1.5">
          <h1 className="font-bold">{data.name}</h1>
          <p className="text-xs font-semibold">
            {truncateText(data.description, 100)}
          </p>

          <div className="bg-white/15 py-2 px-3.5 rounded-full inline-flex space-x-2 items-center">
            <div className="relative flex items-center">
              <div className="flex -space-x-2">
                {data.members.slice(0, 3).map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar.photo}
                    alt="Avatar"
                    className="w-5 h-5 rounded-full object-fill border-2 border-white"
                  />
                ))}
              </div>
            </div>
            <span className="text-xs font-bold">
              {data.members.length || 0} Members
            </span>
          </div>
        </div>
      </div>

      <Join message="Join Channel" />
    </div>
  );
};
