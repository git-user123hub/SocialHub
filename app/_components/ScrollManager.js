"use client";

import { useEffect } from "react";
import { useMainContext } from "./MainContext";

function ScrollManager() {
  const { isTablet } = useMainContext();

  useEffect(() => {
    if (isTablet) {
      document.documentElement.style.scrollbarWidth = "none";
      document.documentElement.style.scrollBehavior = "auto";
    }

    if (!isTablet) {
      document.documentElement.style.scrollbarWidth = "auto";
      document.documentElement.style.scrollBehavior = "auto";
    }
  }, [isTablet]);

  return null;
}

export default ScrollManager;
