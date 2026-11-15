import Link from "next/link";

function GridSavedBtn({ currentPath, btnBody, profileId, isUserItself }) {
  const hrefStr =
    btnBody?.btnType === "OwnPostsBtn"
      ? `/user/${profileId}`
      : `/user/${profileId}/saved`;

  const isActive = currentPath === hrefStr;

  if (!isUserItself) {
    if (btnBody?.btnType !== "SavedPostsBtn") {
      return (
        <Link
          href={hrefStr}
          prefetch={false}
          className={`w-fit cursor-pointer px-4 py-2 ${isActive ? "border-b-[2px] border-strokeClr" : ""}`}
        >
          {isActive ? btnBody.solidIcon : btnBody.outlineIcon}
        </Link>
      );
    }
  }

  if (isUserItself) {
    return (
      <Link
        href={hrefStr}
        prefetch={false}
        className={`w-fit cursor-pointer px-4 py-2 ${isActive ? "border-b-[2px] border-strokeClr" : ""}`}
      >
        {isActive ? btnBody.solidIcon : btnBody.outlineIcon}
      </Link>
    );
  }
}

export default GridSavedBtn;
