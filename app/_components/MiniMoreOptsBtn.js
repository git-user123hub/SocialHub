"use client";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

function MiniMoreOptsBtn({
  setIsMiniModalOpened,
  //  setShow3Dots
}) {
  function handleClick(e) {
    setIsMiniModalOpened(true);
    // setShow3Dots(false);
  }

  return (
    <>
      <button
        className="h-max flex justify-center items-center"
        onClick={handleClick}
      >
        <EllipsisHorizontalIcon className="w-5 h-5 [&>path]:stroke-[1.7] [&>path]:stroke-slate-500" />
      </button>
    </>
  );
}
export default MiniMoreOptsBtn;
