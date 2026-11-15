"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import DeleteCommentBtn from "./DeleteCommentBtn";
import { useMainContext } from "./MainContext";

function MoreOptsMiniModalList({
  commentOwnerId,
  cmntId,
  setIsMiniModalOpened,
  whichConfirmation,
  toPath,
}) {
  const ref = useRef();
  const { setDelCmnBtnRefForCmntsPopUp } = useMainContext();

  useEffect(() => {
    setDelCmnBtnRefForCmntsPopUp(true);
  }, [setDelCmnBtnRefForCmntsPopUp]);

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-[100dvh] z-[13000] bg-slate-500/70">
      <div
        ref={ref}
        className={`fixed top-[10%] left-[50%] translate-x-[-50%] bg-primaryClr h-max rounded-2xl flex flex-col items-center max-w-[400px] sm:max-w-[500px] w-[80%]`}
      >
        {(whichConfirmation === "postDeleteConfirmation" ||
          whichConfirmation === "profileDeleteConfirmation") && (
          <>
            <div className="w-full py-5 text-strokeClr flex flex-col items-center gap-2 justify-center">
              <p className="text-2xl font-semibold text-strokeClr">
                Delete{" "}
                <>
                  {whichConfirmation === "postDeleteConfirmation" && (
                    <span>post</span>
                  )}
                  {whichConfirmation === "profileDeleteConfirmation" && (
                    <span>account</span>
                  )}
                </>
                ?
              </p>
              <p className="text-sm text-[rgb(106,113,122)] text-center">
                Are you sure you want to delete this{" "}
                <>
                  {whichConfirmation === "postDeleteConfirmation" && (
                    <span>post</span>
                  )}
                  {whichConfirmation === "profileDeleteConfirmation" && (
                    <span>account</span>
                  )}
                </>
                ?
              </p>
            </div>

            <div className="w-full h-[1px] bg-primaryHvrClr"></div>
          </>
        )}

        <DeleteCommentBtn
          commentOwnerId={commentOwnerId}
          cmntId={cmntId}
          setIsMiniModalOpened={setIsMiniModalOpened}
          setDelCmnBtnRefForCmntsPopUp={setDelCmnBtnRefForCmntsPopUp}
          whichConfirmation={whichConfirmation}
          toPath={toPath}
        />

        <div className="w-full h-[1px] bg-primaryHvrClr"></div>

        <button
          className="w-full py-3 text-strokeClr"
          onClick={(e) => {
            if (whichConfirmation === "commentDeleteConfirmation") {
              if (ref.current && ref.current.contains(e.target)) {
                setIsMiniModalOpened(false);
                setDelCmnBtnRefForCmntsPopUp(false);
              }
            }

            if (whichConfirmation === "postDeleteConfirmation") {
              setIsMiniModalOpened(false);
            }

            if (whichConfirmation === "profileDeleteConfirmation") {
              setIsMiniModalOpened(false);
            }
          }}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default MoreOptsMiniModalList;
