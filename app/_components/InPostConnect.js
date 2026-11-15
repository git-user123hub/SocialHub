import ArticleActionBtns from "./ArticleActionBtns";
import BookmarkBtn from "./BookmarkBtn";
import { createServer } from "../_lib/supabase/server";
import CommentsOvalBtn from "./CommentsOvalBtn";
import {
  getCommentsCount,
  getPostLikesWithCounts,
  getProfile,
} from "../_lib/inServer-services";
import SecondInputHidder from "./SecondInputHidder";
import PostCnctCreationTimeWrapper from "./PostCnctCreationTimeWrapper";

async function InPostConnect({ post = [], loggedInUser, isPostModal }) {
  const loggedInUserId = loggedInUser?.id;
  const supabase = await createServer();

  const { data: loggedInUserProfile, error: profileErr } =
    await getProfile(loggedInUserId);

  if (profileErr) {
    console.log(profileErr.message);
    return;
  }

  const avatar = loggedInUserProfile?.avatar;

  let { data: like_sys, error } = await supabase
    .from("like_sys")
    .select("*")
    .eq("post_to_like", post?.id)
    .eq("liked_by", loggedInUserId)
    .maybeSingle();

  let isLiked;

  if (like_sys) {
    isLiked = true;
  }

  if (!like_sys) {
    isLiked = false;
  }

  const { postLikes, LikesCount } = await getPostLikesWithCounts(post?.id);

  let { data: savedPost, error: savedPostErr } = await supabase
    .from("saved_posts")
    .select("*")
    .eq("post_to_save", post?.id)
    .eq("saved_by", loggedInUserId)
    .maybeSingle();

  let isSaved;

  if (savedPost) {
    isSaved = true;
  }

  if (!savedPost) {
    isSaved = false;
  }

  const commentsCount = await getCommentsCount(post?.id);

  return (
    <div
      className={`w-full flex flex-col px-5 py-2 ${isPostModal ? "border-t border-t-primaryHvrClr absolute bottom-0 left-0 right-0 md:static md:top-auto md:right-auto md:left-auto bg-mainClr md:bg-auto" : "absolute top-[592px] left-0 right-0 md:static md:top-auto md:right-auto md:left-auto md:border-t md:border-t-primaryHvrClr"}`}
    >
      <div className="w-full flex flex-col gap-1">
        <div className="flex items-center w-full">
          <div className="flex items-center gap-5 flex-grow">
            <ArticleActionBtns
              isLiked={isLiked}
              postId={post.id}
              LikesCount={LikesCount}
              postsAllLikes={postLikes}
              loggedInUserId={loggedInUserId}
              postOwner={post.post_user_id}
            />

            <CommentsOvalBtn
              postId={post.id}
              from="post"
              commentsCount={commentsCount}
              isPostModal={isPostModal}
            />
          </div>

          <BookmarkBtn
            isSaved={isSaved}
            postId={post.id}
            loggedInUserId={loggedInUserId}
          />
        </div>

        <PostCnctCreationTimeWrapper
          isPostModal={isPostModal}
          PostCreatedAt={post?.created_at}
          inWhichPostPart="InPostConnect"
        />
      </div>

      <SecondInputHidder
        isPostModal={isPostModal}
        avatar={avatar}
        postId={post.id}
        loggedInUserId={loggedInUserId}
        postOwnerId={post.post_user_id}
        layoutKey="InPostConnectLayout"
      />
    </div>
  );
}

export default InPostConnect;
