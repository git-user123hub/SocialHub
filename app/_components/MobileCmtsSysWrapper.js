"use client";

import { useEffect, useRef } from "react";
import { useMainContext } from "./MainContext";
import CommentingBar from "./CommentingBar";

function MobileCmtsSysWrapper({
  children,
  postId,
  loggedInUserId,
  postOwnerId,
  cmntsLength,
  isPostModal,
  isInArticle,
  descLength,
}) {
  const {
    isTablet,
    isCmtSectOpen,
    setIsCmtSectOpen,
    curUsrPro,
    mobileCmntPostId,
    setMobileCmntPostId,
    delCmnBtnRefForCmntsPopUp,
    isDarkTrue,
  } = useMainContext();

  const popUpCmntsRef = useRef();

  useEffect(() => {
    if (isCmtSectOpen) {
      document.querySelector("html").style.scrollbarGutter = "stable";
      document.body.style.overflow = "hidden";
    } else {
      document.querySelector("html").style.scrollbarGutter = "auto";
      document.body.style.overflow = "visible";
    }
  }, [isCmtSectOpen]);

  useEffect(() => {
    let mouseDownTarget = null;

    const handleMouseDown = (e) => {
      mouseDownTarget = e.target;
    };

    const handleMouseUp = (e) => {
      if (!popUpCmntsRef.current) return;

      const startedInside = popUpCmntsRef.current?.contains(mouseDownTarget);
      const endedInside = popUpCmntsRef.current?.contains(e.target);

      if (!startedInside && !endedInside) {
        if (!delCmnBtnRefForCmntsPopUp) {
          if (
            popUpCmntsRef.current &&
            !popUpCmntsRef.current?.contains(e.target)
          ) {
            setIsCmtSectOpen(false);
            setMobileCmntPostId(null);
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
  }, [setIsCmtSectOpen, setMobileCmntPostId, delCmnBtnRefForCmntsPopUp]);

  useEffect(() => {
    if (!isTablet) {
      if (isCmtSectOpen) {
        setIsCmtSectOpen(false);
      }
    }
  }, [isTablet, isCmtSectOpen, setIsCmtSectOpen]);

  if (!curUsrPro) return null;

  if (!isPostModal) {
    if (!isTablet) {
      return <>{children}</>;
    }

    if (isTablet) {
      if (isCmtSectOpen) {
        return (
          <div
            ref={popUpCmntsRef}
            id="isTabletIsCmnt"
            className={`md:hidden fixed w-full left-0 right-0 bottom-0 flex flex-col bg-mainClr min-h-44 h-[430px] z-[10000] text-strokeClr rounded-t-[30px] overflow-hidden`}
          >
            <p
              className={`text-strokeClr font-semibold text-[18px] w-full h-14 flex justify-center items-center z-[11000] border-b border-b-primaryHvrClr ${isDarkTrue ? "bg-[#0a0a0a]" : "bg-mainClr"}`}
            >
              Comments
            </p>
            <div
              className="flex flex-col gap-6 px-5 h-hStretch overflow-scroll pt-[5px]"
              style={{
                scrollbarWidth: "none",
                height: "-webkit-fill-available",
              }}
            >
              {cmntsLength <= 0 && descLength === 0 && (
                <div className="w-full h-full flex justify-center items-center text-strokeClr font-semibold text-xl">
                  No comments yet
                </div>
              )}
              {(cmntsLength !== 0 || descLength !== 0) && children}
            </div>
            <div className="px-5 bg-mainClr w-full h-14 z-[11000] border-t border-t-primaryHvrClr flex items-center">
              <CommentingBar
                avatar={curUsrPro?.avatar}
                postId={postId}
                loggedInUserId={loggedInUserId}
                postOwnerId={postOwnerId}
                layoutKey="MobileCmtsLayout"
              />
            </div>
          </div>
        );
      }
    }
  }

  if (isPostModal) {
    if (!isInArticle) {
      return <>{children}</>;
    }

    if (isInArticle) {
      if (isTablet) {
        if (isCmtSectOpen) {
          if (mobileCmntPostId === postId) {
            return (
              <div
                id="isTabletIsCmntPost"
                className="md:hidden fixed w-full left-0 right-0 bottom-0 h-dvh bg-slate-700/20 flex flex-col justify-end z-[10000]"
              >
                <div
                  ref={popUpCmntsRef}
                  className={`flex flex-col bg-mainClr min-h-44 h-[430px] text-strokeClr rounded-t-[30px] overflow-hidden`}
                >
                  <p
                    className={`text-strokeClr font-semibold text-[18px] w-full h-14 flex justify-center items-center z-[11000] border-b border-b-primaryHvrClr ${isDarkTrue ? "bg-[#0a0a0a]" : "bg-mainClr"}`}
                  >
                    Comments
                  </p>
                  <div
                    className="px-5 h-hStretch overflow-scroll pt-[5px]"
                    style={{
                      scrollbarWidth: "none",
                      height: "-webkit-fill-available",
                    }}
                  >
                    {cmntsLength <= 0 && (
                      <div className="w-full h-full flex justify-center items-center text-strokeClr font-semibold text-xl">
                        No comments yet
                      </div>
                    )}
                    {cmntsLength > 0 && children}
                  </div>
                  <div className="px-5 bg-mainClr w-full h-14 z-[11000] border-t border-t-primaryHvrClr flex items-center">
                    <CommentingBar
                      avatar={curUsrPro?.avatar}
                      postId={postId}
                      loggedInUserId={loggedInUserId}
                      postOwnerId={postOwnerId}
                    />
                  </div>
                </div>
              </div>
            );
          }
        }
      }
    }
  }
}

export default MobileCmtsSysWrapper;
