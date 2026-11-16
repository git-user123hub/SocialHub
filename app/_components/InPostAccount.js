import Link from "next/link";
import Image from "next/image";
import FollowBtn from "./FollowBtn";
import { EllipsisHorizontalIcon, UserIcon } from "@heroicons/react/24/outline";
import DropDownBtn from "./DropDownBtn";
import PostCnctCreationTimeWrapper from "./PostCnctCreationTimeWrapper";

async function InPostAccount({
  post,
  userProfile,
  loggedInUser,
  isPostOwner,
  isFollowing,
  isPostModal,
  curPostModalPath,
}) {
  const { id: postOwnerId, username, avatar } = userProfile;

  const additionalProps = {
    isPostOwner: isPostOwner,
    postId: post.id,
    postOwnerId: post.post_user_id,
    loggedInUserId: loggedInUser.id,
    isFollowing: isFollowing,
    isPostModal: isPostModal,
    curPostModalPath: curPostModalPath,
  };

  return (
    <div
      className={`${isPostModal ? "border-b border-b-primaryHvrClr absolute top-0 left-0 right-0 md:static md:top-auto md:right-auto md:left-auto" : "absolute top-0 left-0 right-0 md:static md:top-auto md:left-auto md:right-auto md:border-b md:border-b-primaryHvrClr"} w-full flex items-center px-5 py-4`}
    >
      <div className="flex justify-between items-center w-full gap-8">
        <Link href={`/user/${postOwnerId}`} className="flex gap-3 items-center">
          <div className="w-[32px] h-[32px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4] shrink-0">
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

          <div className="font-semibold text-sm text-strokeClr flex gap-2 items-center">
            <span>{username}</span>
            <PostCnctCreationTimeWrapper
              isPostModal={isPostModal}
              PostCreatedAt={post?.created_at}
              inWhichPostPart="InPostAccount"
            />
          </div>
        </Link>

        <div className="flex items-center gap-3 h-8 flex-shrink-0">
          {!isPostOwner && (
            <div className="min-[767px]:max-[1024px]:hidden">
              <FollowBtn
                name={`${isFollowing ? "Following" : "Follow"}`}
                curProfileId={postOwnerId}
                isFollowing={isFollowing}
                whichBtn="quickFollowBtn"
                curProUsername={userProfile?.username}
              />
            </div>
          )}

          <DropDownBtn
            btnName={
              <EllipsisHorizontalIcon className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
            }
            ddType="singlePostMoreOptionsList"
            additionalProps={additionalProps}
            entirePostForEditPostMenu={post}
            entireProfileForEditPostMenu={userProfile}
            whichConfirmation="postDeleteConfirmation"
          />
        </div>
      </div>
    </div>
  );
}

export default InPostAccount;
