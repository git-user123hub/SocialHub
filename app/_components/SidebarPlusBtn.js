"use client";

import { PlusIcon as PlusIconOutline } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import PostBtn from "./PostBtn";
import AddPostMenu from "./AddPostMenu";
import { useMainContext } from "./MainContext";
import { usePathname } from "next/navigation";

function SidebarPlusBtn({ sbExpanded, setSbExpanded }) {
  const pathname = usePathname();

  const {
    open,
    setOpen,
    createClicked,
    setCreateClicked,
    plusBtnRef,
    plusTxtRef,
    createHvr,
    setCreateHvr,
    postBtnRef,
    setMenuClicked,
    isMobile,
    curUser,
  } = useMainContext();

  useEffect(() => {
    if (open) {
      setSbExpanded((currentlyExpanded) => {
        if (currentlyExpanded) return false;
        return currentlyExpanded;
      });
      document.querySelector("html").style.scrollbarGutter = "stable";
      document.body.style.overflow = "hidden";
    } else {
      document.querySelector("html").style.scrollbarGutter = "auto";
      document.body.style.overflow = "visible";
    }
  }, [open, setSbExpanded]);

  return (
    <>
      {isMobile && pathname === "/" && (
        <div
          ref={plusBtnRef}
          className={`${isMobile ? (pathname === "/" ? "" : "hidden") : ""} ${createHvr ? "bg-hoverClr" : ""} rounded-md cursor-pointer fixed top-0 left-0 lg:relative lg:rounded-tr-none lg:rounded-br-none ${!curUser ? "pointer-events-none" : ""}`}
          onMouseEnter={(e) => {
            const supportsHover = window.matchMedia("(hover: hover)").matches;

            if (!postBtnRef?.current?.contains(e.target)) {
              if (supportsHover) {
                setCreateHvr(true);
              }
            }
          }}
          onMouseLeave={(e) => setCreateHvr(false)}
          onClick={(e) => {
            e.preventDefault();
            setSbExpanded(true);
            setMenuClicked(false);
            setCreateClicked((c) => !c);
          }}
        >
          <div className="flex items-center px-2 py-2">
            <div>
              <PlusIconOutline className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
            </div>
          </div>
          {createClicked && sbExpanded && (
            <PostBtn
              setCreateClicked={setCreateClicked}
              onSetOpen={setOpen}
              sbExpanded={sbExpanded}
              setSbExpanded={setSbExpanded}
              plusBtnRef={plusBtnRef}
              plusTxtRef={plusTxtRef}
            />
          )}
        </div>
      )}

      {!isMobile && (
        <div
          ref={plusBtnRef}
          className={`${createHvr ? "bg-hoverClr" : ""} rounded-md cursor-pointer fixed top-0 left-0 lg:relative lg:rounded-tr-none lg:rounded-br-none ${!curUser ? "pointer-events-none" : ""}`}
          onMouseEnter={(e) => {
            if (!postBtnRef?.current?.contains(e.target)) {
              setCreateHvr(true);
            }
          }}
          onMouseLeave={(e) => setCreateHvr(false)}
          onClick={(e) => {
            e.preventDefault();
            setSbExpanded(true);
            setMenuClicked(false);
            setCreateClicked((c) => !c);
          }}
        >
          <div className="flex items-center px-2 py-2">
            <div>
              <PlusIconOutline className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
            </div>
          </div>
          {createClicked && sbExpanded && (
            <PostBtn
              setCreateClicked={setCreateClicked}
              onSetOpen={setOpen}
              sbExpanded={sbExpanded}
              setSbExpanded={setSbExpanded}
              plusBtnRef={plusBtnRef}
              plusTxtRef={plusTxtRef}
            />
          )}
        </div>
      )}

      {open && (
        <AddPostMenu onSetOpen={setOpen} setCreateClicked={setCreateClicked} />
      )}
    </>
  );
}

export default SidebarPlusBtn;
