"use client";

import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useOptimistic, useTransition } from "react";
import { likePost } from "../_lib/actions";
import { useMainContext } from "./MainContext";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

function ArticleActionBtns({
  isLiked,
  postId,
  LikesCount,
  postsAllLikes,
  postOwner,
}) {
  const { curUser } = useMainContext();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
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

  async function handleClick(e) {
    e.preventDefault();

    startTransition(async () => {
      const likeObj = {
        postId: postId,
        curUserId: curUser.id,
        curPath: pathname,
        like_post_onwer: postOwner,
      };

      optimisticCount();
      optimisticLike(likeObj);
      const postLikeUnlike = await likePost(likeObj);

      if (postLikeUnlike.success) {
        if (postLikeUnlike?.likeData) {
          toast.success("Post liked");
        }
      }

      if (!postLikeUnlike.success) {
        toast.error("Something Went Wrong. Please Try Again Later.");
      }
    });
  }

  return (
    <button
      className={`flex items-center gap-1`}
      onClick={handleClick}
      disabled={isPending}
    >
      {optimisticIsLiked ? (
        <HeartIconSolid className="w-7 h-7 [&>path]:stroke-[1.7] [&>path]:stroke-red-600 fill-red-600" />
      ) : (
        <HeartIconOutline className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
      )}
      <span className="text-strokeClr">{optimisticLikesCount}</span>
    </button>
  );
}

export default ArticleActionBtns;
