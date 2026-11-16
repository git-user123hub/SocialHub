import { EllipsisHorizontalIcon, UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import DescExpander from "./DescExpander";
import ArticleActionBtns from "./ArticleActionBtns";
import BookmarkBtn from "./BookmarkBtn";
import CreationTime from "./CreationTime";
import { createServer } from "@/app/_lib/supabase/server";
import DropDownBtn from "./DropDownBtn";
import FollowBtn from "./FollowBtn";
import CommentsOvalBtn from "./CommentsOvalBtn";
import { getCommentsCount, getProfile } from "../_lib/inServer-services";
import PostImagesCorousal from "./PostImagesCorousal";
import MobileCmtsSysWrapper from "./MobileCmtsSysWrapper";
import PostCommentSection from "./PostCommentSection";
import ArticleMCmntsToggler from "./ArticleMCmntsToggler";

async function Article({ post = {}, loggedInUserId }) {
  const { created_at, post_user_id, description } = post;

  const supabase = await createServer();

  const userProfile = await getProfile(post?.post_user_id);

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

  let {
    data: postLikes,
    count: LikesCount,
    error: err1,
  } = await supabase
    .from("like_sys")
    .select("*", { count: "exact" })
    .eq("post_to_like", post?.id);

  let { data: savedPost, error: savedPostErr } = await supabase
    .from("saved_posts")
    .select("*")
    .eq("post_to_save", post.id)
    .eq("saved_by", loggedInUserId)
    .maybeSingle();

  let isSaved;

  if (savedPost) {
    isSaved = true;
  }

  if (!savedPost) {
    isSaved = false;
  }

  const { data: data, error: flwSysErr } = await supabase
    .from("follow_sys")
    .select("*")
    .eq("user_to_follow", post_user_id)
    .eq("user_following", loggedInUserId)
    .maybeSingle();

  let isFollowing;

  if (data) {
    isFollowing = true;
  }

  if (!data) {
    isFollowing = false;
  }

  let isPostOwner;

  if (loggedInUserId === post_user_id) {
    isPostOwner = true;
  }

  if (loggedInUserId !== post_user_id) {
    isPostOwner = false;
  }

  let { data: comments_sys, error: commentErr } = await supabase
    .from("comments_sys")
    .select("*")
    .eq("post_to_comment", post?.id)
    .order("created_at", { ascending: true });

  const curPostModalPath = "home";

  const additionalProps = {
    isPostOwner: isPostOwner,
    postId: post?.id,
    postOwnerId: post_user_id,
    loggedInUserId: loggedInUserId,
    isFollowing: isFollowing,
    curPostModalPath: curPostModalPath,
  };

  const commentsCount = await getCommentsCount(post?.id);

  const isPostModal = true;

  return (
    <article className="w-full py-3 mb-5">
      <>
        <div className="w-full flex items-center px-3 pb-3 gap-8">
          <div className="flex items-center flex-grow gap-2 relative">
            <Link href={`/user/${userProfile?.id}`}>
              <div className="w-[32px] h-[32px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
                {userProfile?.avatar ? (
                  <Image
                    src={userProfile?.avatar}
                    alt="article photo"
                    fill
                    sizes="468px"
                    className="rounded-md object-fill"
                    quality={100}
                    priority
                  />
                ) : (
                  <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-[1]" />
                )}
              </div>
            </Link>
            <div>
              <Link
                href={`/user/${userProfile?.id}`}
                className="text-strokeClr mr-2"
              >
                <span>{userProfile?.username}</span>
              </Link>

              <span className="text-textPryClr text-xs mr-[3px]">•</span>
              <CreationTime timesAgo={created_at} postLcl="articlePost" />
            </div>
          </div>

          {/* <div className="flex items-center gap-3 h-full flex-shrink-0"></div> */}
          <div className="flex items-center gap-3 h-8 flex-shrink-0">
            {!isPostOwner && !isFollowing && (
              <FollowBtn
                name={`${isFollowing ? "Following" : "Follow"}`}
                curProfileId={post_user_id}
                isFollowing={isFollowing}
                whichBtn="articleFollowBtn"
                curProUsername={userProfile?.username}
              />
            )}

            <DropDownBtn
              btnName={
                <EllipsisHorizontalIcon className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
              }
              ddType="article3DotsBtn"
              additionalProps={additionalProps}
              entirePostForEditPostMenu={post}
              entireProfileForEditPostMenu={userProfile}
              whichConfirmation="postDeleteConfirmation"
            />
          </div>
        </div>

        <PostImagesCorousal postImages={post?.post_images} fWType="article" />

        <div>
          <div className="flex items-center px-3 py-3 h-14">
            <div className="flex items-center gap-5 flex-grow flex-shrink-0">
              <ArticleActionBtns
                postId={post?.id}
                isLiked={isLiked}
                LikesCount={LikesCount}
                postsAllLikes={postLikes}
                postOwner={post?.post_user_id}
              />

              <CommentsOvalBtn
                from="article"
                commentsCount={commentsCount}
                postId={post?.id}
              />
            </div>

            <BookmarkBtn
              isSaved={isSaved}
              postId={post?.id}
              loggedInUserId={loggedInUserId}
            />
          </div>

          {description?.length > 0 && (
            <div className="px-3">
              <Link
                href={`/user/${post?.post_user_id}`}
                className="font-semibold mr-2 text-strokeClr"
              >
                {userProfile?.username}
              </Link>

              <DescExpander description={description} />
            </div>
          )}

          <ArticleMCmntsToggler postId={post?.id}>
            <MobileCmtsSysWrapper
              postId={post?.id}
              loggedInUserId={loggedInUserId}
              postOwnerId={post?.post_user_id}
              cmntsLength={comments_sys?.length}
              isPostModal={isPostModal}
              isInArticle={true}
            >
              {comments_sys?.length > 0 && (
                <PostCommentSection
                  commentSys={comments_sys}
                  postId={post?.id}
                  loggedInUserId={loggedInUserId}
                  isPostModal={isPostModal}
                />
              )}
            </MobileCmtsSysWrapper>
          </ArticleMCmntsToggler>
        </div>
      </>
    </article>
  );
}

export default Article;
