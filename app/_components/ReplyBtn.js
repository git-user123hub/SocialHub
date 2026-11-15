"use client";

import { useMainContext } from "./MainContext";

function ReplyBtn({ parentCmtId, username, commentOwnerId }) {
  const { replyFocus } = useMainContext();

  function handleFocus(e) {
    if (replyFocus) {
      replyFocus.dataset.cmtid = parentCmtId;
      replyFocus.dataset.commentownerid = commentOwnerId;
      replyFocus.dataset.comtrusername = `@${username}`;
      replyFocus.value = `@${username} `;
      replyFocus.focus();
    }
  }
  return <button onClick={handleFocus}>Reply</button>;
}

export default ReplyBtn;
