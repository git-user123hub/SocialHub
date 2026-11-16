import { ClipboardIcon } from "@heroicons/react/24/outline";

function NoNotifyActivity({ curFilter }) {
  return (
    <div className="flex justify-center items-center pt-5">
      <div className="flex flex-col justify-center items-center gap-3">
        <ClipboardIcon
          className={`w-16 h-16 [&>path]:stroke-strokeClr [&>path]:stroke-[1]`}
        />

        <div className="font-semibold text-2xl">Activity On Your Posts</div>

        <>
          {curFilter === "NoNotifications" && (
            <p className="text-center text-sm">
              When someone follows you, likes your post, comments your post,
              likes your comment, or mentions you, you&apos;ll see it here.
            </p>
          )}

          {curFilter === "follows" && (
            <p className="text-center text-sm">
              Nothing here yet. New followers will show up here.
            </p>
          )}

          {curFilter === "postLikes" && (
            <p className="text-center text-sm">
              When someone likes on one of your posts, you&apos;ll see it here.
            </p>
          )}

          {curFilter === "comments" && (
            <p className="text-center text-sm">
              When someone comments on one of your posts, likes your comment, or
              mentions you, you&apos;ll see it here.
            </p>
          )}
        </>
      </div>
    </div>
  );
}

export default NoNotifyActivity;
