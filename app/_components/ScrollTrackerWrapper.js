"use client";

import { useEffect, useState } from "react";
import ScrollTracker from "./ScrollTracker";

function ScrollTrackerWrapper({ currentLimit }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (isMounted) return <ScrollTracker currentLimit={currentLimit} />;
}

export default ScrollTrackerWrapper;
