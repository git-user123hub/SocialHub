"use client";

import Link from "next/link";
import FollowBtn from "./FollowBtn";
import DropDownBtn from "./DropDownBtn";

function ProfileConfBtns({
  isUserItself,
  curProfileId,
  isFollowing,
  curProUsername,
}) {
  return (
    <div className="w-full flex justify-center items-center gap-2">
      {isUserItself ? (
        <Link
          href={`/account/edit`}
          className={`h-9 rounded-lg min-[500px]:h-10 w-full bg-secBtnBg flex justify-center items-center px-5 hover:bg-secBtnBgHvr text-strokeClr cursor-pointer text-sm font-semibold`}
        >
          Edit Profile
        </Link>
      ) : (
        <FollowBtn
          name={`${isFollowing ? "UnFollow" : "Follow"}`}
          curProfileId={curProfileId}
          isFollowing={isFollowing}
          whichBtn="onAccountButton"
          curProUsername={curProUsername}
        />
      )}

      {isUserItself ? (
        <DropDownBtn
          btnName="Setting"
          ddType="profileSet"
          whichConfirmation="profileDeleteConfirmation"
        />
      ) : (
        <Link
          href={`/messages`}
          className={`h-9 rounded-lg min-[500px]:h-10 w-full bg-secBtnBg flex justify-center items-center px-5 hover:bg-secBtnBgHvr text-strokeClr cursor-pointer text-sm font-semibold`}
        >
          Message
        </Link>
      )}
    </div>
  );
}

export default ProfileConfBtns;
