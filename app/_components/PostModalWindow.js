"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMainContext } from "./MainContext";

function PostModalWindow({ children }) {
  const { aboutEditPost } = useMainContext();

  const router = useRouter();

  const closeRef = useRef();

  let mouseDownTarget = null;

  const handleMouseDown = (e) => {
    mouseDownTarget = e.target;
  };

  const handleMouseUp = (e) => {
    const modalWindowId = document.getElementById(
      "modalWindowParentMouseEventsId",
    );

    if (!modalWindowId) return;

    const startedInside = modalWindowId?.contains(mouseDownTarget);
    const endedInside = modalWindowId?.contains(e.target);

    if (!startedInside && !endedInside) {
      if (e.target === e.currentTarget) {
        router.back();
      }
    }
  };

  useEffect(() => {
    document.querySelector("html").style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";

    if (aboutEditPost || !aboutEditPost) {
      document.querySelector("html").style.scrollbarGutter = "stable";
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.querySelector("html").style.scrollbarGutter = "auto";
      document.body.style.overflow = "visible";
    };
  }, [aboutEditPost]);

  return (
    <div>
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="fixed inset-0 w-full h-[100dvh] z-[4000] flex items-center justify-center bg-[#100f0fdb]"
      >
        <div
          id="modalWindowParentMouseEventsId"
          className="w-[90%] h-[90%] md:max-w-[975px] lg:max-w-[1200px] flex justify-center items-center shadow-2xl pointer-events-none"
        >
          <div className="w-full h-full pointer-events-auto">
            <div className="w-full h-full flex justify-center items-center">
              <div className="w-full h-full flex">{children}</div>
            </div>
          </div>
        </div>
      </div>
      <button
        ref={closeRef}
        onClick={(e) => {
          e.stopPropagation();
          router.back();
        }}
        className="fixed z-[4000] max-[500px]:top-[5px] max-[500px]:right-[5px] top-3 right-3 min-[500px]:text-xl text-slate-100 cursor-pointer max-[500px]:w-[12px] max-[500px]:h-[20px]"
      >
        ✕
      </button>
    </div>
  );
}

export default PostModalWindow;
