"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function PathTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/auth")) return;

    const timeoutId = setTimeout(() => {
      document.cookie = `last-valid-path=${encodeURIComponent(pathname)}; path=/; SameSite=Lax`;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}

export default PathTracker;
