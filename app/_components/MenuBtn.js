"use client";

import { Bars3Icon as Bars3IconOutline } from "@heroicons/react/24/outline";
import { useState } from "react";
import MenuList from "./MenuList";
import { useMainContext } from "./MainContext";
import { usePathname } from "next/navigation";

function MenuBtn({ sbExpanded, setSbExpanded, menuHvr, setMenuHvr }) {
  const {
    curUser,
    menuClicked,
    setMenuClicked,
    menuBtnRef,
    setCreateClicked,
    isMobile,
  } = useMainContext();
  const [menuBtnPosition, setMenuBtnPosition] = useState(null);

  const pathname = usePathname();

  return (
    <>
      <div
        ref={menuBtnRef}
        tabIndex={!curUser ? -1 : 0}
        className={`menuBtn ${menuHvr ? "bg-hoverClr" : ""} rounded-md cursor-pointer fixed top-0 right-[3px] lg:relative lg:right-0 lg:rounded-tr-none lg:rounded-br-none ${!curUser ? "pointer-events-none" : ""} ${isMobile ? (pathname === "/" || pathname.startsWith("/user/") ? "" : "hidden") : ""}`}
        onClick={(e) => {
          if (!curUser) {
            e.preventDefault();
          }

          const rect = e.target.closest(".menuBtn").getBoundingClientRect();

          setMenuBtnPosition(rect);
          setSbExpanded(true);
          setCreateClicked(false);
          setMenuClicked((curSt) => !curSt);
        }}
        onMouseEnter={(e) => {
          const supportsHover = window.matchMedia("(hover: hover)").matches;
          if (supportsHover) {
            setMenuHvr(true);
          }
        }}
        onMouseLeave={(e) => setMenuHvr(false)}
      >
        <div className="flex items-center px-2 py-2">
          <div>
            <Bars3IconOutline
              className={`w-7 h-7 [&>path]:stroke-strokeClr ${menuClicked ? "[&>path]:stroke-[2.5]" : ""}`}
            />
          </div>
        </div>
      </div>
      {menuClicked && sbExpanded && (
        <MenuList
          sbExpanded={sbExpanded}
          menuClicked={menuClicked}
          setMenuClicked={setMenuClicked}
          setSbExpanded={setSbExpanded}
          menuBtnPosition={menuBtnPosition}
        />
      )}
    </>
  );
}

export default MenuBtn;
