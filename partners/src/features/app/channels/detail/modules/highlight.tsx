import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type HighlightProps = {
  thumbnail: string;
  title: string;

  members: number;
  avatars: string[];
  id: string;
};

export const Highlight = (props: HighlightProps) => {
  const { thumbnail, title, avatars, members, id } = props;

  return (
    <div
      style={{
        backgroundImage: `url('${thumbnail}')`,
      }}
      className="px-4 py-10 rounded-3xl bg-no-repeat bg-cover"
    >
      <div
        className={cn(
          "p-4 bg-primary text-white rounded-2xl space-y-2.5 left-0 right-0 max-h-52 shadow-lg mx-auto w-[85%] md:max-w-xl lg:max-w-2xl text-sm"
        )}
      >
        <h1 className="font-extrabold text-lg text-center">{title}</h1>

        <Link
          to="/app/channels/$id/members"
          params={{
            id: id,
          }}
          className="w-full flex items-center justify-center"
        >
          <div className="bg-secondary/25 p-2 rounded-full inline-flex space-x-2 items-center">
            <div className="flex -space-x-2">
              {avatars.slice(0, 3).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt="Avatar"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-fill border-2 border-white"
                />
              ))}
            </div>

            <span className="text-xs sm:text-sm font-bold">
              {members} Members
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};
