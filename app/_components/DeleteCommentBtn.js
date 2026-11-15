"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { deleteComment, deletePost, deleteUser } from "../_lib/actions";
import toast from "react-hot-toast";

function DeleteCommentBtn({
  commentOwnerId,
  cmntId,
  setIsMiniModalOpened,
  setDelCmnBtnRefForCmntsPopUp,
  whichConfirmation,
  toPath,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { profileId } = params;

  async function handleDelCmnt(e) {
    e.preventDefault();

    const delPost = { commentOwnerId, cmntId, curPath: pathname };

    setDelCmnBtnRefForCmntsPopUp(false);
    setIsMiniModalOpened(false);
    await deleteComment(delPost);
  }

  async function handleDelPost(e) {
    e.preventDefault();

    const postOwnerId = commentOwnerId;
    const postId = cmntId;

    const delPost = { postOwnerId, postId, toPath };

    setIsMiniModalOpened(false);

    router.push("/");

    setTimeout(async () => {
      await deletePost(delPost);
    }, 500);
  }

  async function handleDelProfile(e) {
    e.preventDefault();

    const userId = { userID: profileId };

    setIsMiniModalOpened(false);

    const result = await deleteUser(userId);

    if (result) {
      if (result.success) {
        window.location.href = "/auth/signup";
      }

      if (!result.success) {
        toast.error(result?.message);
      }
    }
  }

  if (whichConfirmation === "commentDeleteConfirmation") {
    return (
      <button
        className="w-[400px] py-3 text-sm font-bold text-red-500"
        onClick={
          whichConfirmation === "commentDeleteConfirmation"
            ? handleDelCmnt
            : null
        }
      >
        Delete
      </button>
    );
  }

  if (whichConfirmation === "postDeleteConfirmation") {
    return (
      <button
        className="w-[400px] py-3 text-sm font-bold text-red-500"
        onClick={
          whichConfirmation === "postDeleteConfirmation" ? handleDelPost : null
        }
      >
        Delete
      </button>
    );
  }

  if (whichConfirmation === "profileDeleteConfirmation") {
    return (
      <button
        className="w-[400px] py-3 text-sm font-bold text-red-500"
        onClick={
          whichConfirmation === "profileDeleteConfirmation"
            ? handleDelProfile
            : null
        }
      >
        Delete
      </button>
    );
  }
}

export default DeleteCommentBtn;
