"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { editPost } from "../_lib/actions";
import { useMainContext } from "./MainContext";
import EditPostImageCorousal from "./EditPostImageCorousal";

function EditPostMenu({
  setIsEditPostOpen,
  entirePostForEditPostMenu,
  entireProfileForEditPostMenu,
}) {
  const [descLength, setDescLength] = useState(
    entirePostForEditPostMenu?.description,
  );
  const [curPost] = useState(entirePostForEditPostMenu);
  const [postOwner] = useState(entireProfileForEditPostMenu);
  const { isDarkTrue } = useMainContext();

  const ref = useRef();
  const closeRef = useRef();
  const formRef = useRef();

  if (!entirePostForEditPostMenu || !entireProfileForEditPostMenu) return;

  function handleFormSubmission(e) {
    e.preventDefault();

    const updatedDesc = descLength.replace(/\s+/g, " ").trim();
    const prevDesc = curPost.description.replace(/\s+/g, " ").trim();
    const isDescChanged = updatedDesc !== prevDesc;

    if (!isDescChanged) {
      setIsEditPostOpen(false);
    }

    if (isDescChanged) {
      const form = formRef.current;

      const input = document.createElement("input");
      input.type = "text";
      input.name = `postOwnerId`;
      input.style.display = "none";
      input.value = postOwner.id;
      form.appendChild(input);

      const input1 = document.createElement("input");
      input1.type = "text";
      input1.name = `postId`;
      input1.style.display = "none";
      input1.value = curPost.id;
      form.appendChild(input1);

      form.requestSubmit();

      setTimeout(() => {
        form.removeChild(input);
        form.removeChild(input1);
      }, 1000);
    }
  }

  let mouseDownTarget = null;

  const handleMouseDown = (e) => {
    mouseDownTarget = e.target;
  };

  const handleMouseUp = (e) => {
    const modalWindowId = document.getElementById(
      "editModalWindowParentMouseEventsId",
    );

    if (!modalWindowId) return;

    const startedInside = modalWindowId?.contains(mouseDownTarget);
    const endedInside = modalWindowId?.contains(e.target);

    if (!startedInside && !endedInside) {
      if (e.target === e.currentTarget) {
        setIsEditPostOpen(false);
      }
    }
  };

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-[100dvh] z-[7000] bg-[#100f0fdb]"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={ref}
        id="editModalWindowParentMouseEventsId"
        className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-postIniBtm w-[470px] h-[500px] sm:h-auto sm:w-[757px] md:w-[956px] lg:w-[1025px] max-w-[304px] sm:max-w-[665px] md:max-w-[756px] lg:max-w-[1155px] 2xl:w-[1812px] aspect-[3/2] rounded-3xl flex flex-col items-center overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "calc(100dvh - 50px)" }}
      >
        <>
          <div className="w-full flex justify-between items-center p-3 border-b-[1px] border-b-postIniBdrBtm z-40 rounded-t-3xl bg-postIniTop">
            <button
              onClick={() => setIsEditPostOpen(false)}
              className="text-strokeClr"
            >
              Cancel
            </button>
            <p className="font-semibold text-strokeClr">Edit post</p>
            <button
              type="submit"
              form="myFormId"
              className={`text-blue-700 hover:underline ${isDarkTrue ? "text-blue-400 hover:text-blue-300" : "hover:text-blue-800"} capitalize font-semibold text-sm`}
              onClick={handleFormSubmission}
            >
              Done
            </button>
          </div>
          <div
            className={`w-full h-full flex rounded-b-3xl relative bg-postIniBtm flex-col sm:flex-row`}
          >
            <EditPostImageCorousal imagesArr={curPost?.post_images} />

            <div className="flex flex-col flex-grow p-3 w-full sm:w-[35%] shrink-0">
              <div
                className={`flex items-center gap-4 pb-3 ${isDarkTrue ? "" : "border-b border-slate-200"}`}
              >
                <div className="w-[32px] h-[32px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
                  {postOwner?.avatar ? (
                    <Image
                      src={postOwner?.avatar}
                      alt="article photo"
                      fill
                      sizes="468px"
                      className="rounded-md object-fill"
                      quality={100}
                      priority
                    />
                  ) : (
                    <UserIcon className="w-[21px] h-[21px] [&>path]:stroke-[1]" />
                  )}
                </div>
                <div className="flex-grow text-sm font-semibold text-strokeClr">
                  {postOwner && postOwner.username}
                </div>
              </div>
              <form
                id="myFormId"
                action={editPost}
                onSubmit={(e) => {
                  setIsEditPostOpen(false);
                }}
                ref={formRef}
                className="flex-grow border-0"
              >
                <textarea
                  className="resize-none w-full !h-[100%] outline-none bg-postIniBtm caret-strokeClr text-strokeClr"
                  name="postDesc"
                  id="add-post-desc-name"
                  maxLength={2200}
                  value={descLength}
                  onChange={(e) => setDescLength(e.target.value)}
                ></textarea>
              </form>
              <div
                className={`${isDarkTrue ? "" : "border-t border-slate-200"} pt-3 flex justify-end items-center text-slate-400 text-sm`}
              >
                {descLength.length}/2,200
              </div>
            </div>
          </div>
        </>
      </div>

      <button
        className="fixed z-[7000] top-3 right-3 text-xl text-slate-100 cursor-pointer"
        ref={closeRef}
        onClick={(e) => {
          setIsEditPostOpen(false);
        }}
      >
        ✕
      </button>
    </div>,
    document.body,
  );
}

export default EditPostMenu;
