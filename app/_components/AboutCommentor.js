import { getProfile } from "../_lib/inServer-services";
import CommentBody from "./CommentBody";
import ToggleRepliesBtn from "./ToggleRepliesBtn";
import { createServer } from "../_lib/supabase/server";
import CommentMainSection from "./CommentMainSection";
import { Suspense } from "react";

async function AboutCommentor({
  comment,
  cmtsL,
  cmtI,
  childCmts,
  postId,
  loggedInUserId,
}) {
  if (!comment) return;

  const userProfile = await getProfile(comment?.commented_by);

  if (!userProfile) return;

  const { id, username, avatar } = userProfile;

  const supabase = await createServer();

  let { data: comments_like_sys, error } = await supabase
    .from("comments_like_sys")
    .select("*")
    .eq("cmnt_to_like", comment?.id)
    .eq("cmnt_liked_by", loggedInUserId)
    .single();

  let isLiked;

  if (comments_like_sys) {
    isLiked = true;
  }

  if (!comments_like_sys) {
    isLiked = false;
  }

  let { count: LikesCount, error: err1 } = await supabase
    .from("comments_like_sys")
    .select("*", { count: "exact", head: true })
    .eq("cmnt_to_like", comment?.id);

  return (
    <div
      style={{
        marginLeft: `${comment.cmntChildLevel < 4 ? (comment?.ml === 0 ? comment?.ml : comment?.ml + 32) : 0}px`,
      }}
    >
      <CommentMainSection
        comment={comment}
        userProfile={userProfile}
        loggedInUserId={loggedInUserId}
        postId={postId}
        LikesCount={LikesCount}
        isLiked={isLiked}
        username={username}
        avatar={avatar}
        id={id}
      >
        <Suspense fallback={null}>
          <CommentBody cmtBody={comment?.comment_body} comment={comment} />
        </Suspense>
      </CommentMainSection>

      {childCmts && (
        <ToggleRepliesBtn
          cML={comment?.ml}
          chsL={childCmts?.length}
          cmndChLvl={comment?.cmntChildLevel}
        >
          <Suspense fallback={null}>
            {childCmts.map((comment, index) => {
              return (
                <AboutCommentor
                  key={comment?.id}
                  comment={comment}
                  cmtsL={childCmts?.length}
                  cmtI={index}
                  childCmts={comment?.children ? comment?.children : null}
                  cML={comment?.ml}
                  chsL={childCmts?.length}
                  postId={postId}
                  loggedInUserId={loggedInUserId}
                />
              );
            })}
          </Suspense>
        </ToggleRepliesBtn>
      )}
    </div>
  );
}

export default AboutCommentor;
