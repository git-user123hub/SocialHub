"use client";

import { usePathname } from "next/navigation";
import { followIt, unFollowIt } from "../_lib/actions";
import { useMainContext } from "./MainContext";
import { useEffect, useState } from "react";
import SpinnerMini from "./SpinnerMini";
import toast from "react-hot-toast";

function SuggestedAccsFollowBtn({ curProfileId, isFollowing, curProUsername }) {
  const [isPending, setIsPending] = useState(false);
  const { curUser, isDarkTrue } = useMainContext();
  const pathname = usePathname();

  let loggedInUser;

  if (curUser) loggedInUser = curUser.id;

  async function handleFollow(e) {
    e.preventDefault();

    if (isPending) return;
    setIsPending(true);

    const followObj = {
      userToFollow: curProfileId,
      userFollowing: loggedInUser,
      curPath: pathname,
    };

    const followRes = await followIt(followObj);

    if (followRes) {
      setIsPending(false);

      if (followRes.success) {
        toast.success(`You followed the ${curProUsername}`);
      }

      if (!followRes.success) {
        toast.error("Something Went Wrong. Please Try Again Later.");
      }
    }
  }

  async function handleUnFollow(e) {
    e.preventDefault();

    if (isPending) return;
    setIsPending(true);

    const followObj = {
      userToFollow: curProfileId,
      userFollowing: loggedInUser,
      curPath: pathname,
    };

    const unFollowRes = await unFollowIt(followObj);

    if (unFollowRes) {
      setIsPending(false);

      if (unFollowRes.success) {
        toast.success(`You unfollowed the ${curProUsername}`);
      }

      if (!unFollowRes.success) {
        toast.error("Something Went Wrong. Please Try Again Later.");
      }
    }
  }

  return (
    <span
      className={`cursor-pointer text-sm font-semibold tracking-wide hover:underline shrink-0 ${isFollowing ? "text-strokeClr" : `text-blue-700 ${isDarkTrue ? "hover:text-blue-500" : "hover:text-blue-800"}`}`}
      onClick={isFollowing ? handleUnFollow : handleFollow}
      disabled={isPending}
    >
      <span className="flex justify-center items-center w-12">
        {isPending ? (
          <SpinnerMini />
        ) : (
          <>{isFollowing ? "Following" : "Follow"}</>
        )}
      </span>
    </span>
  );
}

export default SuggestedAccsFollowBtn;
