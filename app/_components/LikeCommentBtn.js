"use client";

import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import { useMainContext } from "./MainContext";
import { usePathname } from "next/navigation";

function LikeCommentBtn({
  optimisticIsLiked,
  postId,
  cmntId,
  onClickLike,
  cmntPostOwnerId,
}) {
  const { curUser } = useMainContext();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  async function handleClick(e) {
    e.preventDefault();

    const likeObj = {
      postId: postId,
      curUserId: curUser.id,
      curPath: pathname,
      cmntId: cmntId,
      cmntPostOwnerId: cmntPostOwnerId,
    };

    startTransition(async () => {
      await onClickLike(likeObj);
    });
  }

  return (
    <button
      className={`w-7 shrink-0 flex justify-end`}
      onClick={handleClick}
      disabled={isPending}
    >
      {optimisticIsLiked ? (
        <HeartIconSolid className="w-5 h-5 [&>path]:stroke-[1.7] [&>path]:stroke-red-600 fill-red-600 " />
      ) : (
        <HeartIconOutline className="w-5 h-5 [&>path]:stroke-[1.7] [&>path]:stroke-slate-500" />
      )}
    </button>
  );
}

export default LikeCommentBtn;
