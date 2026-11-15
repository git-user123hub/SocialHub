"use client";

import { usePathname } from "next/navigation";

function PostModalWindowWrapper({ children }) {
  const pathname = usePathname();

  if (!pathname?.startsWith("/posts/")) return null;

  return <div>{children}</div>;
}

export default PostModalWindowWrapper;
