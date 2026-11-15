"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "react-hot-toast";

function ToasterWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      id="toastWrapperId"
      style={{
        zIndex: 20000,
      }}
    >
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{
          margin: "-5px",
        }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            backgroundColor: "var(--color-white)",
            color: "var(--color-grey)",
          },
        }}
      />
    </div>,
    document.body,
  );
}

export default ToasterWrapper;
