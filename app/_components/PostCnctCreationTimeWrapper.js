"use client";

import { useEffect, useState } from "react";
import CreationTime from "./CreationTime";
import { useMainContext } from "./MainContext";

function PostCnctCreationTimeWrapper({
  PostCreatedAt,
  isPostModal,
  inWhichPostPart,
}) {
  const [isloaded, setIsLoaded] = useState(false);
  const { isTablet } = useMainContext();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isloaded) {
    if (inWhichPostPart === "InPostConnect") {
      if (!isTablet || isPostModal) {
        return (
          <>
            <CreationTime timesAgo={PostCreatedAt} postLcl="singlePost" />
          </>
        );
      }
    }

    if (inWhichPostPart === "InPostAccount") {
      if (isTablet) {
        return (
          <div className="inline-flex flex-shrink-0">
            <CreationTime timesAgo={PostCreatedAt} postLcl="articlePost" />
          </div>
        );
      }
    }
  }
}

export default PostCnctCreationTimeWrapper;
