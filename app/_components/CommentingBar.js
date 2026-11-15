import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import InputField from "./InputField";

export default function CommentingBar({
  avatar,
  postId,
  loggedInUserId,
  postOwnerId,
  isPostModal,
  layoutKey,
}) {
  return (
    <div
      className={`w-full flex gap-2 items-center ${isPostModal ? "mt-5" : "md:mt-5"}`}
    >
      <div className="relative shrink-0 pt-2 pb-2">
        <div className="w-[32px] h-[32px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
          {avatar ? (
            <Image
              src={avatar}
              alt="commentor's avatar image"
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
      </div>
      <div className="flex-grow pt-2 pb-2 flex items-center">
        <InputField
          postId={postId}
          loggedInUserId={loggedInUserId}
          postOwnerId={postOwnerId}
          layoutKey={layoutKey}
          isPostModal={isPostModal}
        />
      </div>
    </div>
  );
}
