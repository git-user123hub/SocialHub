"use client";

import { useEffect } from "react";
import { useMainContext } from "./MainContext";

function ArticleMCmntsToggler({ children, postId }) {
  const { isMobile, mobileCmntPostId, isCmtSectOpen } = useMainContext();

  useEffect(() => {
    if (isCmtSectOpen) {
      document.querySelector("html").style.scrollbarGutter = "stable";
      document.body.style.overflow = "hidden";
    } else {
      document.querySelector("html").style.scrollbarGutter = "auto";
      document.body.style.overflow = "visible";
    }
  }, [isCmtSectOpen]);

  if (isMobile) {
    if (mobileCmntPostId !== postId) {
      return null;
    }

    if (mobileCmntPostId === postId) {
      return <>{children}</>;
    }
  }
}

export default ArticleMCmntsToggler;
