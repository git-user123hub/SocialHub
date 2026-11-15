"use client";

import { createPortal } from "react-dom";

function RemoveAvatarImageMiniModalList({
  setRemoveOrUpload,
  setPreview,
  setHasFile,
  fileRef,
  isUploadRef,
  setStartEdit,
}) {
  return createPortal(
    <div className="fixed top-0 left-0 w-full h-[100dvh] z-[13000] bg-slate-500/70">
      <div
        className={`fixed top-[10%] left-[50%] translate-x-[-50%] bg-primaryClr h-max rounded-2xl flex flex-col items-center w-[71%] min-[500px]:max-w-[570px] min-[500px]:w-hStretch`}
      >
        <p className="w-full py-3 text-lg font-normal text-strokeClr flex justify-center items-center">
          Change Profile Photo
        </p>
        <div className="w-full h-[1px] bg-primaryHvrClr"></div>
        <button
          className="w-full py-3 text-sm font-bold text-blue-500"
          onClick={(e) => {
            setStartEdit(true);
            setRemoveOrUpload(false);
            isUploadRef.current = true;
            if (fileRef?.current) {
              fileRef?.current?.click();
            }
          }}
        >
          Upload Photo
        </button>
        <div className="w-full h-[1px] bg-primaryHvrClr"></div>
        <button
          className="w-full py-3 text-sm font-bold text-red-500"
          onClick={(e) => {
            setStartEdit(true);
            setRemoveOrUpload(false);
            setPreview(null);
            setHasFile(null);
            if (fileRef?.current?.value) {
              fileRef.current.value = "";
            }
          }}
        >
          Remove Current Photo
        </button>
        <div className="w-full h-[1px] bg-primaryHvrClr"></div>
        <button
          className="w-full py-3 text-strokeClr text-base"
          onClick={(e) => setRemoveOrUpload(false)}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default RemoveAvatarImageMiniModalList;
