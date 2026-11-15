"use client";

import Link from "next/link";
import { useState } from "react";

function NotificationBody({ commentOnPost, notificationDesc }) {
  const [isCmntExpanded, setIsCmntExpanded] = useState(false);

  let isMentioned = commentOnPost?.comment_body
    ?.trim()
    ?.replace(/\s+/g, " ")
    ?.startsWith("@", 0);

  let cmntMention =
    isMentioned &&
    commentOnPost?.comment_body?.trim()?.replace(/\s+/g, " ")?.split(" ").at(0);

  let cmntbody = isMentioned
    ? commentOnPost?.comment_body
        ?.trim()
        ?.replace(/\s+/g, " ")
        ?.slice(
          commentOnPost?.comment_body
            ?.trim()
            ?.replace(/\s+/g, " ")
            ?.indexOf(" ") + 1,
        )
    : commentOnPost?.comment_body;

  let mentionedHref =
    isMentioned && commentOnPost?.comment_owner_id
      ? `/user/${commentOnPost?.comment_owner_id}`
      : `/${commentOnPost?.comment_body
          ?.trim()
          ?.replace(/\s+/g, " ")
          ?.split(" ")
          .at(0)}`;

  function handleExpand(e) {
    e.stopPropagation();

    setIsCmntExpanded((prevSt) => !prevSt);
  }

  return (
    <>
      <span> {notificationDesc + " "}</span>
      {isMentioned ? (
        <p className="inline-block">
          <Link
            href={mentionedHref}
            className="text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {cmntMention}
          </Link>{" "}
          {cmntbody?.length >= 85 ? (
            <>
              {isCmntExpanded ? cmntbody : cmntbody?.slice(0, 84)}
              {!isCmntExpanded ? "... " : " "}
              <button
                className="text-sm text-textPryClr"
                onClick={handleExpand}
              >
                {isCmntExpanded ? "less" : "more"}
              </button>{" "}
            </>
          ) : (
            <>{cmntbody} </>
          )}
        </p>
      ) : (
        <p className="inline-block">
          {cmntbody?.length > 85 ? (
            <>
              {isCmntExpanded ? cmntbody : cmntbody?.slice(0, 84)}
              {!isCmntExpanded ? "... " : " "}
              <button
                className="text-sm text-textPryClr"
                onClick={handleExpand}
              >
                {isCmntExpanded ? "less" : "more"}
              </button>{" "}
            </>
          ) : (
            <>{cmntbody} </>
          )}
        </p>
      )}
    </>
  );
}

export default NotificationBody;
