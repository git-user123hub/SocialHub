"use client";

import { useEffect, useState } from "react";
import { commentOnPost } from "../_lib/actions";
import { usePathname } from "next/navigation";
import { useMainContext } from "./MainContext";

function InputField({ postId, loggedInUserId, postOwnerId, layoutKey }) {
  const [comment, setComment] = useState("");
  const [ref, setRef] = useState(null);

  const { replyFocus, setReplyFocus, isDarkTrue, isTablet } = useMainContext();

  const pathname = usePathname();

  async function handleSubmit(e) {
    e.preventDefault();

    const cmtBodyBeforeFlat = e.target.elements.cmtBody.value;
    const cmtBody = cmtBodyBeforeFlat.trim().replace(/\s+/g, " ");

    const isStWithUsername = cmtBody.startsWith("@", 0);

    let actualBody;
    let wholeUsername;

    if (isStWithUsername) {
      const usernameWithAtRt = cmtBody.split(" ", 2).at(0);
      const regex = new RegExp(`^${usernameWithAtRt}\\s*`, "i");
      const result = cmtBody.replace(regex, "");
      actualBody = result;
      wholeUsername = cmtBody.split(" ", 2).at(0).trim().replace(/\s+/g, " ");
    }

    let cmtId = replyFocus?.getAttribute("data-cmtid");
    let cmtOwnrId = replyFocus?.getAttribute("data-commentownerid");
    let comtrUsername = replyFocus
      ?.getAttribute("data-comtrusername")
      ?.trim()
      ?.replace(/\s+/g, " ");

    let doesUsernameMatch = wholeUsername === comtrUsername;

    const commentObj = {
      postId,
      loggedInUserId,
      pathname,
      cmtBody,
      postOwnerId,
    };

    if (cmtId) {
      commentObj.realTargetUserId = cmtOwnrId;
      if (doesUsernameMatch) {
        commentObj.cmtId = cmtId;
        commentObj.cmtOwnrId = cmtOwnrId;
      }

      if (!doesUsernameMatch) {
        commentObj.cmtId = cmtId;
      }
    }

    setComment("");

    replyFocus.current?.removeAttribute("data-cmtid");
    replyFocus.current?.removeAttribute("data-commentownerid");
    replyFocus.current?.removeAttribute("data-comtrusername");

    await commentOnPost(commentObj);
  }

  useEffect(() => {
    if (ref) {
      setReplyFocus(ref);
    }
  }, [setReplyFocus, ref]);

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full">
      <textarea
        key={layoutKey}
        ref={setRef}
        type="text"
        name="cmtBody"
        className="w-full h-7 placeholder:text-base outline-none placeholder:text-slate-500 pl-1 field-sizing-content box-border resize-none leading-5 bg-mainClr caret-strokeClr text-strokeClr"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      ></textarea>
      {comment.length > 0 && (
        <button
          className={`text-blue-700 ${isDarkTrue ? "hover:text-blue-500" : "hover:text-blue-800"} text-sm font-semibold flex-shrink-0`}
        >
          Post
        </button>
      )}
    </form>
  );
}

export default InputField;
