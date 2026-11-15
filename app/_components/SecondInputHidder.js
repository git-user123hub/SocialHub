"use client";

import { useEffect, useState } from "react";
import CommentingBar from "./CommentingBar";
import { useMainContext } from "./MainContext";

function SecondInputHidder({
  isPostModal,
  avatar,
  postId,
  loggedInUserId,
  postOwnerId,
  layoutKey,
}) {
  const [isloaded, setIsLoaded] = useState(false);
  const [hideOrNot, setHideOrNot] = useState(false);
  const { isTablet } = useMainContext();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isloaded) {
      if (!isTablet && isPostModal) {
        setHideOrNot(true);
      }

      if (!isTablet && !isPostModal) {
        setHideOrNot(true);
      }

      if (isTablet && !isPostModal) {
        setHideOrNot(false);
      }
    }
  }, [isloaded, isTablet, isPostModal]);

  return (
    <>
      <div className={`${hideOrNot ? "block" : "hidden"}`}>
        <CommentingBar
          avatar={avatar}
          postId={postId}
          loggedInUserId={loggedInUserId}
          postOwnerId={postOwnerId}
          isPostModal={isPostModal}
          layoutKey={layoutKey}
        />
      </div>
    </>
  );
}

export default SecondInputHidder;
