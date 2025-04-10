import { Link } from "@tanstack/react-router";

export const previews = [
  {
    id: 1,
    image_url:
      "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aHVtYW4lMjBmYWNlc3xlbnwwfHwwfHx8MA%3D%3D",
    name: "Chris Doe",
    latest_message: "Can we get this event started?",
    relative_time: "28 mins ago",
    unseen_messages: 4,
  },
];

export const Previews = () => {
  return (
    <div className="space-y-2.5">
      {previews.map((preview, index) => (
        <Link
          to="/app/events/$id/messages/$id"
          key={index}
          className="flex items-center justify-between cursor-pointer"
          params={{
            id: String(preview.id),
          }}
        >
          <div className="flex items-center space-x-2">
            <img
              src={preview.image_url}
              alt={`${preview.name}'s Image`}
              loading="eager"
              className="w-10 h-10 rounded-full border-2 border-primary"
            />
            <div>
              <h5 className="text-primary font-bold">{preview.name}</h5>
              <p className="font-bold text-xs">{preview.latest_message}</p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <span className="font-extrabold text-[8px]">
              {preview.relative_time}
            </span>
            <div className="w-5 h-5 rounded-full bg-primary shadow text-white flex items-center justify-center">
              <span className="font-black text-xs">
                {" "}
                {preview.unseen_messages}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
