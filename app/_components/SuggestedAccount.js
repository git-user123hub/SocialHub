import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";
import SuggestedAccsFollowBtn from "./SuggestedAccsFollowBtn";

function SuggestedAccount({ sFollow, randProfile }) {
  if (!randProfile) return;

  const { id, avatar, username } = randProfile;

  let isFollowing = randProfile?.isFollowingTheUsr;

  return (
    <div className="flex items-center gap-4 p-3">
      <Link href={`/user/${id}`}>
        <div className="w-[42px] h-[42px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
          {avatar ? (
            <Image
              src={avatar}
              alt="article photo"
              fill
              sizes="468px"
              className="rounded-full object-fill"
              quality={100}
              priority
            />
          ) : (
            <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-[1.5]" />
          )}
        </div>
      </Link>

      <div className="flex-grow">
        <div className="mt-[-10px]">
          <Link
            href={`/user/${id}`}
            className="text-sm font-semibold text-strokeClr"
          >
            {username}
          </Link>
          <p className="text-sm text-textPryClr">
            {sFollow === "Follow" ? (
              "Suggested for you"
            ) : (
              <>{randProfile.fullname}</>
            )}
          </p>
        </div>
      </div>
      {sFollow === "Follow" && (
        <div className="min-w-10">
          <SuggestedAccsFollowBtn
            name={`${isFollowing ? "Following" : "Follow"}`}
            curProfileId={id}
            isFollowing={isFollowing}
            curProUsername={randProfile?.username}
          />
        </div>
      )}
    </div>
  );
}

export default SuggestedAccount;
