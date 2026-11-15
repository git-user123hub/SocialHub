"use client";

import nextDynamic from "next/dynamic";
import { MagnifyingGlassIcon as MagnifyingGlassIconOutline } from "@heroicons/react/24/outline";
import { useMainContext } from "./MainContext";
import { useEffect, useRef } from "react";

const SearchBar = nextDynamic(() => import("@/app/_components/SearchBar"));

function SidebarSearchBtn({ setSbExpanded }) {
  const { curUser, searchHvr, setSearchHvr, searchClicked, setSearchClicked } =
    useMainContext();

  const sdSearchBtnRef = useRef(null);

  useEffect(() => {
    if (searchClicked) {
      document.querySelector("html").style.scrollbarGutter = "stable";
      document.body.style.overflow = "hidden";
    } else {
      document.querySelector("html").style.scrollbarGutter = "auto";
      document.body.style.overflow = "visible";
    }
  }, [searchClicked]);

  return (
    <>
      <div
        ref={sdSearchBtnRef}
        tabIndex={!curUser ? -1 : 0}
        className={`${searchHvr ? "bg-hoverClr" : ""} rounded-md cursor-pointer lg:rounded-tr-none lg:rounded-br-none ${!curUser ? "pointer-events-none" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setSbExpanded(false);
          setSearchClicked((curSt) => !curSt);
        }}
        onMouseEnter={(e) => {
          const supportsHover = window.matchMedia("(hover: hover)").matches;

          if (supportsHover) {
            setSearchHvr(true);
          }
        }}
        onMouseLeave={(e) => setSearchHvr(false)}
      >
        <div className="flex items-center px-2 py-2">
          <div>
            <MagnifyingGlassIconOutline className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
          </div>
        </div>
      </div>
      {searchClicked && (
        <SearchBar
          setSearchClicked={setSearchClicked}
          sdSearchBtnRef={sdSearchBtnRef}
        />
      )}
    </>
  );
}

export default SidebarSearchBtn;
