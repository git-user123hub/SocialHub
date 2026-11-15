"use client";

import { usePathname } from "next/navigation";
import { followIt, unFollowIt } from "../_lib/actions";
import { useMainContext } from "./MainContext";
import { useEffect, useState } from "react";
import SpinnerMini from "./SpinnerMini";
import toast from "react-hot-toast";

function FollowBtn({
  name,
  curProfileId,
  isFollowing,
  children,
  whichBtn,
  optionalProp,
  setMenuClicked,
  curProUsername,
}) {
  const [isPending, setIsPending] = useState(false);
  const [quickChange, setQuickChange] = useState(isFollowing);
  const { curUser, isDarkTrue } = useMainContext();
  const pathname = usePathname();

  let loggedInUser;

  if (curUser) loggedInUser = curUser.id;

  useEffect(() => {
    setQuickChange(isFollowing);
  }, [isFollowing]);

  async function handleFollow(e) {
    e.preventDefault();

    if (isPending) return;
    setIsPending(true);
    setQuickChange(true);

    const followObj = {
      userToFollow: curProfileId,
      userFollowing: loggedInUser,
      curPath: pathname,
    };

    if (
      whichBtn === "inPostDDFollowBtn" ||
      (whichBtn === "articleFollowBtn" && setMenuClicked)
    ) {
      setMenuClicked(false);
    }

    const followRes = await followIt(followObj);

    if (followRes) {
      setIsPending(false);
    }

    if (followRes?.success) {
      if (curProUsername) {
        toast.success(`You have followed the ${curProUsername}`);
      }
      if (optionalProp) {
        optionalProp(true);
      }
    }

    if (!followRes?.success) {
      setQuickChange(false);
      toast.error("Something Went Wrong. Please Try Again Later.");
    }
  }

  async function handleUnFollow(e) {
    e.preventDefault();

    if (isPending) return;
    setIsPending(true);
    setQuickChange(false);

    const followObj = {
      userToFollow: curProfileId,
      userFollowing: loggedInUser,
      curPath: pathname,
    };

    if (
      whichBtn === "inPostDDFollowBtn" ||
      (whichBtn === "articleFollowBtn" && setMenuClicked)
    ) {
      setMenuClicked(false);
    }

    const unFollowRes = await unFollowIt(followObj);

    if (unFollowRes) {
      setIsPending(false);
    }

    if (unFollowRes?.success) {
      if (curProUsername) {
        toast.success(`You have unfollowed the ${curProUsername}`);
      }
      if (optionalProp) {
        optionalProp(false);
      }
    }

    if (!unFollowRes?.success) {
      setQuickChange(true);
      toast.error("Something Went Wrong. Please Try Again Later.");
    }
  }

  if (whichBtn === "onAccountButton") {
    return (
      <button
        className={`h-9 rounded-lg min-[500px]:h-10 w-full flex justify-center items-center px-5 cursor-pointer text-sm font-semibold ${isFollowing ? "bg-secBtnBg hover:bg-secBtnBgHvr text-strokeClr" : "text-globalWhite bg-mainBlueBtn hover:bg-mainBlueBtnHvr"}`}
        onClick={isFollowing ? handleUnFollow : handleFollow}
      >
        {isPending ? <SpinnerMini /> : <>{name}</>}
      </button>
    );
  }

  if (whichBtn === "quickFollowBtn") {
    return (
      <span
        className={`cursor-pointer text-sm font-semibold tracking-wide hover:underline shrink-0 ${quickChange ? "text-strokeClr" : `text-blue-700 ${isDarkTrue ? "hover:text-blue-500" : "hover:text-blue-800"}`}`}
        onClick={quickChange ? handleUnFollow : handleFollow}
        disabled={isPending}
      >
        <span>{quickChange ? "Following" : "Follow"}</span>
      </span>
    );
  }

  if (whichBtn === "inPostDDFollowBtn") {
    return (
      <button
        className={`hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center ${isDarkTrue ? "text-red-400" : "text-red-600"}`}
        onClick={isFollowing ? handleUnFollow : handleFollow}
      >
        <span>{name}</span>
      </button>
    );
  }

  if (whichBtn === "articleFollowBtn") {
    return (
      <button
        className={`bg-secBtnBg hover:bg-secBtnBgHvr text-strokeClr flex justify-center items-center py-[7px] px-5 rounded-lg cursor-pointer text-sm font-semibold`}
        onClick={isFollowing ? handleUnFollow : handleFollow}
      >
        <span>
          {isPending ? (
            <SpinnerMini />
          ) : (
            <>{quickChange ? "Following" : "Follow"}</>
          )}
        </span>
      </button>
    );
  }

  if (whichBtn === "notificationBtn") {
    return (
      <button
        className={`w-max shrink-0 flex justify-center items-center px-5 py-2 rounded-lg text-globalWhite cursor-pointer text-sm font-semibold ${quickChange ? `text-strokeClr bg-primaryClr ${isDarkTrue ? "hover:bg-primaryHvrClr" : ""}` : `bg-blue-700 ${isDarkTrue ? "hover:bg-blue-500" : "hover:bg-blue-800"}`} gap-1 min-w-24`}
        onClick={quickChange ? handleUnFollow : handleFollow}
        disabled={isPending}
      >
        {isPending ? (
          <SpinnerMini />
        ) : (
          <>{quickChange ? "Following" : "Follow Back"}</>
        )}
      </button>
    );
  }
}

export default FollowBtn;
