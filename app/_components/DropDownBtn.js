"use client";

import { useEffect, useRef, useState } from "react";
import DropDownList from "./DropDownList";
import { useMainContext } from "./MainContext";
import EditPostMenu from "./EditPostMenu";
import MoreOptsMiniModalList from "./MoreOptsMiniModalList";

function DropDownBtn({
  btnName,
  ddType,
  additionalProps,
  entirePostForEditPostMenu,
  entireProfileForEditPostMenu,
  whichConfirmation,
}) {
  const [isClicked, setIsClicked] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const { setAboutEditPost } = useMainContext();
  const [ddBtnPos, setDDBtnPos] = useState(null);
  const [isMiniModalOpened, setIsMiniModalOpened] = useState(false);

  const btnRef = useRef();

  useEffect(() => {
    setAboutEditPost(isEditPostOpen);
    if (isEditPostOpen) {
      document.querySelector("html").style.scrollbarGutter = "stable";
      document.body.style.overflow = "hidden";
    } else {
      document.querySelector("html").style.scrollbarGutter = "auto";
      document.body.style.overflow = "visible";
    }
  }, [isEditPostOpen, setAboutEditPost]);

  return (
    <>
      <div
        className={`${ddType === "profileSet" ? "h-9 min-[500px]:h-10 w-full relative" : "relative"} ${ddType === "article3DotsBtn" ? "flex" : ""}`}
      >
        <div
          className="relative h-hStretch max-h-max"
          style={{ height: "-webkit-fill-available" }}
        >
          <button
            ref={btnRef}
            className={`ddBtn ${ddType === "singlePostMoreOptionsList" || ddType === "article3DotsBtn" ? "flex justify-center items-center" : ""} ${ddType === "profileSet" ? "w-full h-full bg-secBtnBg flex justify-center items-center px-5 rounded-lg hover:bg-secBtnBgHvr text-strokeClr cursor-pointer text-sm font-semibold" : ""}`}
            style={{ height: "-webkit-fill-available" }}
            onClick={(e) => {
              const rect = e.target.closest(".ddBtn").getBoundingClientRect();

              setDDBtnPos(rect);
              setIsClicked((curSt) => !curSt);
            }}
          >
            {btnName}
          </button>

          {isClicked && (
            <DropDownList
              menuClicked={isClicked}
              setMenuClicked={setIsClicked}
              btnRef={btnRef.current}
              ddType={ddType}
              additionalProps={additionalProps}
              isEditPostOpen={isEditPostOpen}
              setIsEditPostOpen={setIsEditPostOpen}
              ddBtnPos={ddBtnPos}
              entireProfileForEditPostMenu={entireProfileForEditPostMenu}
              isMiniModalOpened={isMiniModalOpened}
              setIsMiniModalOpened={setIsMiniModalOpened}
            />
          )}
        </div>
      </div>

      {isEditPostOpen && (
        <EditPostMenu
          setIsEditPostOpen={setIsEditPostOpen}
          postID={additionalProps?.postId}
          ddType={ddType}
          entirePostForEditPostMenu={entirePostForEditPostMenu}
          entireProfileForEditPostMenu={entireProfileForEditPostMenu}
        />
      )}

      {isMiniModalOpened && (
        <MoreOptsMiniModalList
          setIsMiniModalOpened={setIsMiniModalOpened}
          whichConfirmation={whichConfirmation}
          additionalProps={additionalProps}
          commentOwnerId={additionalProps?.postOwnerId}
          cmntId={additionalProps?.postId}
          toPath={additionalProps?.curPostModalPath}
        />
      )}
    </>
  );
}

export default DropDownBtn;
