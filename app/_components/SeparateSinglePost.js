import InPostAccount from "./InPostAccount";
import InPostConnect from "./InPostConnect";
import PostDescWithOwner from "./PostDescWithOwner";
import PostCommentSection from "./PostCommentSection";
import { createServer } from "../_lib/supabase/server";
import PostImagesCorousal from "./PostImagesCorousal";
import MobileCmtsSysWrapper from "./MobileCmtsSysWrapper";
import { Suspense } from "react";
import SSPMobileCmntsWrapper from "./SSPMobileCmntsWrapper";

async function SeparateSinglePost({
  post = [],
  userProfile,
  loggedInUser,
  isPostOwner,
  isFollowing,
  isPostModal,
  curPostModalPath,
}) {
  const { description } = post;

  const supabase = await createServer();

  let { data: comments_sys, error: commentErr } = await supabase
    .from("comments_sys")
    .select("*")
    .eq("post_to_comment", post.id)
    .order("created_at", { ascending: true });

  return (
    <div className="w-full h-full">
      <div
        className={`relative md:static w-full h-full flex justify-center items-center bg-mainClr md:border md:border-primaryHvrClr ${isPostModal ? "flex-col md:flex-row overflow-hidden md:overflow-auto" : ""}`}
      >
        <PostImagesCorousal
          fWType="modalWindowPost"
          postImages={post?.post_images}
          isPostModal={isPostModal}
        />

        <div
          className={`${isPostModal ? "w-full md:w-[60%] min-h-[300px] flex h-hStretch md:border-l md:border-l-primaryHvrClr" : "md:w-[60%] md:min-h-[300px] md:flex md:h-hStretch md:border-l md:border-l-primaryHvrClr"}`}
          style={{ height: "-webkit-fill-available" }}
        >
          <div className="w-full flex flex-col justify-between">
            <InPostAccount
              post={post}
              userProfile={userProfile}
              loggedInUser={loggedInUser}
              isPostOwner={isPostOwner}
              isFollowing={isFollowing}
              isPostModal={isPostModal}
              curPostModalPath={curPostModalPath}
            />

            <div
              className={`${isPostModal ? "h-hStretch md:h-full absolute top-[361px] md:static md:top-auto overflow-auto mb-[137px] md:mb-auto" : "absolute top-[834px] left-0 right-0 md:static md:overflow-auto md:h-full"} w-full flex flex-col px-5 text-sm`}
              style={{ scrollbarWidth: "none" }}
            >
              {!description && comments_sys.length <= 0 && (
                <div
                  className={`${isPostModal ? "w-full h-full flex justify-center items-center text-strokeClr" : "hidden md:block"} w-full h-full md:flex justify-center items-center text-strokeClr`}
                  style={{ height: "-webkit-fill-available" }}
                >
                  No comments yet
                </div>
              )}

              <>
                <SSPMobileCmntsWrapper>
                  <MobileCmtsSysWrapper
                    postId={post.id}
                    loggedInUserId={loggedInUser.id}
                    postOwnerId={post.post_user_id}
                    cmntsLength={comments_sys.length}
                    isPostModal={isPostModal}
                    isInArticle={false}
                    descLength={description?.length}
                  >
                    <>
                      {description && (
                        <PostDescWithOwner
                          description={description}
                          userProfile={userProfile}
                          isPostModal={isPostModal}
                          postCreatedAt={post?.created_at}
                        />
                      )}
                      {comments_sys.length > 0 && (
                        <PostCommentSection
                          commentSys={comments_sys}
                          postId={post.id}
                          loggedInUserId={loggedInUser.id}
                          isPostModal={isPostModal}
                        />
                      )}
                    </>
                  </MobileCmtsSysWrapper>
                </SSPMobileCmntsWrapper>
              </>
            </div>

            <Suspense fallback={null}>
              <InPostConnect
                post={post}
                loggedInUser={loggedInUser}
                userProfile={userProfile}
                isPostModal={isPostModal}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeparateSinglePost;
