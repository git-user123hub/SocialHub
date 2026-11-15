"use client";

import { useEffect, useState } from "react";

function SSPMobileCmntsWrapper({ children }) {
  const [isloaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isloaded) {
    return <>{children}</>;
  }
}

export default SSPMobileCmntsWrapper;
