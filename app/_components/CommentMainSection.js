"use client";
import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import LikeCommentBtn from "./LikeCommentBtn";
import { useOptimistic, useState } from "react";
import CommentHalfInteractiveSection from "./CommentHalfInteractiveSection";
import { likeComment } from "../_lib/actions";
import CreationTime from "./CreationTime";

function CommentMainSection({
  children,
  id,
  avatar,
  username,
  LikesCount,
  loggedInUserId,
  comment,
  userProfile,
  postId,
  isLiked,
}) {
  const [show3Dots, setShow3Dots] = useState(false);
  const [optimisticIsLiked, optimisticLike] = useOptimistic(
    isLiked,
    (curIsLiked) => {
      return curIsLiked ? (curIsLiked = false) : (curIsLiked = true);
    },
  );
  const [optimisticLikesCount, optimisticCount] = useOptimistic(
    LikesCount,
    (curLikesCount) => {
      let finalCount;

      if (isLiked) {
        finalCount = curLikesCount - 1;
      }

      if (!isLiked) {
        finalCount = curLikesCount + 1;
      }

      return finalCount;
    },
  );

  function handleHoverEnter(e) {
    setShow3Dots(true);
  }

  function handleHoverLeave(e) {
    setShow3Dots(false);
  }

  async function handleCmntLike(likeObj) {
    optimisticLike(likeObj);
    optimisticCount();
    await likeComment(likeObj);
  }

  return (
    <>
      <div
        className={`flex gap-3 w-full mb-4`}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      >
        <Link href={`/user/${id}`} className="w-max shrink-0">
          <div className="w-[32px] h-[32px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
            {avatar ? (
              <Image
                src={avatar}
                alt="commentor's avatar image"
                fill
                sizes="468px"
                className="rounded-md object-fill"
                quality={100}
                priority
              />
            ) : (
              <UserIcon className="w-[21px] h-[21px] [&>path]:stroke-[1]" />
            )}
          </div>
        </Link>

        <div className="flex-grow flex items-center">
          <div className=" flex flex-col flex-grow">
            <div className="text-sm flex gap-1 items-center">
              <Link
                href={`/user/${id}`}
                className="font-semibold text-strokeClr"
              >
                {username}
              </Link>
              <span className="text-sm text-slate-500 flex-shrink-0">
                <CreationTime
                  timesAgo={comment?.created_at}
                  postLcl="articlePost"
                />
              </span>
            </div>
            {children}
            <CommentHalfInteractiveSection
              loggedInUserId={loggedInUserId}
              comment={comment}
              userProfile={userProfile}
              LikesCount={optimisticLikesCount}
              username={username}
              show3Dots={show3Dots}
              setShow3Dots={setShow3Dots}
            />
          </div>

          <LikeCommentBtn
            isLiked={isLiked}
            postId={postId}
            cmntId={comment.id}
            loggedInUserId={loggedInUserId}
            onClickLike={handleCmntLike}
            optimisticIsLiked={optimisticIsLiked}
            cmntPostOwnerId={comment?.commented_by}
          />
        </div>
      </div>
    </>
  );
}

export default CommentMainSection;
