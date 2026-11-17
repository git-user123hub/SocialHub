"use client";

import { useState } from "react";
import MiniMoreOptsBtn from "./MiniMoreOptsBtn";
import MoreOptsMiniModalList from "./MoreOptsMiniModalList";
import ReplyBtn from "./ReplyBtn";

function CommentHalfInteractiveSection({
  LikesCount,
  comment,
  userProfile,
  loggedInUserId,
  username,
  // show3Dots,
  // setShow3Dots,
}) {
  const [isMiniModalOpened, setIsMiniModalOpened] = useState(false);

  return (
    <>
      <div className="h-5 flex justify-start items-center gap-4 mt-2 text-sm font-semibold text-slate-500">
        {LikesCount > 0 && (
          <div className="flex gap-1">
            <span>{LikesCount}</span>
            <span>{LikesCount === 1 ? "like" : "likes"}</span>
          </div>
        )}
        <ReplyBtn
          parentCmtId={comment.id}
          username={username}
          commentOwnerId={userProfile.id}
        />
        {/* {show3Dots && (
          <> */}
        {comment.commented_by === loggedInUserId && (
          <MiniMoreOptsBtn
            setIsMiniModalOpened={setIsMiniModalOpened}
            // setShow3Dots={setShow3Dots}
          />
        )}
        {/* </>
        )} */}
      </div>

      {comment.commented_by === loggedInUserId && (
        <>
          {isMiniModalOpened && (
            <MoreOptsMiniModalList
              commentOwnerId={comment.commented_by}
              cmntId={comment.id}
              setIsMiniModalOpened={setIsMiniModalOpened}
              whichConfirmation="commentDeleteConfirmation"
            />
          )}
        </>
      )}
    </>
  );
}

export default CommentHalfInteractiveSection;
