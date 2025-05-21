import { Header } from "@/features/app/global/header";
import { useParams } from "@tanstack/react-router";
import { usePostCommentsQuery, usePostDetailsQuery } from "./hooks/query";
import { UserPost, UserPostLoader } from "../modules/post";
import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";
import { UserComment, UserCommentLoader } from "./modules/comment";

const PostDetails = () => {
  const { id, postId } = useParams({
    strict: false,
  });
  const { data: user } = useUserPropertiesQuery();
  const { data: post, isPending } = usePostDetailsQuery({ id: postId });
  const { data: comments, isFetching: isFetchingComments } =
    usePostCommentsQuery({
      id: postId,
    });

  return (
    <div className="space-y-5 pb-20">
      <Header
        header={{
          position: "inline",
          title: "",
        }}
      />
      {/* <CreateComment id={postId} /> */}
      {post && <UserPost {...post} userId={user?._id} channelId={id} />}
      {isPending && <UserPostLoader />}
      {comments && (
        <div className="space-y-5 pt-2.5">
          <h4 className="text-primary/50 text-sm font-extrabold">Comments</h4>
          {comments?.pages.map((comment) => (
            <UserComment {...comment} userId={user?._id} />
          ))}
        </div>
      )}
      {isFetchingComments && (
        <>
          <UserCommentLoader />
          <UserCommentLoader />
        </>
      )}
    </div>
  );
};

export default PostDetails;
