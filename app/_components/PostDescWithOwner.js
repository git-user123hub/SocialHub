import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import CreationTime from "./CreationTime";

function PostDescWithOwner({
  description,
  userProfile,
  isPostModal,
  postCreatedAt,
}) {
  const { id, username, avatar } = userProfile;

  return (
    <div
      className={`${isPostModal ? "flex" : "mb-2 md:mb-0 flex md:mt-3"} gap-3 w-full pt-2`}
    >
      <Link
        href={`/user/${id}`}
        className={`${isPostModal ? "" : ""} w-max shrink-0`}
      >
        <div className="w-[32px] h-[32px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
          {avatar ? (
            <Image
              src={avatar}
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
      </Link>

      <div className="flex-grow flex flex-col gap-0">
        <div className="text-sm flex gap-1 items-center">
          <Link href={`/user/${id}`} className="font-semibold text-strokeClr">
            {username}
          </Link>
          <span className="text-sm text-slate-500 flex-shrink-0">
            <CreationTime timesAgo={postCreatedAt} postLcl="articlePost" />
          </span>
        </div>
        <div className="w-full text-strokeClr break-all supports-[overflow-wrap:anywhere]:[overflow-wrap:anywhere] supports-[not(overflow-wrap:anywhere)]:[word-break:normal]">
          {description}
        </div>
      </div>
    </div>
  );
}

export default PostDescWithOwner;
