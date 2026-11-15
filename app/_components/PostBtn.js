import { useEffect } from "react";
import { ArrowUpOnSquareStackIcon } from "@heroicons/react/24/outline";
import { useMainContext } from "./MainContext";

function PostBtn({
  setCreateClicked,
  listenCapturing = true,
  plusBtnRef,
  onSetOpen,
  setSbExpanded,
  plusTxtRef,
}) {
  const { postBtnRef, sbRef, isMobile } = useMainContext();

  useEffect(() => {
    function handleClick(e) {
      if (!sbRef.current.contains(e.target)) {
        setCreateClicked(false);
        setSbExpanded(false);
      }

      if (!isMobile) {
        if (
          postBtnRef.current &&
          !postBtnRef.current.contains(e.target) &&
          !plusBtnRef.current.contains(e.target) &&
          !plusTxtRef.current.contains(e.target)
        ) {
          setCreateClicked(false);
        }
      }

      if (isMobile) {
        if (
          postBtnRef.current &&
          !postBtnRef.current.contains(e.target) &&
          !plusBtnRef.current.contains(e.target)
        ) {
          setCreateClicked(false);
        }
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [
    setCreateClicked,
    listenCapturing,
    plusBtnRef,
    plusTxtRef,
    postBtnRef,
    sbRef,
    setSbExpanded,
    isMobile,
  ]);

  return (
    <>
      <button
        ref={postBtnRef}
        className="top-12 bg-primaryClr absolute w-40 flex justify-between p-3 rounded-xl items-center border-b-[1px] border-primaryHvrClr shadow-[0_0_15px_7px_rgba(0,0,0,0.11)] z-[2000]"
        onClick={(e) => {
          setCreateClicked(false);
          onSetOpen(true);
          setSbExpanded(false);
        }}
      >
        <p className="text-[15px] text-strokeClr font-semibold">Post</p>
        <ArrowUpOnSquareStackIcon className="w-7 h-7 [&>path]:stroke-[1.5] [&>path]:stroke-strokeClr" />
      </button>
    </>
  );
}

export default PostBtn;
