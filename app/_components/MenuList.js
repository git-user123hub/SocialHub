import { BookmarkIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import LogoutBtn from "./LogoutBtn";
import { useMainContext } from "./MainContext";
import Link from "next/link";
import ToggleDarkMode from "./ToggleDarkMode";

function MenuList({ listenCapturing = true, setMenuClicked, setSbExpanded }) {
  const { curUsrPro, menuBtnRef, menuTxtRef, sbRef, isMobile } =
    useMainContext();
  const ref = useRef();

  useEffect(() => {
    let mouseDownTarget = null;

    const handleMouseDown = (e) => {
      mouseDownTarget = e.target;
    };

    const handleMouseUp = (e) => {
      if (!ref?.current) return;

      const startedInside = ref?.current?.contains(mouseDownTarget);
      const endedInside = ref?.current?.contains(e.target);

      if (!startedInside && !endedInside) {
        if (!sbRef?.current?.contains(e.target)) {
          setMenuClicked(false);
          setSbExpanded(false);
        }

        if (!isMobile) {
          if (
            ref.current &&
            !ref.current.contains(e.target) &&
            !menuBtnRef.current.contains(e.target) &&
            !menuTxtRef.current.contains(e.target)
          ) {
            setMenuClicked(false);
          }
        }

        if (isMobile) {
          if (
            ref.current &&
            !ref.current.contains(e.target) &&
            !menuBtnRef.current.contains(e.target)
          ) {
            setMenuClicked(false);
          }
        }
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    setMenuClicked,
    listenCapturing,
    menuBtnRef,
    menuTxtRef,
    sbRef,
    setSbExpanded,
    isMobile,
  ]);

  return (
    <div
      ref={ref}
      className={`fixed top-[50px] right-1 bg-primaryClr w-[250px] rounded-2xl flex items-center flex-col justify-evenly gap-1 border border-primaryHvrClr text-[13px] px-2 py-5 lg:absolute lg:left-3 lg:bottom-[70px] lg:top-auto lg:right-auto z-[2000]`}
    >
      <Link
        href={`/account/edit`}
        prefetch={false}
        className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center"
        onClick={(e) => setMenuClicked(false)}
      >
        <span>
          <Cog8ToothIcon className="w-6 h-6 [&>path]:stroke-strokeClr" />
        </span>
        <span className="text-strokeClr">Settings</span>
      </Link>
      <Link
        href={`/user/${curUsrPro?.id}/saved`}
        prefetch={false}
        className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center"
        onClick={(e) => setMenuClicked(false)}
      >
        <span>
          <BookmarkIcon className="w-6 h-6 [&>path]:stroke-strokeClr" />
        </span>
        <span className="text-strokeClr">Saved</span>
      </Link>
      <ToggleDarkMode setSbExpanded={setSbExpanded} />
      <div className="bg-primaryHvrClr w-full h-1"></div>
      <LogoutBtn setMenuClicked={setMenuClicked} />
    </div>
  );
}

export default MenuList;
