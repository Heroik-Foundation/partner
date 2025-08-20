import { Button } from "@/modules/ui/button";
import { UserRound } from "lucide-react";

interface Props {
  username: string;
  imageURL?: string;
}

export function ChannelRequest({ username, imageURL }: Props) {
  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center space-x-2">
        {imageURL ? (
          <img
            src={imageURL}
            className="w-10 h-10 rounded-full object-cover object-center"
          />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary">
            <UserRound size={20} />
          </div>
        )}
        <h4 className="text-xs font-bold text-primary">{username}</h4>
      </div>

      <div className="space-x-2">
        <Button
          size={"sm"}
          className="rounded-full text-xs font-bold bg-[#328330]"
        >
          Accept
        </Button>
        <Button
          size={"sm"}
          className="rounded-full text-xs font-bold bg-[#CE4646]"
        >
          Deny
        </Button>
      </div>
    </div>
  );
}
