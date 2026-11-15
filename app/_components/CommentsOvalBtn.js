"use client";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { useMainContext } from "./MainContext";
import { useRouter } from "next/navigation";

function CommentsOvalBtn({ commentsCount = 0, postId, from, isPostModal }) {
  const { replyFocus, isTablet, setIsCmtSectOpen, setMobileCmntPostId } =
    useMainContext();
  const router = useRouter();

  function handleFocus(e) {
    if (replyFocus) {
      replyFocus?.focus();
    }
  }

  function handlePostFocus(e) {
    if (isTablet) {
      setIsCmtSectOpen((prevSt) => !prevSt);
      setMobileCmntPostId(postId);
    }

    if (!isTablet) {
      setIsCmtSectOpen(false);
      setMobileCmntPostId(null);
    }
  }

  function handlePostRouting(e) {
    router.push(`/posts/${postId}`, { scroll: false });
  }

  if (from === "article") {
    return (
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={isTablet ? handlePostFocus : handlePostRouting}
      >
        <ChatBubbleOvalLeftIcon className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
        {commentsCount > 0 && (
          <span className="text-strokeClr">{commentsCount}</span>
        )}
      </div>
    );
  }

  if (from === "post" && !isPostModal) {
    return (
      <button
        onClick={isTablet ? handlePostFocus : handleFocus}
        className="flex items-center gap-1"
      >
        <ChatBubbleOvalLeftIcon className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
        {commentsCount > 0 && (
          <span className="text-strokeClr">{commentsCount}</span>
        )}
      </button>
    );
  }

  if (from === "post" && isPostModal) {
    return (
      <button onClick={handleFocus} className="flex items-center gap-1">
        <ChatBubbleOvalLeftIcon className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
        {commentsCount > 0 && (
          <span className="text-strokeClr">{commentsCount}</span>
        )}
      </button>
    );
  }
}

export default CommentsOvalBtn;
