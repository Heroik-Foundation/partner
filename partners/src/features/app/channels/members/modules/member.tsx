import { Member } from "@/features/app/global/types";

type Props = {
  nodeRef: any;
  isModerator: boolean;
} & Member;

export const ChannelMember = (props: Props) => {
  const { fullname, nodeRef, photo } = props;
  // const mutationData = {
  //   id: String(id),
  //   userId,
  //   username: fullname,
  // };
  // const { mutate: addModerator, isPending: isAddingModerator } =
  //   useAddChannelModeratorMutation(mutationData);
  // const { mutate: removeModerator, isPending: isRemovingModerator } =
  //   useRemoveChannelModeratorMutation(mutationData);

  return (
    <div className="w-full flex items-center justify-between" ref={nodeRef}>
      <div className="flex items-center space-x-2.5">
        <div className="w-10 h-10 rounded-full border-2 border-primary/15">
          <img src={photo} alt="" className="w-full h-full rounded-full" />
        </div>

        <span className="text-primary font-semibold text-sm">{fullname}</span>
      </div>

      {/* <div className="">
        {isModerator ? (
          <Button
            className="rounded-full"
            variant="destructive"
            isPending={isRemovingModerator}
            onClick={() => {
              removeModerator();
            }}
          >
            Remove
          </Button>
        ) : (
          <Button
            className="rounded-full"
            variant="secondary"
            isPending={isAddingModerator}
            onClick={() => {
              addModerator();
            }}
          >
            Add Moderator
          </Button>
        )}
      </div> */}
    </div>
  );
};

export const ChannelMemberLoader = () => (
  <div className="flex items-center justify-between p-2 animate-pulse">
    <div className="flex items-center space-x-2.5">
      <div className="h-10 w-10 rounded-full bg-gray-300" />
      <div className="h-3 w-20 rounded-full bg-gray-300" />
    </div>
    <div className="w-[140px] h-10 rounded-full bg-gray-300" />
  </div>
);
