"use client";

import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { useMainContext } from "./MainContext";
import { savePost } from "../_lib/actions";
import toast from "react-hot-toast";

function BookmarkBtn({ isSaved, postId, loggedInUserId }) {
  const { curUser } = useMainContext();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const [optimisticIsSaved, optimisticSave] = useOptimistic(
    isSaved,
    (curIsSaved) => {
      return curIsSaved ? (curIsSaved = false) : (curIsSaved = true);
    },
  );

  async function handleClick(e) {
    e.preventDefault();

    startTransition(async () => {
      const saveObj = {
        postId: postId,
        curUserId: curUser.id,
        curPath: pathname,
      };

      optimisticSave(saveObj);
      const postSaveUnsave = await savePost(saveObj);

      if (postSaveUnsave.success) {
        if (postSaveUnsave?.isSaved) {
          toast.success("Post saved");
        }

        if (postSaveUnsave?.isUnSaved) {
          toast.success("Post unsaved");
        }
      }

      if (!postSaveUnsave.success) {
        toast.error("Something Went Wrong. Please Try Again Later.");
      }
    });
  }

  return (
    <button
      className={`flex items-center flex-shrink-0`}
      onClick={handleClick}
      disabled={isPending}
    >
      {optimisticIsSaved ? (
        <BookmarkIconSolid className="w-7 h-7 [&>path]:stroke-strokeClr fill-strokeClr [&>path]:stroke-[1.7]" />
      ) : (
        <BookmarkIconOutline className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
      )}
    </button>
  );
}

export default BookmarkBtn;
