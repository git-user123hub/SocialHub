import Link from "next/link";
import { getProfile } from "../_lib/inServer-services";

function buildCmt(cmtBody, parentCmtOwnerId) {
  const usernameWithAtRt = cmtBody.split(" ", 2).at(0);
  const regex = new RegExp(`^${usernameWithAtRt}\\s*`, "i");
  const result = cmtBody.replace(regex, "");
  let actualBody = result;
  const firstValue = cmtBody.split(" ", 2).at(0).split("@").at(1);
  let onlyUsername = firstValue;
  let wholeUsername = cmtBody.split(" ", 2).at(0);

  return { actualBody, onlyUsername, wholeUsername };
}

async function CommentBody({ cmtBody, comment }) {
  let isUserExist = comment.comment_owner_id && comment.commented_on;

  let parentCmtOwner = isUserExist
    ? await getProfile(comment.comment_owner_id)
    : null;

  const isStWithUsername = cmtBody
    ?.trim()
    ?.replace(/\s+/g, " ")
    ?.startsWith("@", 0);

  const cmtFunction = isStWithUsername && buildCmt(cmtBody, parentCmtOwner?.id);

  return (
    <>
      {comment.commented_on && comment.comment_owner_id && (
        <div className="w-full">
          <Link
            href={`/user/${parentCmtOwner?.id}`}
            className={`text-blue-700 hover:text-blue-500`}
          >
            {cmtFunction.wholeUsername}
          </Link>{" "}
          <span className="text-strokeClr">{cmtFunction.actualBody}</span>
        </div>
      )}

      {comment.commented_on && !comment.comment_owner_id && (
        <div className="w-full">
          <Link
            href={`/${cmtFunction.onlyUsername}`}
            className={`text-blue-700 hover:text-blue-500`}
          >
            {cmtFunction.wholeUsername}
          </Link>{" "}
          <span className="text-strokeClr">{cmtFunction.actualBody}</span>
        </div>
      )}

      {!comment.commented_on && (
        <div className="w-full">
          <span className="text-strokeClr">{cmtBody}</span>
        </div>
      )}
    </>
  );
}

export default CommentBody;
