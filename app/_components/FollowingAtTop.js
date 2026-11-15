import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function FollowingAtTop({ accFlwngProfile }) {
  const { id, avatar, username } = accFlwngProfile;

  const slicePrName = username.slice(0, 7);

  return (
    <div className="flex flex-col gap-2 max-w-fit justify-center items-center relative">
      <Link href={`/user/${id}`}>
        <div className="w-[65px] h-[65px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
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
            <UserIcon className="w-[60%] h-[60%] [&>path]:stroke-[1]" />
          )}
        </div>
      </Link>

      <Link href={`/user/${id}`}>
        <p>{slicePrName}...</p>
      </Link>
    </div>
  );
}

export default FollowingAtTop;
